import CoreService from 'shared/services/server/CoreService';
import PaymentPlanService from 'shared/services/server/PaymentPlanService';
import DataBaseAdapter from 'lib/database/';
import AccountService from 'shared/services/server/AccountService';
import PlatformMailBuilder from 'shared/services/server/mail/builder/PlatformMailBuilder';
import MailService from 'shared/services/server/mail/MailService';
import moment from 'moment';
import SensibleData from 'SensibleData.json';

export default class PaymentService {
	static getAjaxServices() {
		return [
			{
				name: "createTransferRequest",
				handler: PaymentService.srvCreateTransferRequest,
				permissions: "user"
			},
			{
				name: "getTransactions",
				handler: PaymentService.srvGetTransactions,
				permissions: "user"
			},
			{
				name: "getSummary",
				handler: PaymentService.srvGetSummary,
				permissions: "user"
			}
		];
	}

	static async boot() {
		let dataBaseAdapter = new DataBaseAdapter();

		dataBaseAdapter.query(
			`CREATE TABLE IF NOT EXISTS payment_credit_transactions (
				  id INT NOT NULL AUTO_INCREMENT,
				  creation_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
				  last_update_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				  user_id INT NOT NULL,
				  type ENUM('entry', 'payment') NOT NULL DEFAULT 'payment',
				  status ENUM('pending', 'consolidated', 'cancelled') NOT NULL DEFAULT 'pending',
				  amount FLOAT NOT NULL DEFAULT 0,
				  movement_date_dt DATETIME NOT NULL,
				  installment_id INT DEFAULT NULL,
				  PRIMARY KEY (id),
				  INDEX (user_id, status),
				  INDEX (user_id, status, movement_date_dt, id))
				DEFAULT CHARACTER SET = utf8
				COLLATE = utf8_general_ci;`, []
		);
	}

	static async srvCreateTransferRequest(req)
	{
		return {
			transactionId: await PaymentService.createTransferRequest(req.user.id, req.body.amount, req),
			userId: req.user.id
		};
	}

	static async createTransferRequest(userId, amount, req)
	{
		let parsedAmount = parseFloat(amount);
		if (!parsedAmount || parsedAmount <= 0) {
					CoreService.reportPaymentError("Wrong transfer request", {userId, amount}, req);
					throw new Error("Wrong transfer request (user " + userId +", amount "+amount+")")
		}

		let dataBaseAdapter = new DataBaseAdapter();
		let result = await dataBaseAdapter.query(
					`INSERT INTO payment_credit_transactions
						(user_id, type, amount, movement_date_dt, status)
					 	VALUES (?, 'entry', ?, ?, 'pending');`, 
					 		[userId, amount, moment().format('YYYY/MM/DD HH:mm:ss')],
					 		req
					);

		if (!result.insertId) {
			CoreService.reportPaymentError("Failed to insert entry into payment_credit_transactions", {
				userId: userId,
				entryAmount: amount,
				queryResult: result
			}, req);
			throw new Error("Failed to insert entry into payment_credit_transactions (user " + userId +","+")");
		} else {
			let user = await AccountService.getUser(userId);
			MailService.sendPlatformMail(
				[user],
				PlatformMailBuilder.getCreateTransferRequestMail({
					amount,
					concept: "MIP"+userId+"T"+result.insertId,
					account: SensibleData.accounting.incomesAccount.iban
				})
			);
		}



		return result.insertId;
	}
	
	static async consolidateTransferRequest(userId, transactionId, amount, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let transactionsData = await dataBaseAdapter.fetchColumns(
			`SELECT amount
				FROM payment_credit_transactions
				WHERE id=? AND user_id=?;`,
				[transactionId, userId]
			);
		if (!transactionsData || transactionsData.length != 1)
			throw new Error ("Par usuario-transacción no encontrado");
		
		let originalAmount = parseFloat(transactionsData[0][0]);
		if (originalAmount != amount)
			CoreService.rptIgnError("consolidateTransferRequest("+userId+", "+transactionId+", "+amount+") - Database amount ("+originalAmount+") not matching expected one.", null, req);

		await dataBaseAdapter.query(
			`UPDATE payment_credit_transactions
				SET status='consolidated', amount=?
				WHERE id=? AND user_id=?;`,
				[amount, transactionId, userId], req
			);

		let user = await AccountService.getUser(userId);
		await MailService.sendPlatformMail(
			[user],
			PlatformMailBuilder.getConsolidateTransferRequestMail({
				amount,
				concept: "MIP"+userId+"T"+transactionId
			})
		);

		await PaymentService.triggerUserPaymentPlanUpdateHooks(userId, req);
	}

	static async srvGetSummary(req)
	{
		return {summary: await PaymentService.getSummary(req.user.id, req)};
	}

	static async getSummary(userId, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let transactionsData = await dataBaseAdapter.fetchColumns(
			`SELECT type, amount, status
				FROM payment_credit_transactions
				WHERE user_id=? AND status='pending'
				ORDER BY id DESC;`,
				[userId]
			);

		var pendingDebt = 0, pendingCredit = 0;
		let transactionsDataLen = transactionsData.length;
		
		for (var i = 0; i < transactionsDataLen; ++i) {
			let transaction = transactionsData[i];
			let status = transaction[2];
			if (status == 'pending') {
				let type = transaction[0];
				let amount = parseFloat(transaction[1]);
				if (type == 'entry')
					pendingCredit += amount;
				else if (transaction == 'payment')
					pendingDebt += amount;
			}
		}

		// NOTA: Actualmente no se registran movimientos de pago si no hay saldo validado
		// Así que en realidad la totalidad de la deuda procede de getUserDebt
		// Si más adelante se permitieran pagos directos sin installmente, se debe actualizar
		// el código para evitar duplicar deuda
		pendingDebt += await PaymentPlanService.getUserDebt(userId, req)

		return {
			credit: await PaymentService.getUserCredit(userId),
			pendingDebt,
			pendingCredit
		};
	}

	static async srvGetTransactions(req)
	{
		return {
			transactions: await PaymentService.getTransactions(req.user.id)
		}
	}

	static async getTransactions(userId)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let transactionsData = await dataBaseAdapter.fetchColumns(
			`SELECT id, user_id, type, status, amount, movement_date_dt, installment_id
				FROM payment_credit_transactions
				WHERE user_id=? AND (status='pending' OR movement_date_dt >= DATE_SUB(CURDATE(),INTERVAL 1 YEAR))
				ORDER BY id DESC;`,
				[userId]
			);

		return transactionsData.map(transaction => PaymentService.buildTransactionFromDbRow(transaction));	
	}

	static buildTransactionFromDbRow(row)
	{
		return {
			transactionId: row[0],
			userId: row[1],
			credit: parseFloat(row[2]),
			isEntryType: row[2] == 'entry',
			isPaymentType: row[2] == 'payment',
			isPending:  row[3] == 'pending',
			isConsolidated:  row[3] == 'consolidated',
			isCancelled:  row[3] == 'cancelled',
			amount: parseFloat(row[4]),
			movementDate: moment(row[5]),
			installmentId: row[6]
		}
	}

	static async getUserCredit(userId)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let transactions = await dataBaseAdapter.fetchColumns(
			`SELECT SUM(amount) AS entries_sum
				FROM payment_credit_transactions
				WHERE user_id=? AND status='consolidated';`,
				[userId]
			);

		return transactions && transactions.length == 1 && transactions[0][0]
			? parseFloat(transactions[0][0])
			: 0;
	}


	//
	// Installment triggers
	//

	static async triggerUserPaymentPlanUpdateHooks(userId, req)
	{
		await PaymentService.mayConsolidateInstallments(userId, await PaymentService.getUserCredit(userId), req);
	}

	static async mayConsolidateInstallments(userId, credit, req)
	{
		let consolidatedInstallments = await PaymentPlanService.mayConsolidateUserPendingInstallmentsWithCredit(userId, credit, req);

		if (consolidatedInstallments) {
			let dataBaseAdapter = new DataBaseAdapter();
			let consolidatedInstallmentsLen = consolidatedInstallments.length;
			for (var i = 0; i < consolidatedInstallmentsLen; ++i) {
				let consolidatedInstallment = consolidatedInstallments[i];

				let result = await dataBaseAdapter.query(
					`INSERT INTO payment_credit_transactions
						(user_id, type, amount, movement_date_dt, installment_id, status)
					 	VALUES (?, 'payment', ?, ?, ?, 'consolidated');`, [
					 		userId,
					 		-consolidatedInstallment.chargeAmount,
					 		consolidatedInstallment.consolidationDate.format('YYYY/MM/DD HH:mm:ss'),
					 		consolidatedInstallment.installmentId,
					 	], req
					);

				if (!result.insertId) {
					CoreService.reportPaymentError("Failed to insert payment into payment_credit_transactions", {
						userId: userId,
						installmentInfo: consolidatedInstallment,
						queryResult: result
					}, req);
					throw new Error("Failed to insert payment into payment_credit_transactions (user " + userId +")")
				}
			}
		}
	}
};

module.exports = PaymentService;
