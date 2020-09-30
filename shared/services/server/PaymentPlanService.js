import CoreService from 'shared/services/server/CoreService';
import PaymentService from 'shared/services/server/PaymentService';
import AccountService from 'shared/services/server/AccountService';
import ProductService from 'shared/services/common/ProductService';
import PlatformMailBuilder from 'shared/services/server/mail/builder/PlatformMailBuilder';
import MailService from 'shared/services/server/mail/MailService';
import DataBaseAdapter from 'lib/database/'
import moment from 'moment';

export default class PaymentPlanService {
	static getAjaxServices() {
		return [
			{
				name: "getCurrentUserActiveProducts",
				handler: PaymentPlanService.srvGetCurrentUserActiveProducts,
				permissions: "user"
			},
			{
				name: "getInstallments",
				handler: PaymentPlanService.srvGetInstallments,
				permissions: "user"
			}
		];
	}

	static async boot() {
		let dataBaseAdapter = new DataBaseAdapter();
		dataBaseAdapter.query(
			`CREATE TABLE IF NOT EXISTS payment_plan (
				  id INT NOT NULL AUTO_INCREMENT,
				  creation_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
				  last_update_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				  user_id INT NOT NULL,
				  product_id INT NOT NULL,
				  product_type ENUM('landing', 'microsite') NOT NULL,
				  status ENUM('inactive', 'active') NOT NULL,
				  apply_change_dt DATETIME NOT NULL,
				  first_charge_dt DATETIME DEFAULT NULL,
				  charge_amount FLOAT DEFAULT NULL,
				  PRIMARY KEY (id),
				  INDEX (status, product_id, product_type),
				  INDEX (status, user_id, product_id, product_type),
				  INDEX (id, first_charge_dt))
				DEFAULT CHARACTER SET = utf8
				COLLATE = utf8_general_ci;`, []
		);

		dataBaseAdapter.query(
			`CREATE TABLE IF NOT EXISTS payment_installment (
				  id INT NOT NULL AUTO_INCREMENT,
				  creation_dt DATETIME DEFAULT CURRENT_TIMESTAMP,
				  last_update_dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				  user_id INT NOT NULL,
				  product_id INT NOT NULL,
				  product_type ENUM('landing', 'microsite') NOT NULL,
				  status ENUM('pending', 'payed', 'cancelled') NOT NULL DEFAULT 'pending',
				  charge_date_dt DATETIME NOT NULL,
				  consolidation_date_dt DATETIME,
				  charge_amount FLOAT DEFAULT NULL,
				  PRIMARY KEY (id),
				  INDEX (product_id, product_type, charge_date_dt),
				  INDEX (user_id, status, charge_date_dt),
				  INDEX (user_id, status))
				DEFAULT CHARACTER SET = utf8
				COLLATE = utf8_general_ci;`, []
		);
	}

	//
	// Product status
	//

	static async srvGetCurrentUserActiveProducts(req) {
		let products = await PaymentPlanService.getUserActiveProducts(req.user.id, req);
		let keys = Object.keys(products);
		let keysLen = keys.length;
		let result = [];
		for (var i = 0; i < keysLen; ++i) {
			if (products[keys[i]]) {
				result.push(products[keys[i]]);
			}
		}
		return {
			userActiveProducts: result
		};
	}

	static async getUserActiveProducts(userId, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		// Collect may be active products
		let productsData = await dataBaseAdapter.fetchColumns(
			`SELECT pp.id, pp.product_id, pp.product_type, pp.apply_change_dt, pp.first_charge_dt, pp.charge_amount, us.name, pp.user_id
				FROM payment_plan pp
				INNER JOIN(
					SELECT MAX(pp2.id) MaxId
					FROM payment_plan pp2
					WHERE pp2.status='active' AND pp2.user_id=?
					GROUP BY pp2.product_id, pp2.product_type
				) AS pp2 ON pp.id = pp2.MaxId
				LEFT JOIN user_sites us ON us.id = pp.product_id 
				ORDER BY first_charge_dt DESC;`, [userId], req
			);


		if (!productsData) 
			return [];

		// Collect "future" deactivation dates for above products
		let inactiveProductsData = await dataBaseAdapter.fetchColumns(
			`SELECT product_id, apply_change_dt, id
				FROM payment_plan pp
				INNER JOIN(
					SELECT MAX(id) MaxId
					FROM payment_plan pp2
					WHERE status='inactive' AND user_id=?
					GROUP BY product_id, product_type
				)  AS pp2 ON pp.id = pp2.MaxId;`, [userId], req
			);
		
		return PaymentPlanService.buildActiveProductsData(productsData, inactiveProductsData);;
	}

	static async getGlobalActiveProducts(req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		// Collect may be active products
		let productsData = await dataBaseAdapter.fetchColumns(
			`SELECT pp.id, pp.product_id, pp.product_type, pp.apply_change_dt, pp.first_charge_dt, pp.charge_amount, us.name, pp.user_id
				FROM payment_plan pp
				INNER JOIN(
					SELECT MAX(pp2.id) MaxId
					FROM payment_plan pp2
					WHERE pp2.status='active'
					GROUP BY pp2.product_id, pp2.product_type
				) AS pp2 ON pp.id = pp2.MaxId
				LEFT JOIN user_sites us ON us.id = pp.product_id 
				ORDER BY first_charge_dt DESC;`, [], req
			);


		if (!productsData) 
			return [];

		// Collect "future" deactivation dates for above products
		let inactiveProductsData = await dataBaseAdapter.fetchColumns(
			`SELECT product_id, apply_change_dt, id
				FROM payment_plan pp
				INNER JOIN(
					SELECT MAX(id) MaxId
					FROM payment_plan pp2
					WHERE status='inactive'
					GROUP BY product_id, product_type
				)  AS pp2 ON pp.id = pp2.MaxId;`, [], req
			);
		
		return PaymentPlanService.buildActiveProductsData(productsData, inactiveProductsData);;
	}

	static async getProductActiveStatus(productId, productType, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		// Collect may be active products
		let productsData = await dataBaseAdapter.fetchColumns(
			`SELECT pp.id, pp.product_id, pp.product_type, pp.apply_change_dt, pp.first_charge_dt, pp.charge_amount, us.name, pp.user_id
				FROM payment_plan pp
				INNER JOIN(
					SELECT MAX(pp2.id) MaxId
					FROM payment_plan pp2
					WHERE status='active' AND pp2.product_id=? AND pp2.product_type=?
				) AS pp2 ON pp.id = pp2.MaxId
				LEFT JOIN user_sites us ON us.id = pp.product_id 
				ORDER BY pp.first_charge_dt DESC;`, [productId, productType], req
			);


		if (!productsData) {
			return null;
		}

		// Collect "future" deactivation dates for above products
		let inactiveProductsData = await dataBaseAdapter.fetchColumns(
			`SELECT product_id, apply_change_dt, id
				FROM payment_plan pp
				INNER JOIN(
					SELECT MAX(id) MaxId
					FROM payment_plan pp2
					WHERE status='inactive' AND product_id=? AND product_type=?
				) AS pp2 ON pp.id = pp2.MaxId;`, [productId, productType], req
			);
		let products = PaymentPlanService.buildActiveProductsData(productsData, inactiveProductsData);
		return products[productId] ? products[productId] : null;
	}

	static buildActiveProductsData(productsData, inactiveProductsData)
	{
		let products = [];
		let productsDataLen = productsData.length;
		var i;
		let today = moment().startOf('day');
		for (i = 0; i < productsDataLen; ++i) {
			let productData = productsData[i];
			let product = {
				planItemId: productData[0],
				productId: productData[1],
				productName: productData[6],
				productType: productData[2],
				activationDate: moment(productData[3]),
				deactivationDate: null,
				firstChargeDate: moment(productData[4]),
				nextChargeDate: null,
				lastChargeDate: null,
				deactivated: false,
				chargeAmount: productData[5],
				userId: productData[7]
			}
			products[product.productId] = product;
		}
		
		let inactiveProductsDataLen = inactiveProductsData.length;
		for (i = 0; i < inactiveProductsDataLen; ++i) {
			let productData = inactiveProductsData[i];
			let productId = productData[0];
			if (products[productId]) {
				let deactivationDate = moment(productData[1]);
				let planItemId = productData[2];
				if (products[productId].activationDate.diff(deactivationDate) <= 0
					&& products[productId].planItemId < planItemId)
					products[productId].deactivationDate = deactivationDate;
			}
		}

		// Determine next charge dates
		let productIds = Object.keys(products);
		let productsLen = productIds.length;
		for (i = 0; i < productsLen; ++i) {
			let productId = productIds[i];
			let product = products[productId];
			var lastChargeDate = null;
			var nextChargeDate = product.firstChargeDate.clone();
			while (nextChargeDate.diff(today) <= 0) {
				lastChargeDate = nextChargeDate.clone();
				nextChargeDate.add(1, "months");
			}
			product.lastChargeDate = lastChargeDate;
			product.nextChargeDate = nextChargeDate;
			if (product.deactivationDate) {
				if (today.diff(product.deactivationDate) >= 0) 
					product.deactivated = true;
				if (lastChargeDate && lastChargeDate.diff(product.deactivationDate) > 0)
					delete products[productId];
			}
		}
		return products;
	}

	static async activateProduct(userId, productId, productType, req) {
		CoreService.dbgInspect("PaymentPlanService::activateProduct", 
			{userId, productId, productType}, req);
		let product = await PaymentPlanService.getProductActiveStatus(productId, productType);
		var activationDate = null;
		
		let deactivatedProduct = product && product.deactivated;
		if (deactivatedProduct || !product) {
			let applyChangeDate = moment();
			var firstChargeDate = null;
			if (deactivatedProduct)
				// If product has been deactivated within the last payed month, reuse its charge date
				firstChargeDate = product.firstChargeDate;
			else {
				// Otherwise, its payment plan was obsolet, thus create a new one starting from today or given firstChargeDate if any
				// ... unless under free month period
				let freeMonthLimitDate = await AccountService.mayStartFreeMonthPeriod(userId, req);
				if (freeMonthLimitDate && freeMonthLimitDate.diff(moment()) > 0)
					firstChargeDate = freeMonthLimitDate.add(1, 'day');
				else
					firstChargeDate = moment().startOf("day");
			} 

			let chargeAmount = ProductService.getProductTypePrice(productType);
			let dataBaseAdapter = new DataBaseAdapter();
			await dataBaseAdapter.query(
				`INSERT INTO payment_plan (user_id, product_id, product_type, status, apply_change_dt, first_charge_dt, charge_amount)
				 VALUES (?, ?, ?, ?, ?, ?, ?)`,
				 [userId, productId, productType, 'active',
				 applyChangeDate.format("YYYY-MM-DD 00:00:00"), firstChargeDate.format("YYYY-MM-DD 00:00:00"), chargeAmount.getAmount()],
				 req
				);

			await PaymentPlanService.mayRescheduleInstallmentsForProduct(productId, productType, req);
		}
	}

	static async deactivateProduct(userId, productId, productType, req) {
		let product = await PaymentPlanService.getProductActiveStatus(productId, productType);
		CoreService.dbgInspect("deactivateProduct", {userId, productId, productType, product}, req);
		if (product && !product.deactivated) {
			CoreService.dbgInspect("deactivateProduct proceed to deactivate", null, req);
			let dataBaseAdapter = new DataBaseAdapter();
			await dataBaseAdapter.query(
				`INSERT INTO payment_plan (user_id, product_id, product_type, status, apply_change_dt)
				 VALUES (?, ?, ?, ?, ?)`,
				 [userId, productId, productType, 'inactive', moment().format("YYYY-MM-DD 00:00:00")],
				 req
				);
		}
	}


	//
	// Installments management
	//
	static async srvGetInstallments(req)
	{
		return {
			installments: await PaymentPlanService.getInstallments(req.user.id, req)
		};
	}

	static async getInstallments(userId, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let installmentsData = await dataBaseAdapter.fetchColumns(
			`SELECT pi.id, pi.user_id, pi.product_id, pi.product_type, pi.status, pi.charge_date_dt, pi.charge_amount, us.name
				FROM payment_installment pi
				LEFT JOIN user_sites us ON us.id = product_id 
				WHERE pi.user_id=? AND (pi.status='pending' OR pi.charge_date_dt >= DATE_SUB(CURDATE(),INTERVAL 1 YEAR))
				ORDER BY pi.charge_date_dt DESC;`,
				[userId], req
			);

		return installmentsData.map(installment => PaymentPlanService.buildInstallmentFromDbRow(installment));
	}

	static async getUserDebt(userId)
	{
		let installments = await PaymentPlanService.getInstallments(userId, req)
		let installmentsLen = installments.length;
		let debt = 0;
		for (var i = 0; i < installmentsLen; ++i) {
			let installment = installments[i];
			if (installment.isPending) {
				debt += installment.chargeAmount;
			}
		}
		return debt;
	}
	
	static async mayRescheduleInstallmentsForUser(userId, req)
	{
		let products = await PaymentPlanService.getUserActiveProducts(userId, req);
		let productsLen = products.length;
		for (var i = 0; i < productsLen; ++i){
			let product = products[i];
			await PaymentPlanService.mayRescheduleInstallmentsForProduct(product.productId, product.productType, req);
		}
	}

	static async mayRescheduleInstallments(req)
	{
		let products = await PaymentPlanService.getGlobalActiveProducts(req);
		let productsLen = products.length;
		for (var i = 0; i < productsLen; ++i){
			let product = products[i];
			if (product)
				await PaymentPlanService.mayRescheduleInstallmentsForProduct(product.productId, product.productType, req);
		}
	}

	static async mayRescheduleInstallmentsForProduct(productId, productType, req)
	{
		/* Cases:
			Inexistent Product
			  -> Do nothing

			Deactivated Product
			  -> Do nothing

			!Deactivated Product
			  nextChargeDate == today
			    exists installment(nextChargeDate, productId, productType)
			      is pending
			        -> Consolidate pending installments
			      !is pending
			        -> Do nothing
			    !exists ...
			      -> Create pending installment
			      -> Consolidate pending installments */
	
		let product = await PaymentPlanService.getProductActiveStatus(productId, productType);
		if (product && !product.deactivated) {
			let nextChargeDate = product.nextChargeDate;
			if (nextChargeDate.diff(moment(), "days") <= 0) {
				let userId = product.userId;
				let installment = await PaymentPlanService.getProductInstallmentAtDate(productId, productType, lastChargeDate, req);
				if (installment && installment.isPending) {
					await PaymentService.triggerUserPaymentPlanUpdateHooks(userId, req);
				}
				else if (!installment) {
					await PaymentPlanService.scheduleProductPendingInstallment(userId, productId, productType, lastChargeDate, product.chargeAmount, req);
					await PaymentService.triggerUserPaymentPlanUpdateHooks(userId, req);
				}

			}
		}
	}

	static async scheduleProductPendingInstallment(userId, productId, productType, chargeDate, amount, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let result = await dataBaseAdapter.query(
			`INSERT INTO payment_installment
				(user_id, product_id, product_type, status, charge_date_dt, charge_amount)
			 	VALUES (?, ?, ?, ?, ?, ?)`,
			 [userId, productId, productType, 'pending', chargeDate.format("YYYY-MM-DD 00:00:00"), amount],
			 req
			);
		if (!result || !result.insertId) {
			throw new Error("Fallo al registrar el pago ("+userId+", "+productId+","+productType+","+chargeDate.format("YYYY-MM-DD 00:00:00")+","+amount);
		}	
	}

	static async getProductInstallmentAtDate(productId, productType, installmentDate, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let installmentsData = await dataBaseAdapter.fetchColumns(
			`SELECT id, user_id, product_id, product_type, status, charge_date_dt, charge_amount
				FROM payment_installment
				WHERE product_id=? AND product_type=? AND charge_date_dt=?;`,
				[productId, productType, installmentDate.format("YYYY-MM-DD 00:00:00")],
				req
			);
		let installmentsDataLen = installmentsData.length;
		if (installmentsDataLen <= 1) return null;
		return PaymentPlanService.buildInstallmentFromDbRow(installmentsData[0]);
	}

	static buildInstallmentFromDbRow(installmentData)
	{
		return {
			installmentId: installmentData[0],
			userId: installmentData[1],
			productId: installmentData[2],
			productType: installmentData[3],
			productName: installmentData[7],
			isPending: installmentData[4] == "pending",
			isPayed: installmentData[4] == "payed",
			isCancelled: installmentData[4] == "cancelled",
			chargeDate: moment(installmentData[5]),
			chargeAmount: parseFloat(installmentData[6])
		};
	}

	static async mayConsolidateUserPendingInstallmentsWithCredit(userId, credit, req)
	{
		let dataBaseAdapter = new DataBaseAdapter();
		let pendingInstallments = await dataBaseAdapter.fetchColumns(
			`SELECT pi.id, pi.user_id, pi.product_id, pi.product_type, pi.status, pi.charge_date_dt, pi.charge_amount, us.name
				FROM payment_installment pi
				LEFT JOIN user_sites us ON us.id = product_id 
				WHERE pi.user_id=? AND status='pending' AND charge_date_dt <= CURDATE()
				ORDER BY charge_date_dt ASC;`,
				[userId], req
			);

		let consolidatedInstallmentIds = [];
		let unsatisfaiedInstallments = [];
		let consolidatedInstallments = [];
		let pendingInstallmentsLen = pendingInstallments.length;
		let consolidationDate = moment();
		for (var i = 0; i < pendingInstallmentsLen; ++i) {
			let installment = await PaymentPlanService.buildInstallmentFromDbRow(pendingInstallments[i]);
			let amount = installment.chargeAmount;
			if (amount <= credit) {
				credit -= amount;
				consolidatedInstallmentIds.push(id);
				installment.consolidationDate = consolidationDate;
				consolidatedInstallments.push(installment);
			} else 
				unsatisfaiedInstallmentIds.push(installment);
		}

		if (consolidatedInstallmentIds.length > 0)
			await dataBaseAdapter.query(
				`UPDATE payment_installment
					SET status='payed', consolidation_date_dt=CURDATE() 
				 WHERE id IN (`+consolidatedInstallmentIds.join(",")+`);`, [], req
				);

		let user = await AccountService.getUser(userId);
		if (consolidatedInstallments.length > 0)
			MailService.sendPlatformMail(
				[user],
				PlatformMailBuilder.getSatisfaiedInstallmentsMail(consolidatedInstallments)
			);
		if (unsatisfaiedInstallments.length > 0)
			MailService.sendPlatformMail(
				[user],
				PlatformMailBuilder.getUnsatisfaiedInstallmentsMail(unsatisfaiedInstallments)
			);

		return consolidatedInstallments;
	}
};

module.exports = PaymentPlanService;
