import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Alert } from 'antd';
import Ink from 'react-ink';

import './login.css';

import {
	userLogin
} from '../../modules/user';

import HeaderLogo from '../common/headerlogo/HeaderLogo';

const FormItem = Form.Item;

class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true });
				this.props.userLogin(values).then(
					(res) => {
						if (res.user.role === 'admin') {
							this.setState({ loading: false, message: null });
							this.props.form.resetFields();
							window.parent.location = `${window.parent.location.origin}`;
						} else {
							this.setState({ loading: false, message: `Please check Username/Password and try again.` });
						}
					},
					(err) => {
						this.setState({ loading: false, message: `Please check Username/Password and try again.` });
					}
				);
			}
		});
	}

	render() {
		const { loading, message } = this.state;
    	const { getFieldDecorator } = this.props.form;
		return (
			<div className="loginWrapper">
				<div className="loginHolder">
					<HeaderLogo size="" />
					<Form onSubmit={this.handleSubmit} className="login-form">
						<div className="contentHolder">
							{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}
							<FormItem>
								{getFieldDecorator('email', {
								rules: [
									{ type: 'email', message: 'Please input a valid E-mail!' },
									{ required: true, message: 'Please input your username!' }
								],
								})(
									<Input size="large" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="E-mail" />
								)}
							</FormItem>

							<FormItem>
								{getFieldDecorator('password', {
								rules: [{ required: true, message: 'Please input your Password!' }],
								})(
									<Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
								)}
							</FormItem>
						</div>
						<div className="btnHolder">
							{
								(loading) ?
								<Button size="large" type="primary" htmlType="submit" disabled><Ink />Log in <Icon type="loading" /></Button>
								:
								<Button size="large" type="primary" htmlType="submit"><Ink />Log in <Icon type="login" /></Button>
							}
						</div>
					</Form>
				</div>
				<p>Copyright &copy; 2019 all rights reserved.</p>
			</div>
		);
	}
}

const WrappedLoginForm = Form.create()(Login);
const mapStateToProps = state => ({
	userAuthenticated: state.user.userAuthenticated
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		userLogin
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedLoginForm);
