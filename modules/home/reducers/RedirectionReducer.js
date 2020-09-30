export default (state = 0, action) => { 
	var newState = state;
	if (action.type == 'FORM_REQUEST_DID_START')
				return {
					message: null
				};
	else if (action.type == 'FORM_REQUEST_DID_FINISH') {
		if (action.json && action.json.status) {
			if (action.json.data && action.json.data.message) {
				return {
					message: action.json.data.message
				};
			}
			let url = new URLSearchParams(window.location.search);
			let redirectUrl = url.get("redirect");
			if (redirectUrl) {
				window.location.replace(redirectUrl);
			} else {
				window.location.replace("/dashboard");
			}
		}
	}
	return state;
}
