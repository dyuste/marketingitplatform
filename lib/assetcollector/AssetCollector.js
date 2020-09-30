
let assetCollectiorInstance = null;

class AssetCollector {

	constructor() {
		if (!assetCollectiorInstance) {
			this.styleCollection = [];
			this.scriptBodyCollection = [];
			assetCollectiorInstance = this;
		}
		return assetCollectiorInstance;
	}

	beginStyleCollection() {
		this.styleCollection = [];
	}

	getStyleCollection() {
		return this.styleCollection.concat();
	}

	addStyleAsset(asset) {
		if (!this.styleCollection.includes(asset)) {		
			this.styleCollection.push(asset);	
		}
	}

	beginScriptBodyCollection() {
		this.scriptBodyCollection = [];
	}

	getScriptBodyCollection() {
		return this.scriptBodyCollection.concat();
	}

	addScriptBodyAsset(asset) {
		if (!this.scriptBodyCollection.includes(asset)) {		
			this.scriptBodyCollection.push(asset);	
		}
	}
}

module.exports = new AssetCollector();
