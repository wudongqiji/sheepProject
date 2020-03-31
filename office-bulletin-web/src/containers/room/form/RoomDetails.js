import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Alert, Row, Col, message } from 'antd';
import Ink from 'react-ink';


import {
  roomInsert,
  roomUpdate
} from '../../../modules/room';

const FormItem = Form.Item;

class RoomDetails extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null
		}
	}
	
	handleSubmit = e => {
		e.preventDefault();

		const { data } = this.props;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true });

				if (!this.props.data) {
					this.props.roomInsert(values).then( 
						(res) => {
							message.success('Room successfully added!');
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
				
				this.props.roomUpdate(values, data._id).then( 
					(res) => {
						message.success('Room info successfully updated!');
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

		const { data } = this.props;
		
		return (
			<Form onSubmit={this.handleSubmit} className="ownForm">
				{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}

				<FormItem
					label="Title"
				>
					{ getFieldDecorator('title', {
						rules: [ { required: true, message: 'Please input room name!' } ],
						initialValue: (data && data.title) ? data.title : ""
					})(
					<Input />
					)}
				</FormItem>

				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label="Location"
							className="lessMarginBtm"
						>
							{getFieldDecorator('location', {
								initialValue: (data && data.location) ? data.location : "" 
							})(
							<Input />
							)}
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

const WrappedRoomDetailsModal  = Form.create()(RoomDetails);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		roomInsert,
		roomUpdate
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedRoomDetailsModal);