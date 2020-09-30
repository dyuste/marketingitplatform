class AbortController {
	constructor() {
		this.aborted = false;
	}
	abort() {
		this.aborted = true;
	}
};

export default class XhrService {
	static async fetch(endPoint, method, payLoad, contentType) {
		contentType = contentType || 'application/json';
		var body = contentType == 'application/json'
			? JSON.stringify(payLoad) : payLoad;
		let headers = {'Accept': 'application/json'};
		if (contentType == 'application/json') {
			headers['Content-Type'] = contentType;
		}
		return fetch(endPoint,
			{
				headers: headers,
				mode: 'cors',
				method: method,
				body: body,
				credentials: 'same-origin'
			}).then(response => response.json());
	}

	static fetchAbortable(endPoint, method, payLoad, contentType) {
		contentType = contentType || 'application/json';
		var body = contentType == 'application/json'
			? JSON.stringify(payLoad) : payLoad;
		let headers = {'Accept': 'application/json'};
		if (contentType == 'application/json') {
			headers['Content-Type'] = contentType;
		}

		const controller = new AbortController();
		let promise = new Promise((resolve, reject) => {
			fetch(endPoint,
				{
					headers: headers,
					mode: 'cors',
					method: method,
					body: body,
					credentials: 'same-origin'
				}).then(response => { if (!controller.aborted) resolve(response.json()); });
		});
		return {promise: promise, signal: controller};
	}
};

module.exports = XhrService;
