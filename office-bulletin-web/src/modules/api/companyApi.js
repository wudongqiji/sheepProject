import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const companyInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class CompanyApi {  

	static CompanyInsert(payload) {
		companyInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return companyInstance.post('/company', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static CompanyUpdate(payload, id) {
		companyInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return companyInstance.patch(`/company/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static CompanyList() {
		companyInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return companyInstance.get('/company')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static CompanyDelete(id) {
		companyInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return companyInstance.delete(`/company/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static CompanyListChange(page, pageSize) {
		companyInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return companyInstance.get(`/company?page=${page}&perPage=${pageSize}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static CompanySearch(title) {
		companyInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return companyInstance.get(`/company?title=${title}&perPage=100`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default CompanyApi; 


