import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Button, Icon, Alert, Select, Row, Col, message } from 'antd';
import Ink from 'react-ink';

import config from '../../../config';

import Avatar from '../../common/avatar/Avatar';

import {
  mediaUpdate
} from '../../../modules/media';

const FormItem = Form.Item;
const Option = Select.Option;

class MediaDetails extends Component {
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

				if (values.year) {
					values.year = parseInt(values.year, 10);
				} else {
					delete values.year;
				}
				
				this.props.mediaUpdate(values, data._id).then( 
					(res) => {
						message.success('Media info successfully updated!');
						this.setState({ loading: false, message: null });
						this.props.callback();
					},
					(err) => {
						this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
					}
				);
			}
		});
	}

	render() {
		const { loading, message } = this.state;
		const { getFieldDecorator } = this.props.form;

		const { data } = this.props;

		const genre = config.genre.map(genre=><Option key={`genre${genre}`} value={genre}>{genre}</Option>);
		
		return (
			<Form onSubmit={this.handleSubmit} className="ownForm">
				{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}

				<Avatar imageUrl={data.thumbnail} id={data._id} callback={()=>(this.props.avatarCallback) ? this.props.callback() : null} />

				<FormItem
					label="Title"
				>
					{getFieldDecorator('title', {
						rules: [ { required: true, message: 'Please input song title!' } ],
						initialValue: (data.title) ? data.title : ""
					})(
					<Input />
					)}
				</FormItem>

				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label="Artist"
							className="lessMarginBtm"
						>
							{getFieldDecorator('artist', {
								initialValue: (data.artist) ? data.artist : "" 
							})(
							<Input />
							)}
						</FormItem>
					</Col>

					<Col span={12}>
						<FormItem
							label="Album"
							className="lessMarginBtm"
						>
							{getFieldDecorator('album', {
								initialValue: (data.album) ? data.album : "" 
							})(
							<Input />
							)}
						</FormItem>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label="Genre"
						>
							{getFieldDecorator('genre', {
								initialValue: (data.genre) ? data.genre : "" 
							})(
							<Select style={{ width: '100%' }}>{genre}</Select>
							)}
						</FormItem>
					</Col>

					<Col span={12}>
						<FormItem
							label="Year"
						>
							{getFieldDecorator('year', {
								initialValue: (data.year) ? data.year : "" 
							})(
							<InputNumber min={1900} max={(new Date()).getFullYear()} />
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

const WrappedMediaDetailsModal  = Form.create()(MediaDetails);

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaUpdate
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedMediaDetailsModal);