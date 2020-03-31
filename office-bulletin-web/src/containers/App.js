import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Media from './media/Media';
import Schedule from './schedule/Schedule';
import Room from './room/Room';
import Company from './company/Company';
import UserManagement from './usermanagement/UserManagement';
import Display from './display/Display';
import Login from './login/Login';

/* Components */
import SideNav from './sidenav/SideNav';
import TopNav from './topnav/TopNav';

/* Other pages */
import NotFound from './otherpages/NotFound';

/* Player */
import AudioPlayer from './common/player/AudioPlayer';

/* Header Animation */
import HeaderAnimation from './common/particles/Particles';

import './app.css';

const ScrollToTopPage = () => {
	window.scrollTo(0, 0);
	return null;
};

class App extends Component {
	constructor(props){
		super(props);
		if (this.props.userAuthenticated && this.props.router.location.pathname === '/login') {
			this.props.history.push('/');
		}
	}

	render() {
		const { userProfile } = this.props;
		const userRole = (userProfile.user) ? userProfile.user.role : null;

		const PrivateRoute = ({ component: Component, isAuthenticated, typeAccount, ...rest}) => (
			<Route
				{...rest}

				render={props => (isAuthenticated ? 
					(typeAccount && typeAccount !== userRole) ? <Redirect to="/" /> : <Component {...props} />
					:
					(<Redirect to="/login" />)
				)}
			/>
		);

		const pathName = this.props.router.location.pathname;

		const classMainContent = (pathName !== '/login') ? 'mainContent mainContentDefault' : 'mainContent';
		const headerAnimate = (window.innerWidth > 768) ? <HeaderAnimation /> : "";

		return (
			<div className="App">
				{
					(this.props.router.location.pathname !== '/login') ?
					<div>	
						<SideNav />
						<TopNav />
						<div className="backdropHeader"><div className="content">{headerAnimate}</div></div>
						<AudioPlayer />
					</div>
					:
					""
				}

				<Switch>
					<Route component={ScrollToTopPage} />
				</Switch>

				<div className={classMainContent}>
					<Switch>
						<Route path="/login" component={Login} />
						
						<PrivateRoute exact path="/" component={Schedule} isAuthenticated={this.props.userAuthenticated} />
						<PrivateRoute exact path="/room" component={Room} isAuthenticated={this.props.userAuthenticated} typeAccount="admin" />
						<PrivateRoute exact path="/usermanagement" component={UserManagement} isAuthenticated={this.props.userAuthenticated} typeAccount="admin" />
						<PrivateRoute exact path="/display" component={Display} isAuthenticated={this.props.userAuthenticated} typeAccount="admin" />
						<PrivateRoute exact path="/media" component={Media} isAuthenticated={this.props.userAuthenticated } typeAccount="admin"/>
						<PrivateRoute exact path="/company" component={Company} isAuthenticated={this.props.userAuthenticated } typeAccount="admin"/>
						<Route path="*" exact component={NotFound} />
					</Switch>
				</div>
			</div>
		);
	}
}


const mapStateToProps = state => ({
	router: state.router,
	userAuthenticated: state.user.userAuthenticated,
	userProfile: state.user.userProfile
});

export default withRouter(connect(mapStateToProps)(App));