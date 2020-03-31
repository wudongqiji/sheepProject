import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Table, Icon, Row, Col, Popconfirm } from 'antd';
import { Animated } from "react-animated-css";


import HeaderContent from '../common/headercontent/HeaderContent';
import AddCompanyModal from './modal/AddCompanyModal';

import CompanyDetails from './form/CompanyDetails';

import './company.css';

import {
  companyList,
  companyDelete,
  companyListChange
} from '../../modules/company';

class Company extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedCompany: null
		}
	}

	componentDidMount() {
		if (!this.props.companyData) {
			this.getCompany();		
		}
    }
    
   

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onSelectCompany(companyId = null) {
		window.scrollTo(0, 0);
		this.setState({ selectedCompany: null });
		setImmediate(()=> {
			this.setState({ selectedCompany: companyId });
		});
	}

	getCompany() {
		this.props.companyList();		
	}


	onDeleteConfirm(companyId) {
		const { selectedCompany } = this.state;

		this.props.companyDelete(companyId).then( 
			(res) => {
				if (companyId === selectedCompany) {
					this.setState({ selectedCompany: null });
				}
				this.getCompany();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	onPageChange(page, pageSize) {
		this.companyListChange(page, pageSize);
	}

	onPageSizeChange(current, pageSize) {
		this.companyListChange(current, pageSize);
	}

	render() {
             
		const { addModal, selectedCompany } = this.state;

		const columns = [{
			title: 'Company Name',
			dataIndex: 'title',
			key: 'title',
			render: (text, data) => {
				return (<a onClick={()=>this.onSelectCompany(data.key)}>{text}</a>);
			},
		}, {
			title: 'Company Info',
			dataIndex: 'info',
			key: 'info',
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, data) => (
			<span>
				<Popconfirm title="Delete this company?" onConfirm={() => this.onDeleteConfirm(data.key)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>
			</span>
		),
		}
	];

		const headerData = {
			button: {
				title: <span><Icon type="file-add" /> Add Company</span>,
				function: () => this.toggleAddModal()
			}
		};
		
		const headerSCompanyData = (selectedCompany) ? {
			close: {
				title: <Icon type="close-square" />,
				function: () => this.onSelectCompany()
			}
		} : "";

		let data = [];
		let sCompany = [];
		if (this.props.companyData) {
			data = this.props.companyData.results.map(company => {
				return {
					key: company._id,
					title: company.title,
					info: company.info,
				}
			});

			sCompany = this.props.companyData.results.filter(company=>company._id === selectedCompany);
		}

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
					<Col md={(!selectedCompany) ? 24 : 12} lg={(!selectedCompany) ? 24 : 12} xl={(!selectedCompany) ? 24 : 16} xxl={(!selectedCompany) ? 24 : 18} className={(selectedCompany) ? 'tableListHolder':''}>	
							<HeaderContent title="Company" subtitle="List of Company" data={headerData} />
							<Card title={<p><span>Company </span></p>}>
								<Table columns={columns} dataSource={data} />
							</Card>

							<AddCompanyModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
							/>
						</Col>
						<Col md={(!selectedCompany) ? 0 : 12} lg={(!selectedCompany) ? 0 : 12} xl={(!selectedCompany) ? 0 : 8} xxl={(!selectedCompany) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedCompany) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedCompany) ? true : false}>
												<HeaderContent title={sCompany[0].title} subtitle="Company Details" data={headerSCompanyData} />
												<Card className="cardDetailsHolder">
													<CompanyDetails data={sCompany[0]} callback={()=>this.props.companyList()} avatarCallback={true} />
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
	companyData: state.company.data,
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		companyList,
		companyDelete,
		companyListChange
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Company);