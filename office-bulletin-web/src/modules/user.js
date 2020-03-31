import userApi from './api/userApi';

export const USER_LOGIN = 'user/LOGIN';
export const USER_LOGOUT = 'user/LOGOUT';
export const USER_LIST = 'user/LIST';
export const USER_SIDENAV = 'user/SIDENAV';

const currTimestamp = Math.round(new Date().getTime());

if (localStorage.u) {
	const parseStorage = JSON.parse(localStorage.u);

	if (parseStorage.token && parseStorage.token.expiresIn) {
		if (currTimestamp > new Date(parseStorage.token.expiresIn).getTime()) {
			console.log('wa');
			localStorage.removeItem('u');
			window.parent.location = `${window.parent.location.origin}/login`;
		}
	}
}

const initialState = {
	userAuthenticated: (localStorage.u) ? true : false,
	userProfile: (localStorage.u) ? JSON.parse(localStorage.u) : {},
	userData: [],
	userNav: false
}

export default (state = initialState, action) => {
	switch (action.type) {
		case USER_LOGIN:
			return {
				...state,
				userAuthenticated: true,
				userProfile: action.payload
			};

		case USER_LOGOUT:
			return {
				...state,
				userAuthenticated: false
			};
		case USER_LIST:
			return {
				...state,
				userData: action.payload
			};
		case USER_SIDENAV:
			return {
				...state,
				userNav: !action.payload
			};

		default:
			return state;

	}
};

export const userLogin = (payload) => {
	return dispatch => {
		return userApi.UserLogin(payload).then(data => {
			if (data.user.role) {
				dispatch({
					type: USER_LOGIN,
					payload: data
				});
				;
				localStorage.setItem('u', JSON.stringify(data));
			}
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const userLogout = () => {
	return dispatch => {
		dispatch({
			type: USER_LOGOUT
		});

		localStorage.removeItem('u');
	};
};

export const userInsert = (payload) => {
	return dispatch => {
		return userApi.UserInsert(payload).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const userUpdate = (payload, id) => {
	return dispatch => {
		return userApi.UserUpdate(payload, id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const userList = () => {
	return dispatch => {
		return userApi.UserList().then(data => {
			dispatch({
				type: USER_LIST,
				payload: data
			});
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const userDelete = (id) => {
	return dispatch => {
		return userApi.UserDelete(id).then(data => {
			return data;
		}).catch(error => {
			throw(error);
		});
	};
};

export const userSideNav = (data) => {
	return dispatch => {
		dispatch({
			type: USER_SIDENAV,
			payload: data
		});
	};
};
