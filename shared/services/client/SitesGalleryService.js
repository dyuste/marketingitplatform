import XhrService from './XhrService'

export default class SitesGalleryService {
	static async uploadImage(siteId, file) {
		let formData = new FormData();
		formData.append("siteId", siteId);
		formData.append("imageFile", file);
		return SitesGalleryService.performAction("uploadImage", formData, "multipart/form-data");
	}

	static async performAction(action, data = {}, contentType) {
	    return XhrService.fetch(
	        "/ajax-services/SitesGalleryService/"+action,
	        "post",
	        data,
	        contentType);
	}

	static performActionAbortable(action, data = {}, contentType) {
	    return XhrService.fetchAbortable(
	        "/ajax-services/SitesGalleryService/"+action,
	        "post",
	        data,
	        contentType);
	}
};

module.exports = SitesGalleryService;
