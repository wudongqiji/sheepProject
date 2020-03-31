import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'antd';

import {
  displayInsert,
  displayList
} from '../../../modules/display';

import DisplayDetails from '../form/DisplayDetails';

class AddDisplayModal extends Component {
	constructor(props){
		super(props);
		this.state = {
			loading: false,
		}
	}

	onClose() {
		this.setState({ 	
			step: 0,
		});
		this.props.toggleAddModal();
	}

	onAdded() {
		this.setState({ 	
			step: 0,
		});
		this.props.toggleAddModal();
		this.props.displayList();
	}

	render() {
		const { loading } = this.state;

		return (
			<Modal
				title={<span><Icon type="file-add" /> Add Display</span>}
				visible={this.props.show}
				onCancel={()=>this.onClose()}
				footer={[
					<Button key="back" onClick={()=>this.onClose()} disabled={loading}>Cancel</Button>
				]}
				maskClosable={false}
				closable={(loading) ? false : true}
			>
				<DisplayDetails data={null} callback={()=>this.onAdded()} show={this.props.show} />
			</Modal>
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
		displayInsert,
		displayList
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(AddDisplayModal);