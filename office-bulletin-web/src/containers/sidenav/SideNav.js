import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import Ink from 'react-ink';

import './sidenav.css';

import HeaderLogo from '../common/headerlogo/HeaderLogo';
import UserModal from '../usermanagement/modal/UserModal';

import profile from '../static/profile.png';

import {
	userLogout,
	userSideNav
} from '../../modules/user';

class SideNav extends Component {
	constructor(props){
		super(props);
		this.state = {
			userModal: false
		}
	}

	toggleUserModal = () => {
		const { userModal } = this.state;
		this.setState({ userModal: !userModal });
	}

	onLogout() {
		this.props.userLogout();
		this.props.history.push('/login');
	}

	toggleSideNav = () => {
		const { userNav } = this.props;
		this.props.userSideNav(userNav);
	}

	render() {
		const { userModal } = this.state;
		const { userProfile } = this.props;
		const { location } = this.props;

		const userRole = (userProfile.user) ? userProfile.user.role : null;
		const classSideNav = (this.props.userNav) ? 'sideNavWrapper sideNavWrapperForce' : 'sideNavWrapper';

		const toggleSideNav = (this.props.userNav) ? <div className="toggleSideNav"><a onClick={()=>this.toggleSideNav()}><Icon type="menu-fold" /></a></div> : "";

		if (this.props.userAuthenticated && userProfile.user) {
			return (
				<div className={classSideNav}>
					{toggleSideNav}
					<HeaderLogo size="small" />
					<div className="profileHolder">
						<img src={profile} alt="profile default" />
						<div className="details">
							<a className="username" onClick={()=>this.toggleUserModal()}>{userProfile.user.email.split('@')[0]}</a>
							<p className="type">
								{userProfile.user.role}
								<a onClick={()=>this.onLogout()}>signout</a>
							</p>
						</div>
					</div>
					<ul className="navHolder">
						<li className="label">-- main<span className="arrow"></span></li>
						<li className={(location.pathname === '/') ? 'active' : ''}><Link to="/"><Ink /><Icon type="table" /> Schedules</Link></li>
						{
							(userRole === 'admin') ?
								<div>
									<li className="label">-- extra<span className="arrow"></span></li>
									<li className={(location.pathname === '/media') ? 'active' : ''}><Link to="/media"><Ink /><Icon type="file" /> Media</Link></li>
									<li className={(location.pathname === '/room') ? 'active' : ''}><Link to="/room" ><Ink /><Icon type="appstore-o" /> Rooms</Link></li>
									<li className={(location.pathname === '/company') ? 'active' : ''}><Link to="/company" ><Ink /><Icon type="appstore-o" /> Companies</Link></li>
									<li className={(location.pathname === '/display') ? 'active' : ''}><Link to="/display"><Ink /><Icon type="desktop" /> Display Management</Link></li>
									<li className={(location.pathname === '/usermanagement') ? 'active' : ''}><Link to="/usermanagement"><Ink /><Icon type="user" /> User Management</Link></li>
								</div> : ""
						}
					</ul>

					<UserModal
						show={userModal}
						toggleAddModal={this.toggleUserModal.bind(this)}
						data={userProfile.user}
					/>
					<span className="copyright">Copyright &copy; Onwards Media Group All Rights Reserved</span>
				</div>
			);
		}

		return (<div>&nbsp;</div>);
	}

}

const mapStateToProps = state => ({
	router: state.router,
	userAuthenticated: state.user.userAuthenticated,
	userProfile: state.user.userProfile,
	userNav: state.user.userNav
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		userLogout,
		userSideNav
	},
	dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideNav));
