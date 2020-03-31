import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const scheduleInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class ScheduleApi {  

	static ScheduleInsert(payload) {
		scheduleInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return scheduleInstance.post('/schedule', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static ScheduleUpdate(payload, id) {
		scheduleInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return scheduleInstance.patch(`/schedule/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static ScheduleList() {
		scheduleInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return scheduleInstance.get('/schedule')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static ScheduleDelete(id) {
		scheduleInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return scheduleInstance.delete(`/schedule/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static ScheduleListChange(page, pageSize) {
		scheduleInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return scheduleInstance.get(`/schedule?page=${page}&perPage=${pageSize}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static ScheduleSearch(title) {
		scheduleInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return scheduleInstance.get(`/schedule?title=${title}&perPage=100`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default ScheduleApi; 


