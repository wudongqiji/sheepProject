import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Button, Icon } from 'antd';

import {
  companyInsert,
  companyList
} from '../../../modules/company';

import CompanyDetails from '../form/CompanyDetails';

class AddCompanyModal extends Component {
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
		this.props.companyList();
	}

	render() {
		const { loading } = this.state;

		return (
			<Modal
				title={<span><Icon type="file-add" /> Add Company</span>}
				visible={this.props.show}
				onCancel={()=>this.onClose()}
				footer={[
					<Button key="back" onClick={()=>this.onClose()} disabled={loading}>Cancel</Button>
				]}
				maskClosable={false}
				closable={(loading) ? false : true}
			>
				<CompanyDetails data={null} callback={()=>this.onAdded()} show={this.props.show} />
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
		companyInsert,
		companyList
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(AddCompanyModal);