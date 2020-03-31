import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Button, Icon, Alert, Row, Col, message, Select, DatePicker , Input } from 'antd';
import Ink from 'react-ink';
import moment from 'moment-timezone';

import {
  scheduleInsert,
  scheduleUpdate
} from '../../../modules/schedule';

import {
	userList
} from '../../../modules/user';

import {
	roomList
} from '../../../modules/room';

import {
	companyList
} from '../../../modules/company';

const FormItem = Form.Item;
const Option = Select.Option;

function onChangeFrom(value, dateString) {
	console.log('Selected Time: ', value);
	console.log('Formatted Selected Time: ', dateString);
  }
  
  function onOkFrom(value) {
	console.log('onOk: ', value);
  }

function onChange(value, dateString) {
	console.log('Selected Time: ', value);
	console.log('Formatted Selected Time: ', dateString);
  }
  
  function onOk(value) {
	console.log('onOk: ', value);
  }
  
  function handleChange(value) {
	console.log(`Selected: ${value}`);
  }
  

class ScheduleDetails extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null
		}
	}

	componentDidMount() {
		if (this.props.userData.length === 0) {
			this.props.userList()
		}
		if (!this.props.roomData) {
			this.props.roomList();
		}

		if (!this.props.companyData) {
			this.props.companyList();
		}
	}
	
	handleSubmit = e => {
		e.preventDefault();

		const { data , userData } = this.props;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				//Get the user object using the ID
				//values.list = [userData.find(user => { return user.email === values.list})];

				console.log(values.list);
				values.list = values.list.map(user => {
					const results = userData.find(userNext => {
						if (userNext.id === user) {
							return userNext;
						}
					});
					return results;
				});

				if (!this.props.data) {
					this.props.scheduleInsert(values).then( 
						(res) => {
							message.success('Schedule successfully added!');
							this.setState({ loading: false, message: null });
							this.props.form.resetFields();
							this.props.callback();
						},
						(err) => {
							this.setState({ loading: false, message: `Can't get through. Please make sure input is valid or contact the administrator.` }); 
						}
					);
				}
				else {
				
				this.props.scheduleUpdate(values, data._id).then( 
					(res) => {
						message.success('Schedule info successfully updated!');
						this.setState({ loading: false, message: null });
						this.props.callback();
					},
					(err) => {
						this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
					}
				);
			}
			}
		});
	}
	

	render() {
		
		const { loading, message } = this.state;
		const { getFieldDecorator } = this.props.form;

		const { data , userData , roomData , companyData} = this.props;

		return (
			<Form onSubmit={this.handleSubmit} className="ownForm">
				{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}

				<FormItem
					label="Room"
				>
					{ getFieldDecorator('title', {
						rules: [ { required: true, message: 'Please input room!' } ],
						initialValue: (data && data.title) ? data.title : ""
					})(
						<Select style={{ width: 120 }} >
							{(roomData) ? roomData.results.map(rooms => <Option key={`rooms${rooms.title}`} value={rooms.title}>{rooms.title}</Option>) : []}
					</Select>
					)}
				</FormItem>

				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label="Date From: "
							className="lessMarginBtm"
						>
						{ getFieldDecorator('dateFrom', {
						rules: [ { required: true, message: 'Please input a valid date/time!' } ],
						initialValue: (data && data.dateFrom) ? moment(data.dateFrom) : moment()
					})(
							<DatePicker
							showTime
							format="YYYY-MM-DD HH:mm"
							placeholder="Select Time"
							onChange={onChangeFrom}
							onOk={onOkFrom}
							/>)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem
							label="Date To:"
							className="lessMarginBtm"
						>
						{ getFieldDecorator('dateTo', {
						rules: [ { required: true, message: 'Please input a valid date/time!' } ],
						initialValue: (data && data.dateTo) ? moment(data.dateTo) : moment()
					})(
							<DatePicker
							showTime
							format="YYYY-MM-DD HH:mm"
							placeholder="Select Time"
							onChange={onChange}
							onOk={onOk}
							/>)}
						</FormItem>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<FormItem
							label="Company: "
							className="lessMarginBtm"
						>
							{getFieldDecorator('company', {
								initialValue: (data && data.company) ? data.company : "" 
							})(
								<Select style={{ width: 120 }} >
								{(companyData) ? companyData.results.map(company => <Option key={`company${company._id}`} value={company.title}>{company.title}</Option>): []}
							</Select>
							)}						 
						</FormItem>
					</Col>
				</Row>

				<FormItem
					label="Description"
				>
					{ getFieldDecorator('text', {
						rules: [ { required: true, message: 'Meeting agenda' } ],
						initialValue: (data && data.text) ? data.text : ""
					})(
					<Input />
					)}
				</FormItem>

				<Row gutter={16}>
					<Col span={24}>
						<FormItem
							label="UserList: "
							className="lessMarginBtm"
						>
						{getFieldDecorator('list', {
								//initialValue: (data && data.list[0].title) ? data.list[0].title : ""  
							})(
								// <Select style={{ width: 120 }} >
								// 	{mediaData.results.map(media => <Option key={`mediaTitle${media.title}`} value={media._id}>{media.title}</Option>)}
								// </Select>

								<Select
									mode="tags"
									placeholder="Please select a user"
									onChange={handleChange}
									style={{ width: '100%' }}
									>
								{userData.map(users => <Option key={`userName${users.email}`} value={users.id}>{users.email.split('@')[0]}</Option>)}
								</Select>
							)}

						{/* {getFieldDecorator('list', {
								initialValue: (data && data.list[0].email) ? data.list[0].email : "" 
							})(
								<Select style={{ width: 120 }} >
								{userData.map(users => <Option key={`userName${users.email}`} value={users.email}>{users.email.split('@')[0]}</Option>)}
							</Select>
							 )} */}
						</FormItem>
					</Col>
				</Row>
			

				<FormItem 
					className="noMarginBtm"
				>
					<Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%' }}><Ink /><Icon type="arrow-right" /> Submit</Button>
				</FormItem>
			</Form>
		);
	}
}

const WrappedScheduleDetailsModal  = Form.create()(ScheduleDetails);

const mapStateToProps = state => ({
	userData: state.user.userData,
	roomData: state.room.data,
	companyData: state.company.data,
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		scheduleInsert,
		scheduleUpdate,
		userList,
		roomList,
		companyList
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedScheduleDetailsModal);