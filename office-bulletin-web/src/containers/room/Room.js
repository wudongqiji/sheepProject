import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Table, Icon, Row, Col, Popconfirm } from 'antd';
import { Animated } from "react-animated-css";


import HeaderContent from '../common/headercontent/HeaderContent';
import AddRoomModal from './modal/AddRoomModal';

import RoomDetails from './form/RoomDetails';

import './room.css';

import {
  roomList,
  roomDelete,
  roomListChange
} from '../../modules/room';

class Room extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedRoom: null
		}
	}

	componentDidMount() {
		if (!this.props.roomData) {
			this.getRoom();		
		}
	}

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onSelectRoom(roomId = null) {
		window.scrollTo(0, 0);
		this.setState({ selectedRoom: null });
		setImmediate(()=> {
			this.setState({ selectedRoom: roomId });
		});
	}

	getRoom() {
		this.props.roomList();		
	}


	onDeleteConfirm(roomId) {
		const { selectedRoom } = this.state;

		this.props.roomDelete(roomId).then( 
			(res) => {
				if (roomId === selectedRoom) {
					this.setState({ selectedRoom: null });
				}
				this.getRoom();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	onPageChange(page, pageSize) {
		this.roomListChange(page, pageSize);
	}

	onPageSizeChange(current, pageSize) {
		this.roomListChange(current, pageSize);
	}

	render() {
      
		const { addModal, selectedRoom } = this.state;
		console.log(this.props)

		const columns = [{
			title: 'Room',
			dataIndex: 'title',
			key: 'title',
			render: (text, data) => {
				return (<a onClick={()=>this.onSelectRoom(data.key)}>{text}</a>);
			},
		}, {
			title: 'Location',
			dataIndex: 'location',
			key: 'location',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, data) => (
			<span>
				<Popconfirm title="Delete this room?" onConfirm={() => this.onDeleteConfirm(data.key)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>
			</span>
		),
		}
	];

		const headerData = {
			button: {
				title: <span><Icon type="file-add" /> Add Room</span>,
				function: () => this.toggleAddModal()
			}
		};
		
		const headerSRoomData = (selectedRoom) ? {
			close: {
				title: <Icon type="close-square" />,
				function: () => this.onSelectRoom()
			}
		} : "";

		let data = [];
		let sRoom = [];
		if (this.props.roomData) {
			data = this.props.roomData.results.map(room => {
				return {
					key: room._id,
					title: room.title,
					location: room.location,
				}
			});

			sRoom = this.props.roomData.results.filter(room=>room._id === selectedRoom);
		}

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
					<Col md={(!selectedRoom) ? 24 : 12} lg={(!selectedRoom) ? 24 : 12} xl={(!selectedRoom) ? 24 : 16} xxl={(!selectedRoom) ? 24 : 18} className={(selectedRoom) ? 'tableListHolder':''}>	
							<HeaderContent title="Room" subtitle="List of Room" data={headerData} />
							<Card title={<p><span>Room </span></p>}>
								<Table columns={columns} dataSource={data} />
							</Card>

							<AddRoomModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
							/>
						</Col>
						<Col md={(!selectedRoom) ? 0 : 12} lg={(!selectedRoom) ? 0 : 12} xl={(!selectedRoom) ? 0 : 8} xxl={(!selectedRoom) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedRoom) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedRoom) ? true : false}>
												<HeaderContent title={sRoom[0].title} subtitle="Room Details" data={headerSRoomData} />
												<Card className="cardDetailsHolder">
													<RoomDetails data={sRoom[0]} callback={()=>this.props.roomList()} avatarCallback={true} />
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
	roomData: state.room.data,
	play: state.room.play
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		roomList,
		roomDelete,
		roomListChange
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Room);