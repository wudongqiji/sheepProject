import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const mediaInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class MediaApi {  

	static MediaInsert(payload) {
		mediaInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return mediaInstance.post('/media', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static MediaUpdate(payload, id) {
		mediaInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return mediaInstance.patch(`/media/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static MediaList() {
		mediaInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return mediaInstance.get('/media')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static MediaDelete(id) {
		mediaInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return mediaInstance.delete(`/media/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static MediaListChange(page, pageSize) {
		mediaInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return mediaInstance.get(`/media?page=${page}&perPage=${pageSize}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static MediaSearch(title) {
		mediaInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return mediaInstance.get(`/media?title=${title}&perPage=100`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default MediaApi; 


