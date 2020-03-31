import roomApi from './api/roomApi';

export const ROOM_INSERT = 'room/INSERT';
export const ROOM_LIST = 'room/LIST';
export const ROOM_SEARCH = 'room/SEARCH';

const initialState = {
	data: null,
	search: null
	
}

export default (state = initialState, action) => {
	switch (action.type) {
		case ROOM_LIST:
			return {
				...state,
				data: action.payload
			};
		case ROOM_SEARCH:
			return {
				...state,
				search: action.payload
			};
		default:
			return state;
		
	}
};

export const roomInsert = (payload) => {
	return dispatch => {
		return roomApi.RoomInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const roomUpdate = (payload, id) => {
	return dispatch => {
		return roomApi.RoomUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const roomList = () => {
	return dispatch => {
		return roomApi.RoomList().then(data => {
			dispatch({
				type: ROOM_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const roomDelete = (id) => {
	return dispatch => {
		return roomApi.RoomDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};


export const roomListChange = (page, pageSize) => {
	return dispatch => {
		return roomApi.RoomListChange(page, pageSize).then(data => {
			dispatch({
				type: ROOM_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const roomSearch = (title) => {
	return dispatch => {
		return roomApi.RoomSearch(title).then(data => {
			dispatch({
				type: ROOM_SEARCH,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};