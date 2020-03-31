import React, { Component } from 'react';
import { Button } from 'antd';
import Ink from 'react-ink';

import './headercontent.css';

class HeaderContent extends Component {
	render() {
		return (
			<h4 className="headerContentHolder">
				{ this.props.data.button && <p className="btnHolder"><Button onClick={this.props.data.button.function}><Ink />{this.props.data.button.title}</Button></p> }
				{ this.props.data.close && <a className="closeHolder" onClick={this.props.data.close.function}>{this.props.data.close.title}</a> }
				<span className="title">{this.props.title}</span>
				<span className="subtitle">{this.props.subtitle}</span>
			</h4>
		);
	}
}

export default HeaderContent;