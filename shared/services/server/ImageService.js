import jimp from 'jimp';

export default class ImageService {
	static createThumbnail(inputFile, outputFile) {
		let promise = new Promise((accept, reject) => {
			try {
				jimp.read(inputFile)
					.then((img) => {
						img.resize(256, 256)
							.quality(80)
							.write(outputFile, accept);
					});	
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}
};

module.exports = ImageService;
