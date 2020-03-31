import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Form, Button, Icon, Alert, Steps, Upload } from 'antd';

import config from '../../../config';

import {
  mediaInsert,
  mediaList,
  mediaUpdate
} from '../../../modules/media';

import MediaDetails from '../form/MediaDetails';

const Step = Steps.Step;
const Dragger = Upload.Dragger;

class AddMediaModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null,
			step: 0,
			newMedia: null
		}
	}

	onFileUploaded(nMedia) {
		const data = {
			title: nMedia,
			filename: nMedia
		}
		this.props.mediaInsert(data).then(
			(res) => {
				this.setState({ step: 1, newMedia: res, message: null });
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` });
			}
		);
	}

	onClose() {
		const { newMedia } = this.state;

		if (newMedia) {
			this.props.mediaList().then(
				(res) => {
					this.setState({
						step: 0,
						message: null,
						newMedia: []
					});
					this.props.form.resetFields();
					this.props.toggleAddModal();
				},
				(err) => {
					console.log(err);
					this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` });
				}
			);
		} else {
			this.setState({
				step: 0,
				message: null,
				newMedia: []
			});
			this.props.form.resetFields();
			this.props.toggleAddModal();
		}
	}

	render() {
		const { loading, message, step, newMedia } = this.state;
		const this_ = this;

		const { token } = this.props.userProfile;

		const props = {
			name: 'files',
			multiple: true,
			action: `${config.api}/media/upload/audio`,
			accept: '.mov, .mp4',
			headers: {
				Authorization: `${token.tokenType} ${token.accessToken}`
			},
			onChange(info) {
				const status = info.file.status;
				if (status === 'done') {
					const newMediaList = info.file.response.files[0].name;
					this_.onFileUploaded(newMediaList);
				} else if (status === 'error') {
					console.log(info);
				}
			}
		};

		const component = [
			<div>
				{ (message) ? <Alert message={message} type="error" style={{ marginBottom: '20px' }} showIcon /> : ""}
				<Dragger {...props}>
					<p className="ant-upload-drag-icon">
					  <Icon type="inbox" />
					</p>
					<p className="ant-upload-text">Click or drag file to this area to upload</p>
					<p className="ant-upload-hint">Support for a single upload. Strictly prohibit from uploading company<br />data or other band files</p>
				</Dragger>
			</div>,
			<MediaDetails data={newMedia} callback={()=>this.onClose()} avatarCallback={false} />
		];

		return (
			<Modal
				title={<span><Icon type="file-add" /> Add Media</span>}
				visible={this.props.show}
				onCancel={()=>this.onClose()}
				footer={[
					<Button key="back" onClick={()=>this.onClose()} disabled={loading}>{(step === 0) ? 'Cancel' : 'Skip Details'}</Button>
				]}
				maskClosable={false}
				closable={(loading) ? false : true}
			>
				<Steps size="small" current={step}>
					<Step title="Upload" description="Upload media file." />
					<Step title="Details" description="Insert meta data." />
				</Steps>

				<div style={{ paddingTop: '20px' }}>
					{ component[step] }
				</div>
			</Modal>
		);
	}
}

const WrappedAddMediaModal  = Form.create()(AddMediaModal);

const mapStateToProps = state => ({
	router: state.router,
	userProfile: state.user.userProfile,
	mediaData: state.media.data
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaInsert,
		mediaList,
		mediaUpdate
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAddMediaModal);
