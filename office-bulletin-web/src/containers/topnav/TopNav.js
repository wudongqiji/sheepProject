import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';

import './topnav.css';

import {
	userLogout,
	userSideNav
} from '../../modules/user';

class TopNav extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fullscreen: false
		};
	}

	onLogout() {
		this.props.userLogout();
		this.props.history.push('/login');
	}

	toggleSideNav = () => {
		const { userNav } = this.props;
		this.props.userSideNav(userNav);
	}

	toggleFullScreen() {
		const { fullscreen } = this.state;
		const elem = document.getElementById("mainHtml");

		if (!fullscreen) {
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen(); 
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}

		setTimeout(() => {
			this.setState({ fullscreen: !fullscreen });
		}, 200);
	}

	render() {
		const { fullscreen } = this.state;
		return (
			<div className="topNavWrapper">
				<a className="toggleSideNav" onClick={()=>this.toggleSideNav()}><Icon type="menu-unfold" /></a>
				<a className="logout" onClick={()=>this.onLogout()}><Icon type="logout" /></a>
				<a className="maximize" onClick={()=>this.toggleFullScreen()}><Icon type={(fullscreen) ? "shrink" : "arrows-alt"} /></a>
			</div>
		);
	}

}

const mapStateToProps = state => ({
	router: state.router,
	userAuthenticated: state.user.userAuthenticated,
	userNav: state.user.userNav
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		userLogout,
		userSideNav
	},
	dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopNav));