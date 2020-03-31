import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Upload, Icon, message } from 'antd';

import config from '../../../config';

import './avatar.css';

import {
  mediaUpdate
} from '../../../modules/media';

class Avatar extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			imageUrl: this.props.imageUrl,
			id: this.props.id
		}
	}

	componentDidUpdate() {
		const { id } = this.state; 

		if (id !== this.props.id) {
			this.setState({ id: this.props.id, imageUrl: this.props.imageUrl });
		}
	}

	getBase64(img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	beforeUpload(file) {
		const isJPG = file.type === 'image/jpeg';
		if (!isJPG) {
			message.error('You can only upload JPG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Image must smaller than 2MB!');
		}
		return isJPG && isLt2M;
	}

	onFileUploaded(nMedia) {
		const values = {
			thumbnail: nMedia
		}

		this.props.mediaUpdate(values, this.props.id).then( 
			(res) => {
				this.props.callback();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	render() {
		const { loading, imageUrl } = this.state;

		const uploadButton = (
			<div>
				<Icon type={loading ? 'loading' : 'plus'} />
				<div className="ant-upload-text">Upload Thumbnail</div>
			</div>
		);

		const _this = this;
		const { token } = this.props.userProfile;

		const props = {
			name: 'avatar',
			listType: "picture-card",
			className: "avatar-uploader",
			showUploadList: false,

			action: `${config.api}/media/upload/picture`,
			beforeUpload: this.beforeUpload,
			headers: {
				Authorization: `${token.tokenType} ${token.accessToken}`
			},
			onChange(info) {
				if (info.file.status === 'uploading') {
					_this.setState({ loading: true });
					return;
				}
				if (info.file.status === 'done') {
					const newMediaList = info.file.response.files[0].name;
					_this.onFileUploaded(newMediaList);
					_this.getBase64(info.file.originFileObj, imgUrl => {
						_this.setState({ imageUrl: imgUrl, loading: false });
					});
				}
			}
		};

		return (
			<Upload {...props}>
				{imageUrl ? <img src={imageUrl} alt="media thumbnail" /> : uploadButton}
			</Upload>
		);
	}
}

const mapStateToProps = state => ({
	router: state.router,
	userProfile: state.user.userProfile
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaUpdate
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);