import PaymentService from 'shared/services/server/PaymentService';
import PaymentPlanService from 'shared/services/server/PaymentPlanService';
import CoreService from 'shared/services/server/CoreService';
import { getArguments } from './Common';

function usageError () {
	console.error("Invalid arguments, usage:");
	console.error("ConsolidatePayment.js --userId <number> --transferId <number> --amount <number>");
	process.exit(-1);
}

async function consolidateTransfer(userId, transferId, amount)
{
	let transactionSummaryBefore = await PaymentService.getSummary(userId);
	CoreService.rptInfo("[ConsolidateTransfer]("+userId+"/"+transferId+"/"+amount+"€) Previous state: credit " + transactionSummaryBefore.credit + ", pendingCredit " + transactionSummaryBefore.pendingCredit + ", pendingDebt " + transactionSummaryBefore.pendingDebt);
	
	await PaymentService.consolidateTransferRequest(userId, transferId, amount);

	let transactionSummaryAfter = await PaymentService.getSummary(userId);
	console.log("[ConsolidateTransfer]("+userId+"/"+transferId+"/"+amount+"€) Final state: credit " + transactionSummaryAfter.credit + ", pendingCredit " + transactionSummaryAfter.pendingCredit + ", pendingDebt " + transactionSummaryAfter.pendingDebt);
	
	process.exit(0);
}

const argMap = getArguments();
let userId = parseInt(argMap['userId']);
let transferId = parseInt(argMap['transferId']);
let amount = parseFloat(argMap['amount']);

if (!userId || !transferId || !amount) {
	usageError();
}

consolidateTransfer(userId, transferId, amount);

