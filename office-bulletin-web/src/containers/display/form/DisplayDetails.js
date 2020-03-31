import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Alert, Row, Col, message ,Select} from 'antd';
import Ink from 'react-ink';


import {
  displayUpdate
} from '../../../modules/display';

import {
	mediaList
} from '../../../modules/media';

const FormItem = Form.Item;
const Option = Select.Option;

function handleChange(value) {
	console.log(`Selected: ${value}`);
  }
  
class DisplayDetails extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null
		}
	}
	
	handleSubmit = e => {
		e.preventDefault();

		const { data , mediaData } = this.props;

		console.log(this.props)

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true });
				
				//Get the media object using the ID
				console.log(values.list);
				values.list = values.list.map(media => {
					const results = mediaData.results.find(mediaNext => {
						if (mediaNext._id === media) {
							return mediaNext;
						}
					});
					return results;
				});
					// values.list = [mediaData.results.find(media => { return media._id === values.list})];

				console.log(values.list);
				
				this.props.displayUpdate(values, data._id).then( 
					(res) => {
						
						message.success('Display info successfully updated!');
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

		const { data, mediaData } = this.props;
		
		
		return (
			<Form onSubmit={this.handleSubmit} className="ownForm">
				{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}

				<FormItem
					label="Title"
				>
					{ getFieldDecorator('title', {
						rules: [ { required: true, message: 'Please input display name!' } ],
						initialValue: (data && data.title) ? data.title : ""
					})(
					<Input />
					)}
				</FormItem>

				<Row gutter={16}>
					<Col span={24}>
						<FormItem
							label="Scrolling Text"
							className="lessMarginBtm"
						>
							{getFieldDecorator('text', {
								initialValue: (data && data.text) ? data.text : "" 
							})(
							<Input />
							)}
						</FormItem>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<FormItem
							label="Media"
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
									placeholder="Please select a media"
									onChange={handleChange}
									style={{ width: '100%' }}
									>
									{mediaData.results.map(media => <Option key={`mediaTitle${media.title}`} value={media._id}>{media.title}</Option>)}
								</Select>
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

const WrappedDisplayDetailsModal  = Form.create()(DisplayDetails);

const mapStateToProps = state => ({
	mediaData: state.media.data,
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		displayUpdate,
		mediaList
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDisplayDetailsModal);