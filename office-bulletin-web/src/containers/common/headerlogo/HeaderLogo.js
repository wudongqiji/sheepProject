import React, { Component } from 'react';

import './headerlogo.css';

import logo from '../../static/logo.png';

class HeaderLogo extends Component {
	render() {
		let classNameHeader = `headerLogoWrapper${this.props.size.charAt(0).toUpperCase() + this.props.size.slice(1)}`;

		return (
			<h3 className={classNameHeader}>
				<div className="overlay"></div>
				<div className="contentHolder">
					<center><img src={logo} alt="Logo" /></center>
					Bulletin System
				</div>
			</h3>
		);
	}
}

export default HeaderLogo;
