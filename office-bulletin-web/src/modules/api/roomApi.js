import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const roomInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class RoomApi {  

	static RoomInsert(payload) {
		roomInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return roomInstance.post('/room', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static RoomUpdate(payload, id) {
		roomInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return roomInstance.patch(`/room/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static RoomList() {
		roomInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return roomInstance.get('/room')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static RoomDelete(id) {
		roomInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return roomInstance.delete(`/room/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static RoomListChange(page, pageSize) {
		roomInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return roomInstance.get(`/room?page=${page}&perPage=${pageSize}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static RoomSearch(title) {
		roomInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return roomInstance.get(`/room?title=${title}&perPage=100`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default RoomApi; 


