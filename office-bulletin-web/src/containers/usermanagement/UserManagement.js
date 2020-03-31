import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Table, Icon, Row, Col, Popconfirm } from 'antd';
import { Animated } from "react-animated-css";

import Moment from 'react-moment';
import 'moment-timezone';

import HeaderContent from '../common/headercontent/HeaderContent';
import UserModal from './modal/UserModal';

import UserDetails from './form/UserDetails';

import './usermanagement.css';

import {
	userList,
	userDelete
} from '../../modules/user';

class UserManagement extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedUser: null
		}
	}

	componentDidMount() {
		if (this.props.userData.length === 0) {
			this.props.userList();
		}
	}

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onSelectUser(userId = null) {
		this.setState({ selectedUser: null });
		setImmediate(()=> {
			this.setState({ selectedUser: userId });
		});
	}

	onDeleteConfirm(userId) {
		const { selectedUser } = this.state;
		console.log(this.state);
		console.log(this.props);

		this.props.userDelete(userId).then( 
			(res) => {
				if (userId === selectedUser) {
					this.setState({ selectedUser: null });
				}
				this.props.userList();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	render() {
		const { addModal, selectedUser } = this.state;

		const columns = [{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			//sorter: (a, b) => a.title.localeCompare(b.title)
		}, {
			title: 'Date Created',
			dataIndex: 'dateCreated',
			key: 'dateCreated',
			//sorter: (a, b) => a.dateCreated.localeCompare(b.dateCreated),
			render: text => <Moment format="MMM DD, YYYY HH:mm">{text}</Moment>
		}, {
			title: 'Action',
			key: 'action',
			render: (text, data) => {
				if (data.role !== 'admin') {
					return (
						<span>
							<Popconfirm title="Delete this user?" onConfirm={() => this.onDeleteConfirm(data.key)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>
						</span>
					);
				}
				return <span>-</span>;
			}
		}];

		const data = this.props.userData.filter(user => {
			if (user.role === 'user') {
				return {
					key: user.id,
					email: user.email,
					role: user.role,
					dateCreated: user.createdAt 
				}	
			}
			return false;		
		});

		const headerData = {
			button: {
				title: <span><Icon type="user-add" /> Add user</span>,
				function: () => this.toggleAddModal()
			}
		}

		const sUser = this.props.userData.filter(user=>user._id === selectedUser);
		const headerSUserData = (selectedUser) ? {
				close: {
					title: <Icon type="close-square" />,
					function: () => this.onSelectUser()
				}
			} : "";

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
						<Col md={(!selectedUser) ? 24 : 12} lg={(!selectedUser) ? 24 : 12} xl={(!selectedUser) ? 24 : 16} xxl={(!selectedUser) ? 24 : 18}>
							<HeaderContent title="User Management" subtitle="Welcome to user management" data={headerData} />

							<Card title={<p><span>User</span> List</p>}>
								<Table columns={columns} dataSource={data} />
							</Card>

							<UserModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
								data={null}
							/>
						</Col>
						<Col md={(!selectedUser) ? 0 : 12} lg={(!selectedUser) ? 0 : 12} xl={(!selectedUser) ? 0 : 8} xxl={(!selectedUser) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedUser) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedUser) ? true : false}>
												<HeaderContent title={sUser[0].title} subtitle="Media Details" data={headerSUserData} />
												<Card>
													<UserDetails data={sUser[0]} callback={()=>this.getMedia()} avatarCallback={true} />
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
	userData: state.user.userData
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		userList,
		userDelete
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);