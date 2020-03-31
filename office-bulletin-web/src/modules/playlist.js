import playlistApi from './api/playlistApi';

export const PLAYLIST_INSERT = 'playlist/INSERT';
export const PLAYLIST_LIST = 'playlist/LIST';
export const PLAYLIST_INFO = 'playlist/INFO';

const initialState = {
	data: null,
	info: null
}

export default (state = initialState, action) => {
	switch (action.type) {
		case PLAYLIST_LIST:
			return {
				...state,
				data: action.payload
			};

		case PLAYLIST_INFO:
			return {
				...state,
				info: action.payload
			}

		default:
			return state;
		
	}
};

export const playlistInsert = (payload) => {
	return dispatch => {
		return playlistApi.PlaylistInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const playlistUpdate = (payload, id) => {
	return dispatch => {
		return playlistApi.PlaylistUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const playlistList = () => {
	return dispatch => {
		return playlistApi.PlaylistList().then(data => {
			dispatch({
				type: PLAYLIST_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const playlistById = (id) => {
	return dispatch => {
		return playlistApi.PlaylistListById(id).then(data => {
			dispatch({
				type: PLAYLIST_INFO,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const playlistDelete = (id) => {
	return dispatch => {
		return playlistApi.PlaylistDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

