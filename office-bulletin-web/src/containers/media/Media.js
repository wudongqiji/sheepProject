import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Table, Icon, Row, Col, Popconfirm, Pagination } from 'antd';
import { Animated } from "react-animated-css";

import Moment from 'react-moment';
import 'moment-timezone';

import HeaderContent from '../common/headercontent/HeaderContent';
import AddMediaModal from './modal/AddMediaModal';

import MediaDetails from './form/MediaDetails';

import './media.css';

import {
  mediaList,
  mediaPlay,
  mediaDelete,
  mediaListChange
} from '../../modules/media';

class Media extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedMedia: null
		}
	}

	componentDidMount() {
		if (!this.props.mediaData) {
			this.getMedia();		
		}
	}

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onSelectMedia(mediaId = null) {
		window.scrollTo(0, 0);
		this.setState({ selectedMedia: null });
		setImmediate(()=> {
			this.setState({ selectedMedia: mediaId });
		});
	}

	getMedia() {
		this.props.mediaList();		
	}

	onPlay(id) {
		const sMedia = this.props.mediaData.results.filter(media => media._id === id);
		
		this.props.mediaPlay(null);
		setTimeout(()=> {
			const data = sMedia.map(media => {
				return ({
					name: media.title,
					singer: media.artist,
					cover: media.thumbnail,
					musicSrc: media.url
				})
			});
			this.props.mediaPlay(data);
		}, 200);
	}

	onDeleteConfirm(mediaId) {
		const { selectedMedia } = this.state;

		this.props.mediaDelete(mediaId).then( 
			(res) => {
				if (mediaId === selectedMedia) {
					this.setState({ selectedMedia: null });
				}
				this.getMedia();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	onPageChange(page, pageSize) {
		this.mediaListChange(page, pageSize);
	}

	onPageSizeChange(current, pageSize) {
		this.mediaListChange(current, pageSize);
	}

	render() {
		const { addModal, selectedMedia } = this.state;

		const columns = [{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			render: (text, data) => {
				return (<a onClick={()=>this.onSelectMedia(data.key)}>{text}</a>);
			},
			// sorter: (a, b) => a.title.localeCompare(b.title)
		}, {
			title: 'Artist',
			dataIndex: 'artist',
			key: 'artist',
			// sorter: (a, b) => a.artist.localeCompare(b.artist)
		}, {
			title: 'Album',
			dataIndex: 'album',
			key: 'album',
			// sorter: (a, b) => a.album.localeCompare(b.album)
		}, {
			title: 'Date Created',
			dataIndex: 'dateCreated',
			key: 'dateCreated',
			 sorter: (a, b) => a.dateCreated.localeCompare(b.dateCreated),
			render: text => <Moment format="MMM DD, YYYY HH:mm">{text}</Moment>
		}, {
			title: 'Action',
			key: 'action',
			render: (text, data) => (
			<span>
				{/* MIA <a onClick={()=>this.onPlay(data.key)}>Play</a>
				<Divider type="vertical" /> */}
				<Popconfirm title="Delete this media?" onConfirm={() => this.onDeleteConfirm(data.key)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>
			</span>
		),
		}];

		const headerData = {
			button: {
				title: <span><Icon type="file-add" /> Add media</span>,
				function: () => this.toggleAddModal()
			}
		};
		
		const headerSMediaData = (selectedMedia) ? {
			close: {
				title: <Icon type="close-square" />,
				function: () => this.onSelectMedia()
			}
		} : "";

		let data = [];
		let fullData = 0;
		let sMedia = [];
		if (this.props.mediaData) {
			data = this.props.mediaData.results.map(media => {
				return {
					key: media._id,
					title: media.title,
					artist: media.artist,
					album: media.album,
					dateCreated: media.createdAt 
				}
			});
			fullData = this.props.mediaData.total;

			sMedia = this.props.mediaData.results.filter(media=>media._id === selectedMedia);
		}

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
						<Col md={(!selectedMedia) ? 24 : 0} lg={(!selectedMedia) ? 24 : 12} xl={(!selectedMedia) ? 24 : 16} xxl={(!selectedMedia) ? 24 : 18} className={(selectedMedia) ? 'tableListHolder':''}>
							<HeaderContent title="Media" subtitle="Welcome to media management" data={headerData} />

							<Card title={<p><span>Media List</span></p>}>
								<Table columns={columns} dataSource={data} pagination={false} />
								<Pagination className="table-pagination" showSizeChanger onChange={this.onPageChange} onShowSizeChange={this.onPageSizeChange} defaultCurrent={1} total={fullData} mediaListChange={this.props.mediaListChange} />
							</Card>

							<AddMediaModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
							/>
						</Col>
						<Col md={(!selectedMedia) ? 0 : 24} lg={(!selectedMedia) ? 0 : 12} xl={(!selectedMedia) ? 0 : 8} xxl={(!selectedMedia) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedMedia) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedMedia) ? true : false}>
												<HeaderContent title={sMedia[0].title} subtitle="Media Details" data={headerSMediaData} />
												<Card className="cardDetailsHolder">
													<MediaDetails data={sMedia[0]} callback={()=>this.getMedia()} avatarCallback={true} />
												</Card>
											</Animated>
										</div> : ""
								}
							</div>
						</Col>
					</Row>
				</div>
			</Animated>
		);
	}
}

const mapStateToProps = state => ({
	router: state.router,
	mediaData: state.media.data,
	play: state.media.play
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaList,
		mediaPlay,
		mediaDelete,
		mediaListChange
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Media);