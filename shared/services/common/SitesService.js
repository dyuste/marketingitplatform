import SitesGalleryService from 'shared/services/common/SitesGalleryService'

export default class SitesService {
	static getPagesFromConfiguration(configuration, excludedPage) {
		let totalPages = [];
		let modules = configuration.modules;
		let pages = modules.pages.pages;
		if (pages) {
			let pagesLen = pages.length, i = 0;
			for (; i < pagesLen; ++i) {
				let page = pages[i];
				if (!excludedPage || excludedPage.id != page.id) {
					let pageCopy = JSON.parse(JSON.stringify(page));
					if (pageCopy.links) {
						var j = 0, linksLen = pageCopy.links.length;
						for (; j < linksLen; ++j)
							pageCopy.links[j].links = [];
					}
					totalPages.push(pageCopy);
				}
			}
		}

		return totalPages;
	}

	static getPageRoutes(configuration) {
		let pages = SitesService.getPagesFromConfiguration(configuration);
		let routes = {};
		let pagesLen = pages.length;
		for (var i = 0; i < pagesLen; ++i) {
			let page = pages[i];
			var route = SitesService.getPageUrl(page);
			if (routes[route]) {
				route += "-" + page.id;
			}
			routes[route] = page;
		}
		return routes;
	}

	static getPageUrl(page) {
		return "/" + (page.title || page.id);
	}

	static getNormalizedConfiguration(siteData, configuration, writeFlow) {
		return {
			changes: configuration.changes ? configuration.changes : false,
			plan: SitesService.getNormalizedConfigurationPlans(siteData, configuration.plan || {}, writeFlow),
			modules: SitesService.getNormalizedModules(siteData, configuration.modules || {}, writeFlow),
		}
	}

	static getNormalizedConfigurationPlans(siteData, plan, writeFlow) {
		return {
			type: plan.type == "landing"
				? "landing"
				: "microsite"
		};
	}

	static getNormalizedModules(siteData, modules, writeFlow) {
		return {
			themeInfo: SitesService.getNormalizedModuleThemeInfo(siteData, modules.themeInfo || {}, writeFlow),
			generalInfo: SitesService.getNormalizedModuleGeneralInfo(siteData, modules.generalInfo || {}, writeFlow),
			headerInfo: SitesService.getNormalizedModuleHeaderInfo(siteData, modules.headerInfo || {}, writeFlow),
			pages: SitesService.getNormalizedModuleLandingPages(siteData, modules.pages !== null && typeof modules.pages === 'object' ? modules.pages : {}, writeFlow),
			contact: SitesService.getNormalizedModuleContact(siteData, modules.contact !== null && typeof modules.contact === 'object' ? modules.contact : {}, writeFlow),
			inscription: SitesService.getNormalizedModuleInscription(siteData, modules.inscription !== null && typeof modules.inscription === 'object' ? modules.inscription : {}, writeFlow),
		};
	}
	
	static getNormalizedModuleThemeInfo(siteData, info, writeFlow) {
		return {
			themeId: info.themeId || 0
		}
	}
	
	static getNormalizedModuleGeneralInfo(siteData, info, writeFlow) {
		return {
		};
	}

	static getNormalizedModuleHeaderInfo(siteData, info, writeFlow) {
		let headerLogo = SitesService.getNormalizedImageField(siteData, info.headerLogo, writeFlow);
		return {
			showHeader: info.showHeader ? true : false,
			headerLogo: headerLogo || null,
			headerLogo_hasImage: info.headerLogo_hasImage ? true : false,
			title: info.title || null,
			hasTitle: info.hasTitle ? true : false
		};
	}

	static getNormalizedModuleLandingPages(siteData, info, writeFlow) {
		let pages = Array.isArray(info.pages) ? info.pages : [];
		let normalizedPages = [];
		let pagesLen = pages.length;
		for (var i = 0; i < pagesLen; ++i) {
			let page = pages[i];
			if (page) {
				let normalizedPage = SitesService.getNormalizedModuleLandingPage(siteData, page, writeFlow);
				if (normalizedPage) {
					normalizedPages.push(normalizedPage);
				}
			}
		}
		return {pages: normalizedPages };
	}
	
	static getNormalizedModuleLandingPage(siteData, page, writeFlow) {
		return page !== null && typeof page === 'object'
			? {
				id: page.id || null,
				title: page.title || "",
				seo_title: page.seo_title || (!writeFlow ? page.title : "") || "",
				seo_keywords: page.seo_keywords || "",
				seo_description: page.seo_description || "",
				og_title: page.seo_title || (!writeFlow ? page.title : "") || "",
				og_description: page.seo_description || "",
				sections: SitesService.getNormalizedModuleLandingPageSections(siteData, page.sections || [], writeFlow),
			}
			: null;
	}

	static getNormalizedModuleLandingPageLinks(siteData, links, writeFlow) {
		if (links === true || links === false) {
			return links;
		} else if (Array.isArray(links)) {
			let normalizedLinks = [];
			links.map((value) => {
				let normalizedLink = SitesService.getNormalizedModuleLandingPage(siteData, value, null, writeFlow);
				if (normalizedLink)
					normalizedLinks.push(normalizedLink);
			});
			return normalizedLinks.length > 0 ? normalizedLinks : false
		} else {
			return false;
		}
	}

	static getNormalizedModuleLandingPageSections(siteData, sections, writeFlow) {
		let normalizedSections = [];
		let sectionsLen = sections.length;
		for (var i = 0; i < sectionsLen; ++i) {
			let section = sections[i];
			if (section) {
				let normalizedSection = SitesService.getNormalizedModuleLandingPageSection(siteData, section, 'landing', writeFlow);
				if (normalizedSection) {
					normalizedSections.push(normalizedSection);
				}
			}
		}
		return normalizedSections;
	}

	static getNormalizedModuleLandingPageSection(siteData, section, type, writeFlow) {
		let image = SitesService.getNormalizedImageField(siteData, section.image, writeFlow);
		return section !== null && typeof section === 'object'
			? {  
				type: section.type || type,
				id: section.id || null,
				format: section.format || 1,
				hasTitle: typeof(section.hasTitle) === "boolean" ? section.hasTitle : true,
				title: section.title || "",
				hasBody: typeof(section.hasBody) === "boolean" ? section.hasBody : true,
				body: section.body || "",
				hasImage: typeof(section.hasImage) === "boolean" ? section.hasImage : true,
				image: image
			}
			: null;
	}

	static getNormalizedModuleContact(siteData, module, writeFlow) {
		return module;
	}

	static getNormalizedModuleInscription(siteData, module, writeFlow) {
		return module;
	}

	static getNormalizedImageField(siteData, image, writeFlow) {
		if (writeFlow && typeof image === 'object' && image !== null) {
			return image.id ? image.id : null;
		} else if (!writeFlow && Number.isInteger(image)) {
			return SitesGalleryService.getImageById(siteData, image);
		}
	}
};

module.exports = SitesService;
