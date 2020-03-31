import scheduleApi from './api/scheduleApi';

export const SCHEDULE_INSERT = 'schedule/INSERT';
export const SCHEDULE_LIST = 'schedule/LIST';
export const SCHEDULE_SEARCH = 'schedule/SEARCH';

const initialState = {
	data: null,
	search: null
	
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SCHEDULE_LIST:
			return {
				...state,
				data: action.payload
			};
		case SCHEDULE_SEARCH:
			return {
				...state,
				search: action.payload
			};
		default:
			return state;
		
	}
};

export const scheduleInsert = (payload) => {
	return dispatch => {
		return scheduleApi.ScheduleInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const scheduleUpdate = (payload, id) => {
	return dispatch => {
		return scheduleApi.ScheduleUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const scheduleList = () => {
	return dispatch => {
		return scheduleApi.ScheduleList().then(data => {
			dispatch({
				type: SCHEDULE_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const scheduleDelete = (id) => {
	return dispatch => {
		return scheduleApi.ScheduleDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};


export const scheduleListChange = (page, pageSize) => {
	return dispatch => {
		return scheduleApi.ScheduleListChange(page, pageSize).then(data => {
			dispatch({
				type: SCHEDULE_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const scheduleSearch = (title) => {
	return dispatch => {
		return scheduleApi.ScheduleSearch(title).then(data => {
			dispatch({
				type: SCHEDULE_SEARCH,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};