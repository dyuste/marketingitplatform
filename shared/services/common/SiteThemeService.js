import BaseTheme from 'shared/themes/base/Theme'

export default class SiteThemeService {
	static getTheme(themeId) {
		switch (themeId) {
			default:
				return new BaseTheme();
		}
	}

	static getThemes() {
		return [new BaseTheme()];
	}

};

module.exports = SiteThemeService;
