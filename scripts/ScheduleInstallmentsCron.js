import PaymentPlanService from 'shared/services/server/PaymentPlanService'

async function scheduleInstallments()
{
	await PaymentPlanService.mayRescheduleInstallments();
	process.exit(0);
}


scheduleInstallments();
