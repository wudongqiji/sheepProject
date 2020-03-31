import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Input, Button, Icon, Alert, message, Transfer } from 'antd';
import Ink from 'react-ink';

import './playlistdetails.css';

import {
	playlistInsert,
	playlistUpdate
} from '../../../modules/playlist';

import {
	mediaSearch
} from '../../../modules/media'

const FormItem = Form.Item;
const Search = Input.Search;

class PlaylistDetails extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null,
			targetKeys: (this.props.data && this.props.data.list) ? this.props.data.list : [],
			id: null,
			search: false,
		}

		this.searchMediaData = this.searchMediaData.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.show === false && this.props.data === null && this.props.show) {
			this.setState({ search: false });
			this.props.form.resetFields();
		}
	}
	
	handleSubmit = e => {
		e.preventDefault();

		const { data } = this.props;
		const { targetKeys } = this.state;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ loading: true });
				
				if (targetKeys.length > 0) {
					const nValues = {
						title: values.title,
						list: targetKeys
					}
					if (data && data._id) {
						this.props.playlistUpdate(nValues, data._id).then( 
							(res) => {
								message.success('Playlist info successfully updated!');
								this.setState({ loading: false, message: null });
								this.props.callback();
							},
							(err) => {
								this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
							}
						);	
					} else {
						this.props.playlistInsert(nValues).then( 
							(res) => {
								message.success('Playlist info successfully added!');
								this.setState({ loading: false, message: null, targetKeys: [] });
								this.props.form.resetFields();
								this.props.callback();
							},
							(err) => {
								this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
							}
						);	
					}
				} else {
					this.setState({ loading: false, message: `Please add at least 1 media on playlist.` }); 
				}
			}
		});
	}

	filterOption(inputValue, option) {
		return option.title.indexOf(inputValue) > -1;
	}

	handleChange(targetKeys) {
		this.setState({ targetKeys });
	}

	searchMediaData(value) {
		if (value) {
			this.props.mediaSearch(value);
			this.setState({ search: true });
		}
	}

	render() {
		const { loading, message, targetKeys, search } = this.state;
		const { getFieldDecorator } = this.props.form;

		const { data } = this.props;
		let mockData = [];
		if ((this.props.playlistInfo || this.props.mediaResults)) {
			if (this.props.playlistInfo && data) {
				mockData = this.props.playlistInfo.list.map(media => {
					return ({
						key: media.id,
						title: media.title
					});
				}).sort((a, b) => {
					var titleA = a.title.toUpperCase(); // ignore upper and lowercase
		  			var titleB = b.title.toUpperCase(); // ignore upper and lowercase
					
					if (titleA < titleB) return -1;
					if (titleA > titleB) return 1;
					return 0;
				});
			}

			if (this.props.mediaResults && search === true) {
				let newMockData = this.props.mediaResults.results.map(media => {
					return ({
						key: media._id,
						title: media.title
					});
				}).sort((a, b) => {
					var titleA = a.title.toUpperCase(); // ignore upper and lowercase
		  			var titleB = b.title.toUpperCase(); // ignore upper and lowercase
					
					if (titleA < titleB) return -1;
					if (titleA > titleB) return 1;
					return 0;
				});

				mockData.forEach(media => {
					newMockData.push(media);
				});
				let result = newMockData.sort((a, b) => {
					var titleA = a.title.toUpperCase(); // ignore upper and lowercase
		  			var titleB = b.title.toUpperCase(); // ignore upper and lowercase
					
					if (titleA < titleB) return -1;
					if (titleA > titleB) return 1;
					return 0;
				}).reduce((accumulator, current) => {
					const length = accumulator.length;
					if (length === 0 || accumulator[length - 1].key !== current.key) {
						accumulator.push(current);
					}
					return accumulator;
				}, []);

				mockData = result;
			}
		}

		return (
			<div>
				<Form onSubmit={this.handleSubmit} className="ownForm">
					{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}

					<FormItem
						label="Title"
					>
						{getFieldDecorator('title', {
							rules: [ { required: true, message: 'Please input playlist title!' } ],
							initialValue: (data && data.title) ? data.title : ""
						})(
						<Input />
						)}
					</FormItem>		
					<FormItem>
						{getFieldDecorator('search', {
							initialValue: ""
						})(
						<Search onSearch={this.searchMediaData} enterButton={true} props={this.props} />
						)}
					</FormItem>
					<div style={{ paddingTop: '10px', paddingBottom: '20px' }}>
						<Transfer
							dataSource={mockData}
							filterOption={this.filterOption}
							targetKeys={targetKeys}
							onChange={this.handleChange.bind(this)}
							render={item => item.title}
							listStyle={{
								width: '100%',
								height: 200,
							}}
							operations={[<Icon type="down" />, <Icon type="up" />]}
						/>					
					</div>

					<FormItem 
						className="noMarginBtm"
					>
						<Button type="primary" htmlType="submit" disabled={loading} style={{ width: '100%' }}><Ink /><Icon type="arrow-right" /> Submit</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

const WrappedPlaylistDetailsModal  = Form.create()(PlaylistDetails);

const mapStateToProps = state => ({
	mediaData: state.media.data,
	mediaResults: state.media.search,
	playlistInfo: state.playlist.info,
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		playlistInsert,
  		playlistUpdate,
  		mediaSearch
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPlaylistDetailsModal);