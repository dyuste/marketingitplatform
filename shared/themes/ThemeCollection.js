import BaseTheme from './base/Theme'

export default class ThemeCollection {
	static getThemes() {
		return [new BaseTheme()];
	}

};

module.exports = ThemeCollection;
