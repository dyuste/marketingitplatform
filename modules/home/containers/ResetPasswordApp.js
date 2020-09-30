import React, { Component } from 'react';
import CommonAppEnvelope from './CommonAppEnvelope';
import CommonForm from './CommonForm';

export class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <CommonAppEnvelope renderContentSection={this.renderContentSection} />
	}

	renderContentSection() {
		return (
			<div>
				<section className="content-section content-section-0"> 
					<div className="container">
						<div className="row">
							<div className="col-12 col-md-8 col-lg-6">
								<div className="card">
									<div className="card-header">
										<ul className="nav nav-tabs card-header-tabs">
											<li className="nav-item">
												<a className="nav-link" href="#">Reestablecer contraseña</a>
											</li>
										</ul>
									</div>
									<div className="card-body">
										<CommonForm />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			);
	}
}

export default App; 
