import ThemeCollection from 'shared/themes/ThemeCollection'

var Options = {};
var sass = require('node-sass');

function RenderOnServerStyles(options) {Options = options.options;}

RenderOnServerStyles.prototype.apply = function(compiler) {

	compiler.plugin('emit', function(compilation, callback) {
		let outputPath = Options.output ? Options.output : "";

		compilation.chunks.forEach(function(chunk) {
			console.log("Collect styles at " + chunk.name);

			var scssCollection = [];
			let outputCss = outputPath + chunk.name + '.css';

			chunk.forEachModule(function(module) {
				if (module.fileDependencies) {
					module.fileDependencies.forEach(function(filepath) {
						if (filepath.match(/\.(scss|less|sass|css)$/)) {
							if (scssCollection.indexOf(filepath) == -1) {
								console.log("Append " +filepath)
								scssCollection.push(filepath); 
							}
						}
					});
				}
			});

			if (scssCollection.length) {
				let sassContent = scssCollection.reduce((prevValue, curValue, index, vector) => {
						return prevValue + "@import '" + curValue + "';\n";
					}, "");

				var cssContent = "";
				try {				
					cssContent = sass.renderSync({
							data: sassContent,
							outFile: outputCss,
							outputStyle: 'compressed'
						}).css;
				} catch (e) {
					console.error(e.formatted);
					console.error(sassContent);
					throw new Error("Unrecoverable error while compiling styles");
				}

				compilation.assets[outputCss] = {
						source: function() {
							return cssContent;
						},
						size: function() {
							return cssContent.length;
						}
					};
			}
		});

		console.log("Compiling themes");
		let themes = ThemeCollection.getThemes();
		var i = 0; let n = themes.length;
		for (; i < n; ++i) {
			let theme = themes[i];
			let scssFile = theme.getScssFile();
			let outputCss = "./"+theme.getCssFile();
			if (scssFile && outputCss) {
				try {
					let cssContent = sass.renderSync({
						data: "@import './"+ scssFile + "';\n",
						outFile: outputCss,
						outputStyle: 'compressed'
					}).css;
					compilation.assets[outputCss] = {
						source: function() {
							return cssContent;
						},
						size: function() {
							return cssContent.length;
						}
					};
				} catch (e) {
					console.error("Error compiling theme SCSS (ignored)");
					console.error(e.formatted);
				}
			}
		}

		callback();
	});
};

module.exports = RenderOnServerStyles;
