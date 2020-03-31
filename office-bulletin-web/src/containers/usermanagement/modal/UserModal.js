import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Form, Button, Icon } from 'antd';

import UserDetails from '../form/UserDetails';

import {
	userList
} from '../../../modules/user';

class AddUserModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
			message: null
		}
	}

	onClose() {
		this.setState({ 
			message: null
		});
		this.props.toggleAddModal();
	}

	onAdded() {
		this.setState({ 	
			step: 0,
		});
		this.props.toggleAddModal();
		this.props.userList();
	}

	render() {
		const { loading } = this.state;

		return (
			<Modal
				title={(this.props.data) ? <span><Icon type="user" /> User Details</span> : <span><Icon type="user-add" /> Add User</span>}
				visible={this.props.show}
				onCancel={()=>this.onClose()}
				footer={[
					<Button key="back" onClick={()=>this.onClose()} disabled={loading}>Cancel</Button>
				]}
				maskClosable={false}
				closable={(loading) ? false : true}
			>				
				<div style={{ paddingTop: '20px' }}>
					<UserDetails callback={()=>this.onAdded()} data={this.props.data} />
				</div>
			</Modal>
		);
	}
}

const WrappedAddUserModal  = Form.create()(AddUserModal);

const mapStateToProps = state => ({
	router: state.router,
	userProfile: state.user.userProfile
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		userList
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAddUserModal);