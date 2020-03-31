import companyApi from './api/companyApi';

export const COMPANY_INSERT = 'company/INSERT';
export const COMPANY_LIST = 'company/LIST';
export const COMPANY_SEARCH = 'company/SEARCH';

const initialState = {
	data: null,
	search: null
	
}

export default (state = initialState, action) => {
	switch (action.type) {
		case COMPANY_LIST:
			return {
				...state,
				data: action.payload
			};
		case COMPANY_SEARCH:
			return {
				...state,
				search: action.payload
			};
		default:
			return state;
		
	}
};

export const companyInsert = (payload) => {
	return dispatch => {
		return companyApi.CompanyInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const companyUpdate = (payload, id) => {
	return dispatch => {
		return companyApi.CompanyUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const companyList = () => {
	return dispatch => {
		return companyApi.CompanyList().then(data => {
			dispatch({
				type: COMPANY_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const companyDelete = (id) => {
	return dispatch => {
		return companyApi.CompanyDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};


export const companyListChange = (page, pageSize) => {
	return dispatch => {
		return companyApi.CompanyListChange(page, pageSize).then(data => {
			dispatch({
				type: COMPANY_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const companySearch = (title) => {
	return dispatch => {
		return companyApi.CompanySearch(title).then(data => {
			dispatch({
				type: COMPANY_SEARCH,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};