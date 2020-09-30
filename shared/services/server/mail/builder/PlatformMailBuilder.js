import React from 'react';
import Mail from 'shared/services/server/mail/entities/Mail';
import UrlService from 'shared/services/common/UrlService';
import CoreService from 'shared/services/common/CoreService';

export default class PlatformMailBuilder {
	static getCreateAccountMail() {
		return new Mail(
			"¡Bienvenido a MarketingItPlatform!",
			(user) => {
					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr><td>
							<p>Hola {user.name},</p>
							<p>El equipo de MarketingItPlatform te da la bienvenida. Te recomendamos experimentar con los servicios que ponemos a tu alcance. Recuerda que disfrutarás de un mes completamente gratuito desde que actives tu primer servicio.</p>
							<p>Comienza tu experiencia en https://marketingitplatform.com</p>
						</td></tr>
					</table>);
			}
		);
	}

	static getResetPasswordMail(resetPasswordUrl) {
		return new Mail(
			"Reestablecer contraseña",
			(user) => {
					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr><td>
							<p>Hola {user.name},</p>
							<p>Hemos recibido una solicitud para reestablecer tu contraseña, si no has sido tú, ignora este email.</p>
							<p>Para reestablecer tu contraseña pulsa en este enlace: <a href={resetPasswordUrl}>{resetPasswordUrl}</a></p>
						</td></tr>
					</table>);
			}
		);
	}

	static getUnsatisfaiedInstallmentsMail(installments) {
		let creditUrl = UrlService.getCreditUrl();
		return new Mail(
			"Hay pagos pendientes a la espera de crédito",
			(user) => {

					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr><td>
							<p>Hola {user.name},</p>
							{PlatformMailBuilder.getInstallmentsTable(installments)}
							<p>Los siguientes servicios están a la espera de fondos en tu bolsa de crédito:</p>
							<p>Puedes depositar crédito para satisfacer los pagos aquí: <a href={creditUrl}>{creditUrl}</a></p>
						</td></tr>
					</table>);
			}
		);
	}

	static getSatisfaiedInstallmentsMail(installments) {
		let paymentPlanUrl = UrlService.getPaymentPlanUrl();
		return new Mail(
			"Se ha efectuado el cobro de tus servicios",
			(user) => {
					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr><td>
							<p>Hola {user.name},</p>
							<p>Se ha efectuado el cobro de los siguientes servicios:</p>
							{PlatformMailBuilder.getInstallmentsTable(installments)}
							<p>Puedes revisar el detalle de las operaciones aquí: <a href={paymentPlanUrl}>{paymentPlanUrl}</a></p>
						</td></tr>
					</table>);
			}
		);
	}

	static getUnsatisfaiedInstallmentsMail(installments) {
		let creditUrl = UrlService.getCreditUrl();
		return new Mail(
			"Hay pagos pendientes a la espera de crédito",
			(user) => {
					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr><td>
							<p>Hola {user.name},</p>
							<p>Los siguientes servicios están a la espera de fondos en tu bolsa de crédito:</p>
							{PlatformMailBuilder.getInstallmentsTable(installments)}
							<p>Puedes depositar crédito para satisfacer los pagos aquí: <a href={creditUrl}>{creditUrl}</a></p>
						</td></tr>
					</table>);
			}
		);
	}

	static getInstallmentsTable(installments) {
		return <table align="center" border="1" cellPadding="0" cellSpacing="0" width="100%">
			<tr>
				<td>Servicio</td>
				<td>Fecha de cargo</td>
				<td>Importe</td>
			</tr>
			{installments.map((item, i) => <tr key={i}>
				<td>{item.productName}</td>
				<td>{item.chargeDate.format('l')}</td>
				<td>CoreService.formatPrice(item.chargeAmount)</td>
			</tr>)}
		</table>;
	}

	static getCreateTransferRequestMail(transferData) {
		let creditUrl = UrlService.getCreditUrl();
		return new Mail(
			"Esperando transferencia bancaria",
			(user) => {
					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr>
							<td>
								<p>Hola {user.name},</p>
								<p>Hemos recibido tu solicitud de depósito de crédito. Para completarla debes realizar la transferencia bancaria con los datos indicados a continuación:</p>
								<table className="table">
									<tr>
										<th scope="row">IBAN:</th>
										<td className="border-0">{transferData.account}</td>
									</tr>
									<tr>
										<th scope="row">Concepto:</th>
										<td>{transferData.concept}</td>
									</tr>
									<tr>
										<th scope="row">Importe:</th>
										<td>{CoreService.formatPrice(transferData.amount)}</td>
									</tr>
								</table>
								<p>Puedes consultar el estado de esta transacción en <a href={creditUrl}>{creditUrl}</a>.</p>
								<p>Permanecerá en estado pendiente hasta recibir los fondos.</p>
							</td>
						</tr>
					</table>);
			}
		);
	}

	static getConsolidateTransferRequestMail(transferData) {
		let creditUrl = UrlService.getCreditUrl();
		return new Mail(
			"Transferencia bancaria recibida",
			(user) => {
					return PlatformMailBuilder.getDefaultTemplate(<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr>
							<td>
								<p>Hola {user.name},</p>
								<p>Hemos recibido tu transferencia bancaria con concepto {transferData.concept} con importe {CoreService.formatPrice(transferData.amount)}.</p>
								<p>Ya la hemos sumado a tu crédito. Puedes consultarlo en <a href={creditUrl}>{creditUrl}</a></p>
							</td>
						</tr>
					</table>);
			}
		);
	}

	static getDefaultTemplate(contentElement) {
		return <body>
					<table align="center" border="0" cellPadding="0" cellSpacing="0" width="100%">
						<tr><td><h3>MarketingItPlatform</h3></td></tr>
						<tr>
							<td style={{paddingLeft: "20px", paddingRight: "20px"}}>
								{contentElement}
							</td>
						</tr>
						<tr>
							<td style={{paddingLeft: "20px", paddingRight: "20px"}}>
								<br/>
								<br/>
								David Yuste,<br/>
								MarketingItPlatform
							</td>
						</tr>
					</table>
				</body>;
	}
}
