import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Animated } from "react-animated-css";
import { Icon, Card, Table, Divider, Popconfirm, Row, Col } from 'antd';

import Moment from 'react-moment';
import 'moment-timezone';

import HeaderContent from '../common/headercontent/HeaderContent';
import AddPlaylistModal from './modal/AddPlaylistModal';

import './playlist.css';

import {
  mediaList,
  mediaPlay
} from '../../modules/media';

import PlaylistDetails from './form/PlaylistDetails';

import {
  playlistList,
  playlistById,
  playlistDelete
} from '../../modules/playlist';

class Playlist extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedPlaylist: null
		}
	}

	componentDidMount() {
		if (!this.props.mediaData) {
			this.props.mediaList();	
		}
		if (!this.props.playlistData) {
			this.props.playlistList();	
		}
	}

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onPlay(playlistId) {
		this.props.playlistById(playlistId);
		setTimeout(()=> {
			const realMedia = this.props.playlistInfo.list.map(media => {
				return media;
			});

			this.props.mediaPlay(null);
			setTimeout(()=> {
				const data = realMedia.map(media => {
					return ({
						name: media.title,
						singer: media.artist,
						cover: media.thumbnail,
						musicSrc: media.url
					})
				}).sort((a, b) => {
					var titleA = a.name.toUpperCase(); // ignore upper and lowercase
		  			var titleB = b.name.toUpperCase(); // ignore upper and lowercase
					
					if (titleA < titleB) return -1;
					if (titleA > titleB) return 1;
					return 0;
				});
				this.props.mediaPlay(data);
			}, 200);
		}, 200);
		
	}

	onDeleteConfirm(playlistId) {
		const { selectedPlaylist } = this.state;

		this.props.playlistDelete(playlistId).then( 
			(res) => {
				if (playlistId === selectedPlaylist) {
					this.setState({ selectedPlaylist: null });
				}
				this.props.playlistList();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	onSelectPlaylist(playlistId) {
		window.scrollTo(0, 0);
		this.setState({ selectedPlaylist: null });
		setImmediate(()=> {
			this.setState({ selectedPlaylist: playlistId });
			if (playlistId) {
				this.props.playlistById(playlistId);
			}
		});
	}

	render() {
		const { addModal, selectedPlaylist } = this.state;

		const columns = [{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			render: (text, data) => {
				return (<a onClick={()=>this.onSelectPlaylist(data.key)}>{text}</a>);
			},
			sorter: (a, b) => a.title.localeCompare(b.title)
		}, {
			title: 'Date & Time',
			dataIndex: 'dateTime',
			key: 'dateTime',
			sorter: (a, b) => a.dateCreated.localeCompare(b.dateCreated),
			render: text => <Moment format="MMM DD, YYYY HH:mm">{text}</Moment>
		}, {
			title: 'Room',
			dataIndex: 'room',
			key: 'room',
			render: (text, data) => {
				return `${text} media/s`;
			}
		}, {
			title: 'Used By',
			dataIndex: 'userIds',
			key: 'userIds',
			render: (text, data) => {
				return `${text} media/s`;
			}
		},
		 {
			title: 'Action',
			key: 'action',
			render: (text, data) => (
			<span>
				<a onClick={()=>this.onPlay(data.key)}>Play</a>
				<Divider type="vertical" />
				<Popconfirm title="Delete this playlist?" onConfirm={() => this.onDeleteConfirm(data.key)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>
			</span>
		),
		}];

		const headerData = {
			button: {
				title: <span><Icon type="file-add" /> Add Schedule</span>,
				function: () => this.toggleAddModal()
			}
		};

		const headerSPlaylistData = (selectedPlaylist) ? {
			close: {
				title: <Icon type="close-square" />,
				function: () => this.onSelectPlaylist()
			}
		} : "";

		let data = [];
		let sPlaylist = [];
		if (this.props.playlistData) {
			data = this.props.playlistData.results.map(playlist => {
				return {
					key: playlist._id,
					title: playlist.title,
					list: playlist.list.length,
					dateCreated: playlist.createdAt 
				}			
			});

			sPlaylist = this.props.playlistData.results.filter(playlist=>playlist._id === selectedPlaylist);
		}

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
						<Col md={(!selectedPlaylist) ? 24 : 12} lg={(!selectedPlaylist) ? 24 : 12} xl={(!selectedPlaylist) ? 24 : 16} xxl={(!selectedPlaylist) ? 24 : 18} className={(selectedPlaylist) ? 'tableListHolder':''}>	
							<HeaderContent title="Schedule Slot" subtitle="List of schedule meetings" data={headerData} />
							<Card title={<p><span>Schedule Slot</span></p>}>
								<Table columns={columns} dataSource={data} />
							</Card>

							<AddPlaylistModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
							/>
						</Col>
						<Col md={(!selectedPlaylist) ? 0 : 12} lg={(!selectedPlaylist) ? 0 : 12} xl={(!selectedPlaylist) ? 0 : 8} xxl={(!selectedPlaylist) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedPlaylist) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedPlaylist) ? true : false}>
												<HeaderContent title={sPlaylist[0].title} subtitle="Playlist Details" data={headerSPlaylistData} />
												<Card className="cardDetailsHolder">
													<PlaylistDetails data={sPlaylist[0]} callback={()=>this.props.playlistList()} avatarCallback={true} />
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
	playlistData: state.playlist.data,
	playlistInfo: state.playlist.info,
	play: state.media.play
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaList,
		mediaPlay,
		playlistList,
		playlistById,
		playlistDelete
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Playlist);