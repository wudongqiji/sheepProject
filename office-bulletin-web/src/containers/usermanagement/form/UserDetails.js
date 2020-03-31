import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Alert, message } from 'antd';
import Ink from 'react-ink';

import {
	userInsert,
	userUpdate
} from '../../../modules/user';

import './userdetails.css';

const FormItem = Form.Item;

class UserDetails extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null
		}
	}
	
	handleSubmit = e => {
		e.preventDefault();

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true });
				if (values.password.length > 9) {
					this.props.form.setFields({
						password: {
							value: values.password,
							errors: [new Error('Password is too long (max character length is 9)')],
						}
					});
					this.setState({ loading: false }); 
				} else if (values.password.length < 6) {
					this.props.form.setFields({
						password: {
							value: values.password,
							errors: [new Error('Password is too short (min character length is 6)')],
						}
					});
					this.setState({ loading: false }); 
				} else {
					if (!this.props.data) {
						this.props.userInsert(values).then( 
							(res) => {
								message.success('User successfully added!');
								this.setState({ loading: false, message: null });
								this.props.form.resetFields();
								this.props.callback();
							},
							(err) => {
								this.setState({ loading: false, message: `Can't get through. Please make sure email is unique or contact the administrator.` }); 
							}
						);
					} else {
						this.props.userUpdate(values, this.props.data.id).then( 
							(res) => {
								message.success('User successfully updated!');
								this.setState({ loading: false, message: null });
								this.props.form.resetFields();
								this.props.callback();
							},
							(err) => {
								this.setState({ loading: false, message: `Can't get through. Please make sure email is unique or contact the administrator.` }); 
							}
						);
					}

				}
			}
		});
	}

	handleConfirmBlur = (e) => {
		const value = e.target.value;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}

	compareToFirstPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	}

	validateToNextPassword = (rule, value, callback) => {
		const form = this.props.form;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirmpassword'], { force: true });
		}
		if (value && value !== "" && !value.match(/^[0-9a-zA-Z]+$/)) {
			callback('Password only accept alphanumeric value!');
		}
		callback();
	}

	render() {
		const { loading, message } = this.state;
		const { getFieldDecorator } = this.props.form;
		
		return (
			<Form onSubmit={this.handleSubmit} className="ownForm">
				{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}

				<FormItem>
					{getFieldDecorator('email', {
						rules: [
							{ type: 'email', message: 'The input is not valid E-mail!' },
							{ required: true, message: 'Please input your email!' }
						],
						initialValue: (this.props.data && this.props.data.email) ? this.props.data.email : "" ,
					})(
					<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" readOnly={(this.props.data) ? true : false} />
					)}
				</FormItem>

				<p className="passwordNote">
					Enter your password with 6-9 alphanumeric.
				</p>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [
							{ required: true, message: 'Please input your Password!' },
							{ validator: this.validateToNextPassword }
						],
					})(
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
					)}
				</FormItem>

				<FormItem>
					{getFieldDecorator('confirmpassword', {
						rules: [
							{ required: true, message: 'Please confirm your password!' },
							{ validator: this.compareToFirstPassword }
						],
					})(
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirm Password" onBlur={this.handleConfirmBlur} />
					)}
				</FormItem>			

				<FormItem 
					className="noMarginBtm"
				>
					<Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%' }}><Ink /><Icon type="arrow-right" /> Submit</Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedUserDetailsModal  = Form.create()(UserDetails);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		userInsert,
		userUpdate
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedUserDetailsModal);