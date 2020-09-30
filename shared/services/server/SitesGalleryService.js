import CoreService from 'shared/services/server/CoreService'
import DataBaseAdapter from 'lib/database/';
import CommonSiteService from 'shared/services/common/SitesService'
import ImageService from 'shared/services/server/ImageService'
import FileService from 'shared/services/server/FileService'
import SitesService from 'shared/services/server/SitesService'
import CommonSitesGalleryService from 'shared/services/common/SitesGalleryService'

export default class SitesGalleryService {
	static getAjaxServices() {
		return [
			{
				name: "uploadImage",
				handler: SitesGalleryService.uploadImage,
				permissions: "siteOwner"
			}
		];
	}
	
	static async uploadImage(req) {
		let site = req.site;
		let file = SitesGalleryService.getFile(req.files, "imageFile");
		if (!file) {
			throw new Error(400);
		}

		let imageId = SitesGalleryService.getAvailableImageId(site.configuration.gallery);
		let path = SitesGalleryService.getSiteImagesPath(site.id);
		FileService.ensurePath(path);
		let finalImageName = path+imageId+"."+file.extension;
		let finalThumbImageName = path+imageId+".thumb."+file.extension
		FileService.move(file.path, finalImageName);

		try {
			await ImageService.createThumbnail(finalImageName, finalThumbImageName);
		} catch (err) {
			FileService.remove(fileImageName);
			throw(err);
		}
		
		let gallery = site.configuration.gallery;
		gallery.images.push(CommonSitesGalleryService.getNormalizedGalleryImage({
			id: imageId,
			url: SitesGalleryService.getSiteImageUrl(site.id, imageId, file.extension),
			thumbnailUrl: SitesGalleryService.getSiteImageThumbnailUrl(site.id, imageId, file.extension)
		}));
		site.configuration.gallery = CommonSitesGalleryService.getNormalizedGallery(gallery);
		SitesService.saveConfiguration(site.id, site.configuration, req);
		
		return site.configuration.gallery;
	}

	static getFile(files, fieldName) {
		let filesLen = files.length;
		for (var i = 0; i < filesLen; ++i) {
			let file = files[i];
			if (file.fieldname == fieldName) {
				let mime = file.mimetype;
				switch (mime) {
					case 'image/png':
						file.extension = 'png'; break;
					case 'image/jpeg':
						file.extension = 'jpg'; break;
					case 'image/bmp':
						file.extension = 'bmp'; break;
					default:
						return null;
				}
				return file;
			}
		}
		return null;
	}

	static getAvailableImageId(gallery) {
		var nextId = 1;
		let images = gallery.images;
		let imagesLen = images.length;
		for (var i = 0; i < imagesLen; ++i) {
			let imageId =images[i].id;
			if (imageId >= nextId) nextId = imageId + 1;
		}
		return nextId;
	}

	static getSiteImagesPath(siteId) {
		return "static/site/"+siteId+"/images/";
	}

	static getSiteImageUrl(siteId, imageId, extension) {
		return "/static/site/"+siteId+"/images/" + imageId + "." + extension;
	}

	static getSiteImageThumbnailUrl(siteId, imageId, extension) {
		return "/static/site/"+siteId+"/images/" + imageId + ".thumb." + extension;
	}

};

module.exports = SitesGalleryService;
