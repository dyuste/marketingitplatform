import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SitesService from 'shared/services/common/SitesService'

export default class Section extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let section = this.props.section;
		return this.renderLandingSection(section);
	}

	renderLandingSection(section) {
		let title = section.hasTitle && section.title
			? this.renderSectionTitle(section.title) : null;
		let body = section.hasBody && section.body 
			? this.renderSectionBody(section.body) : null;
		let image = section.hasImage && section.image && section.image.url
			? this.renderSectionImage(section.image) : null;

		let content = this.renderLandingSectionFormattedContent(section.format,
			title, body, image);
		return content;
	}

	renderLandingSectionFormattedContent(format, title, body, image) {
		switch (format) {
			case 1: // Título/Texto (1 columna)
				return (
					<div className="container">
						<div className="row">
							<div className="col-12">
								{title}
							</div>
							<div className="col-12">
								{body}
							</div>
						</div>
					</div>
					);
			case 2: // Imagen (1 columna)
				return (
					<div className="container">
						<div className="row">
							<div className="col-12">
								{image}
							</div>
						</div>
					</div>
					);
			case 3: // Título/Texto > Imagen (2 columnas)
				return (
					<div className="container">
					<div className="row">
							<div className="col-12">
								{title}
							</div>
							<div className="col-12 col-md-6">
								{body}
							</div>
							<div className="col-12 col-md-6">
								{image}
							</div>
						</div>
					</div>
					);
			case 4: // Título/Texto (2 columnas)
				return (
					<div className="container">
						<div className="row">
							<div className="col-12">
								{title}
							</div>
							<div className="col-12 col-md-6">
								{body}
							</div>
							<div className="col-hidden col-md-6">
							</div>
						</div>
						</div>
					);
			default:
				return (<div></div>);
		}
	}

	renderSectionTitle(title) {
		return <h2>{title}</h2>
	}

	renderSectionBody(body) {
		return <div className="section-body" dangerouslySetInnerHTML={{__html: body}} ></div>;
	}

	renderSectionImage(image) {
		return <img src={image.url} />
	}

}

Section.propTypes = {
    section: PropTypes.object.isRequired
};

