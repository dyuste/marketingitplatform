export default function mixReducer(reducers) {
	return (state = 0, action) => {
		let reducersLen = reducers.length;
		for (var i = 0; i < reducersLen; ++i) {
			state = reducers[i](state, action);
		}
		return state;
	}
} 
