
export default class SitesGalleryService {
	static getImageById(siteData, imageId) {
		if (!imageId) return null;
		let gallery = siteData.configuration.gallery;
		let index = Number.isInteger(gallery.indexMap[imageId]) ? gallery.indexMap[imageId] : null;
		return index !== null ? gallery.images[index] : null;
	}

	static getNormalizedGallery(gallery) {
		let images = SitesGalleryService.getNormalizedGalleryImages(Array.isArray(gallery.images) ? gallery.images : []);
		let indexMap = {};
		let imagesLen = images.length;
		for (var i = 0; i < imagesLen; ++i)
			indexMap[images[i].id] = i;
		return {
			images: images,
			indexMap: indexMap
		};
	}

	static getNormalizedGalleryImages(images) {
		let normalizedImages = [];
		let imagesLen = images.length;
		for (var i = 0; i < imagesLen; ++i) {
			let image = images[i];
			if (image) {
				normalizedImages.push(SitesGalleryService.getNormalizedGalleryImage(image));
			}
		}

		return normalizedImages;
	}

	static getNormalizedGalleryImage(image) {
		let normalizedImage = {
			id: image.id || 0,
			url: image.url || null,
			thumbnailUrl: image.thumbnailUrl || null
		};
		if (image.uploading) {
			normalizedImage.uploading = true;
		}
		return image;
	}
};

module.exports = SitesGalleryService;
