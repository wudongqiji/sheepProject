import axios from 'axios';
import config from '../../config';

import tokenApi from './tokenApi';

const playlistInstance = axios.create({
	baseURL: config.api,
    headers: {
		'Content-Type': 'application/json'
	}
});

class PlaylistApi {  

	static PlaylistInsert(payload) {
		playlistInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return playlistInstance.post('/playlist', payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static PlaylistUpdate(payload, id) {
		playlistInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();

		return playlistInstance.patch(`/playlist/${id}`, payload)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static PlaylistList() {
		playlistInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return playlistInstance.get('/playlist')
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static PlaylistListById(id) {
		playlistInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return playlistInstance.get(`/playlist/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

	static PlaylistDelete(id) {
		playlistInstance.defaults.headers.common['Authorization'] = tokenApi.GetToken();
		
		return playlistInstance.delete(`/playlist/${id}`)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			throw(error);
		});
	}

}

export default PlaylistApi; 


