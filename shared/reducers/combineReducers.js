export default function combineReducers(reducers) {
	return (state = 0, action) => {
		let notDelegatedStates = {};
		var delegatedReducer = null;
		Object.keys(reducers).map(dataRoot => {
			if (dataRoot == "*") {
				delegatedReducer = reducers[dataRoot];
			} else {
				notDelegatedStates[dataRoot] = reducers[dataRoot](state[dataRoot], action);
			}
		});

		let newState = Object.assign({}, state);
		Object.keys(notDelegatedStates).map(notDelegatedState => {
			delete newState[notDelegatedState];
		})
		if (delegatedReducer) {
			newState = delegatedReducer(newState, action);
		}
		Object.keys(notDelegatedStates).map(notDelegatedState => {
			newState[notDelegatedState] = notDelegatedStates[notDelegatedState];
		});
		return newState;
	}
} 
