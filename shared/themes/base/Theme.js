import React from 'react'
import Header from 'shared/themes/base/Header'
import Section from './Section'
import SitesService from 'shared/services/common/SitesService'

export default class Theme {
	constructor() {
		this.id = 1;
	}

	getInnerContainerClass() {
		return 'base-theme';
	}

	getName() {
		return "flat";
	}
	
	getSectionComponent(data, index) {
		return <Section section={data.section}/>
	}

	getHeaderComponent(data) {
		return <Header page={data.page} headerInfo={data.headerInfo} />
	}

	getScssFile() {
		return 'shared/themes/base/Theme.scss';
	}

	getCssFile() {
		return 'static/themes/base.css';
	}

	renderPreview() {
		return <div style={{backgroundColor: "black", width: "100%", height: "100%"}}></div>;
	}

	getAssistantSeoStepsSettings() {
		return [
			{
				title: "Optimización para Google y otros motores de búsqueda",
				hint: "Suministran información a los motores de búsqueda como Google.",
				components: [
					{
						type: "textField", 
						label: "Título",
						hintLabel: "Aparecerá como título de esta página en los resultados de Google. <meta name=\"title\">",
						target: "pages",
						pageIndex: 0,
						field0: "seo_title"
					},
					{
						type: "textField", 
						label: "Descripción",
						hintLabel: "Aparecerá en Google como descripción de esta página, tras el título. <meta name=\"description\">",
						target: "pages",
						pageIndex: 0,
						field0: "seo_description"
					},
					{
						type: "textField", 
						label: "Keywords",
						hintLabel: "Palabras clave relacionadas con el contenido de esta página, asociadas a la búsqueda esperada del usuario. <meta name=\"keywords\">",
						target: "pages",
						pageIndex: 0,
						field0: "seo_keywords"
					},
				]
			},
			{
				title: "Optimización para Redes Sociales",
				hint: "Suministran información a las redes sociales para compartir enlaces.",
				components: [
					{
						type: "textField", 
						label: "Título",
						hintLabel: "Aparecerá como título de esta página en el enlace compartido. <meta name=\"og:title\">",
						target: "pages",
						pageIndex: 0,
						field0: "og_title"
					},
					{
						type: "textField", 
						label: "Descripción",
						hintLabel: "Encabezado del enlace compartido, tras el título. <meta name=\"og:description\">",
						target: "pages",
						pageIndex: 0,
						field0: "og_description"
					}
				]
			}
		];
	}

	getAssistantStepsSettings() {
		return [
			{
				title: "Sección principal",
				hint: "Aparece al comienzo y ocupa toda la página. La plantilla se adaptará a los datos que sumnistres. Todos son opcionales.",
				components: [
					{
						type: "siteImageGallery", 
						label: "Utilizar imagen en la sección principal",
						target: "pages/section",
						pageIndex: 0,
						sectionIndex: 0,
						field0: "hasImage",
						field1: "image",
					},
					{
						type: "comboCheckBoxTextField", 
						label: "Utilizar título en la sección principal",
						target: "pages/section",
						pageIndex: 0,
						sectionIndex: 0,
						field0: "hasTitle",
						field1: "title",
					},
					{
						type: "comboCheckBoxTextArea", 
						label: "Utilizar cuerpo de texto en la sección principal",
						target: "pages/section",
						pageIndex: 0,
						sectionIndex: 0,
						field0: "hasBody",
						field1: "body",
					},
				]
			},
			{ 
				title: "Sección secundaria",
				hint: "Aparece cuando el usuario hace scroll, tras la sección principal. Puedes incluir hasta tres subsecciones. Todos los datos son opcionales.",
				components: [
					{
						type: "sectionIterator", 
						label: "Añadir subsección",
						target: "pages/section",
						pageIndex: 0,
						sectionIndexMin: 1,
						sectionIndexMax: 3,
						components: [
							{
								type: "siteImageGallery", 
								label: "Utilizar imagen en esta subsección",
								field0: "hasImage",
								field1: "image",
							},
							{
								type: "comboCheckBoxTextField", 
								label: "Utilizar título en esta subsección",
								field0: "hasTitle",
								field1: "title",
							},
							{
								type: "comboCheckBoxTextArea", 
								label: "Utilizar cuerpo de texto en esta subsección",
								field0: "hasBody",
								field1: "body",
							},
						]
					}
				]
			}
		];
	}

	normalizeConfiguration(siteConfiguration) {
		var newConfiguration = null;
		var pages = siteConfiguration.configuration.editVersion.modules.pages.pages;
		let pagesLen = pages.length;
		if (pagesLen < 1) {
			newConfiguration = JSON.parse(JSON.stringify(siteConfiguration));
			pages = newConfiguration.configuration.editVersion.modules.pages.pages;
			pages.push(
				SitesService.getNormalizedModuleLandingPage(newConfiguration, {id: 1}));
		}
		let sectionsLen = pages[0].sections.length;
		if (sectionsLen < 1) {
			if (!newConfiguration) {
				newConfiguration = JSON.parse(JSON.stringify(siteConfiguration));
			}
			newConfiguration.configuration.editVersion.modules.pages.pages[0].sections.push(
				SitesService.getNormalizedModuleLandingPageSection(newConfiguration, {
					id: 1, 
					title: "Sección principal",
					body: "<p>Cuerpo de la sección principal</p>"
				}));
		}

		return newConfiguration? newConfiguration : siteConfiguration;
	}
};

module.exports = Theme;
