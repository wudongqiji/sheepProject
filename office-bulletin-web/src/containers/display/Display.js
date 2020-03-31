import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Animated } from "react-animated-css";
import { Icon, Card, Table, Row, Col } from 'antd';

import 'moment-timezone';

import HeaderContent from '../common/headercontent/HeaderContent';
import AddDisplayModal from './modal/AddDisplayModal';

import './display.css';

import {
  mediaList,
  mediaPlay
} from '../../modules/media';

import DisplayDetails from './form/DisplayDetails';

import {
  displayList,
  displayById,
  displayDelete
} from '../../modules/display';

class Display extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedDisplay: null
		}
	}

	componentDidMount() {
		if (!this.props.mediaData) {
			this.props.mediaList();	
		}
		if (!this.props.displayData) {
			this.props.displayList();	
		}
	}

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onPlay(displayId) {
		this.props.displayById(displayId);
		setTimeout(()=> {
			const realMedia = this.props.displayInfo.list.map(media => {
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

	onDeleteConfirm(displayId) {
		const { selectedDisplay } = this.state;

		this.props.displayDelete(displayId).then( 
			(res) => {
				if (displayId === selectedDisplay) {
					this.setState({ selectedDisplay: null });
				}
				this.props.displayList();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	onSelectDisplay(displayId) {
		window.scrollTo(0, 0);
		this.setState({ selectedDisplay: null });
		setImmediate(()=> {
			this.setState({ selectedDisplay: displayId });
			if (displayId) {
				this.props.displayById(displayId);
			}
		});
	}

	render() {
		const { addModal, selectedDisplay } = this.state;

		const columns = [{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			render: (text, data) => {
				return (<a onClick={()=>this.onSelectDisplay(data.key)}>{text}</a>);
			},
			sorter: (a, b) => a.title.localeCompare(b.title)
		}, {
			title: 'Scrolling Text',
			dataIndex: 'text',
			key: 'text',
			render: (text, data) => {
				return `${text}`;
			}
		}, {
			title: 'Media Attached',
			dataIndex: 'list',
			key: 'list',
			render: (text, data) => {
				return `${text} media/s`;
			}
		},
			{
				title: 'Action',
				key: 'action',
				render: (text, data) => (<a onClick={()=>this.onSelectDisplay(data.key)}>Edit</a>),
		
		}];

		const headerData = {
			// button: {
			// 	title: <span><Icon type="file-add" /> Add Display</span>,
			// 	function: () => this.toggleAddModal()
			// }
		};

		const headerSDisplayData = (selectedDisplay) ? {
			close: {
				title: <Icon type="close-square" />,
				function: () => this.onSelectDisplay()
			}
		} : "";

		let data = [];
		let sDisplay = [];
		if (this.props.displayData) {
			data = this.props.displayData.results.map(display => {
				return {
					key: display._id,
					title: display.title,
					text: display.text,
					list: display.list.length,
					dateCreated: display.createdAt 
				}			
			});

			sDisplay = this.props.displayData.results.filter(display=>display._id === selectedDisplay);
		}

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
						<Col md={(!selectedDisplay) ? 24 : 12} lg={(!selectedDisplay) ? 24 : 12} xl={(!selectedDisplay) ? 24 : 16} xxl={(!selectedDisplay) ? 24 : 18} className={(selectedDisplay) ? 'tableListHolder':''}>	
							<HeaderContent title="Display Slot" subtitle="List of Display" data={headerData} />
							<Card title={<p><span>Display Slot</span></p>}>
								<Table columns={columns} dataSource={data} />
							</Card>

							<AddDisplayModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
							/>
						</Col>
						<Col md={(!selectedDisplay) ? 0 : 12} lg={(!selectedDisplay) ? 0 : 12} xl={(!selectedDisplay) ? 0 : 8} xxl={(!selectedDisplay) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedDisplay) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedDisplay) ? true : false}>
												<HeaderContent title={sDisplay[0].title} subtitle="Display Details" data={headerSDisplayData} />
												<Card className="cardDetailsHolder">
													<DisplayDetails data={sDisplay[0]} callback={()=>this.props.displayList()} avatarCallback={true} />
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
	displayData: state.display.data,
	displayInfo: state.display.info,
	play: state.media.play
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		mediaList,
		mediaPlay,
		displayList,
		displayById,
		displayDelete
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Display);