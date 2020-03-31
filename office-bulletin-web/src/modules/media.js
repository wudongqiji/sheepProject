import mediaApi from './api/mediaApi';

export const MEDIA_INSERT = 'media/INSERT';
export const MEDIA_LIST = 'media/LIST';
export const MEDIA_PLAY = 'media/PLAY';
export const MEDIA_SEARCH = 'media/SEARCH';

const initialState = {
	data: null,
	play: null,
	search: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case MEDIA_LIST:
			return {
				...state,
				data: action.payload
			};
		case MEDIA_PLAY:
			return {
				...state,
				play: action.payload
			};
		case MEDIA_SEARCH:
			return {
				...state,
				search: action.payload
			};
		default:
			return state;
		
	}
};

export const mediaInsert = (payload) => {
	return dispatch => {
		return mediaApi.MediaInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const mediaUpdate = (payload, id) => {
	return dispatch => {
		return mediaApi.MediaUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const mediaList = () => {
	return dispatch => {
		return mediaApi.MediaList().then(data => {
			dispatch({
				type: MEDIA_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const mediaDelete = (id) => {
	return dispatch => {
		return mediaApi.MediaDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const mediaPlay = (payload) => {
	return dispatch => {
		dispatch({
			type: MEDIA_PLAY,
			payload: payload
		});
	};
};

export const mediaListChange = (page, pageSize) => {
	return dispatch => {
		return mediaApi.MediaListChange(page, pageSize).then(data => {
			dispatch({
				type: MEDIA_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const mediaSearch = (title) => {
	return dispatch => {
		return mediaApi.MediaSearch(title).then(data => {
			dispatch({
				type: MEDIA_SEARCH,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};