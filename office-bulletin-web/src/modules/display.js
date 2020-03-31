import displayApi from './api/displayApi';

export const DISPLAY_INSERT = 'display/INSERT';
export const DISPLAY_LIST = 'display/LIST';
export const DISPLAY_PLAY = 'display/PLAY';
export const DISPLAY_SEARCH = 'display/SEARCH';
export const DISPLAY_INFO = 'display/INFO';

const initialState = {
	data: null,
	play: null,
	search: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case DISPLAY_LIST:
			return {
				...state,
				data: action.payload
			};
		case DISPLAY_PLAY:
			return {
				...state,
				play: action.payload
			};
		case DISPLAY_SEARCH:
			return {
				...state,
				search: action.payload
			};
		default:
			return state;
		
	}
};

export const displayInsert = (payload) => {
	return dispatch => {
		return displayApi.DisplayInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const displayUpdate = (payload, id) => {
	return dispatch => {
		return displayApi.DisplayUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const displayList = () => {
	return dispatch => {
		return displayApi.DisplayList().then(data => {
			dispatch({
				type: DISPLAY_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const displayById = (id) => {
	return dispatch => {
		return displayApi.DisplayListById(id).then(data => {
			dispatch({
				type: DISPLAY_INFO,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const displayDelete = (id) => {
	return dispatch => {
		return displayApi.DisplayDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const displayPlay = (payload) => {
	return dispatch => {
		dispatch({
			type: DISPLAY_PLAY,
			payload: payload
		});
	};
};

export const displayListChange = (page, pageSize) => {
	return dispatch => {
		return displayApi.DisplayListChange(page, pageSize).then(data => {
			dispatch({
				type: DISPLAY_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const displaySearch = (title) => {
	return dispatch => {
		return displayApi.DisplaySearch(title).then(data => {
			dispatch({
				type: DISPLAY_SEARCH,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};