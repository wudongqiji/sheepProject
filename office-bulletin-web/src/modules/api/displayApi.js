import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const displayInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class DisplayApi {  

	static DisplayInsert(payload) {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return displayInstance.post('/display', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static DisplayUpdate(payload, id) {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return displayInstance.patch(`/display/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static DisplayList() {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return displayInstance.get('/display')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static DisplayListById(id) {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return displayInstance.get(`/display/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static DisplayDelete(id) {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return displayInstance.delete(`/display/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static DisplayListChange(page, pageSize) {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return displayInstance.get(`/display?page=${page}&perPage=${pageSize}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static DisplaySearch(title) {
		displayInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return displayInstance.get(`/display?title=${title}&perPage=100`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default DisplayApi; 


