import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './user';
import media from './media';
import schedule from './schedule';
import room from './room';
import display from './display';
import company from './company'

export default combineReducers({
	router: routerReducer,
	user,
	media,
	schedule,
	room,
	display,
	company
});
