import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const userInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class UserApi {  

	static UserLogin(payload) {
		return userInstance.post('/auth/login', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static UserInsert(payload) {
		userInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return userInstance.post('/users', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static UserUpdate(payload, id) {
		userInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return userInstance.patch(`/users/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static UserList() {
		userInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return userInstance.get('/users')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static UserDelete(id) {
		userInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return userInstance.delete(`/users/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default UserApi; 


