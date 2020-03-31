import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Card, Table, Icon, Row, Col, Popconfirm } from 'antd';
import { Animated } from "react-animated-css";
import moment from "moment-timezone";


import HeaderContent from '../common/headercontent/HeaderContent';
import AddScheduleModal from './modal/AddScheduleModal';

import ScheduleDetails from './form/ScheduleDetails';

import './schedule.css';

import {
  scheduleList,
  scheduleDelete,
  scheduleListChange
} from '../../modules/schedule';

class Schedule extends Component {
	constructor(props){
		super(props);
		this.state = {
			addModal: false,
			selectedSchedule: null
		}
	}

	componentDidMount() {
		if (!this.props.scheduleData) {
			this.getSchedule();		
		}
	}

	toggleAddModal = () => {
		const { addModal } = this.state;
		this.setState({ addModal: !addModal });
	}

	onSelectSchedule(scheduleId = null) {
		window.scrollTo(0, 0);
		this.setState({ selectedSchedule: null });
		setImmediate(()=> {
			this.setState({ selectedSchedule: scheduleId });
		});
	}

	getSchedule() {
		this.props.scheduleList();		
	}


	onDeleteConfirm(scheduleId) {
		const { selectedSchedule } = this.state;

		this.props.scheduleDelete(scheduleId).then( 
			(res) => {
				if (scheduleId === selectedSchedule) {
					this.setState({ selectedSchedule: null });
				}
				this.getSchedule();
			},
			(err) => {
				this.setState({ loading: false, message: `Can't get through. Please try again later or contact the administrator.` }); 
			}
		);
	}

	onPageChange(page, pageSize) {
		this.scheduleListChange(page, pageSize);
	}

	onPageSizeChange(current, pageSize) {
		this.scheduleListChange(current, pageSize);
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	render() {
      
		const { addModal, selectedSchedule } = this.state;

		const columns = [{
			title: 'Room',
			dataIndex: 'title',
			key: 'title',
			render: (text, data) => {
				return (<a onClick={()=>this.onSelectSchedule(data.key)}>{text}</a>);
			},
		}, {
			title: 'Company',
			dataIndex: 'company',
			key: 'company',
			render: (text, data) => {
				return `${text}`;
			}
		},

		{
			title: 'Description',
			dataIndex: 'text',
			key: 'text',
			render: (text, data) => {
				return `${text}`;
			}
		},

		{
			title: 'User',
			dataIndex: 'user',
			key: 'user',
			render: (text, data) => {
				//return `${this.capitalizeFirstLetter(text.split('@')[0])}`;
				return `${text} users`;
			}
		},

		{
			title: 'Date From',
			dataIndex: 'dateFrom',
			key: 'dateFrom',
			sorter: (a, b) => a.dateFrom.localeCompare(b.dateFrom),
			render: (text, data) => {
				moment(text).format('MM/DD/YYYY')
				return  `${moment(text).format('MM/DD/YYYY HH:mm')}`;
			}
		},
		{
			title: 'Date To',
			dataIndex: 'dateTo',
			key: 'dateTo',
			sorter: (a, b) => a.dateTo.localeCompare(b.dateTo),
			render: (text, data) => {
				moment(text).format('MM/DD/YYYY')
				return  `${moment(text).format('MM/DD/YYYY HH:mm')}`;
			}
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, data) => (
			<span>
				<Popconfirm title="Delete this schedule?" onConfirm={() => this.onDeleteConfirm(data.key)} okText="Yes" cancelText="No"><a>Delete</a></Popconfirm>
			</span>
		),
		}
	];

		const headerData = {
			button: {
				title: <span><Icon type="file-add" /> Add Schedule</span>,
				function: () => this.toggleAddModal()
			}
		};
		
		const headerSScheduleData = (selectedSchedule) ? {
			close: {
				title: <Icon type="close-square" />,
				function: () => this.onSelectSchedule()
			}
		} : "";

		let data = [];
		let sSchedule = [];
		if (this.props.scheduleData) {
			data = this.props.scheduleData.results.map(schedule => {
				return {
					key: schedule._id,
					title: schedule.title,
					text: schedule.text,
					company: schedule.company,
					dateFrom: schedule.dateFrom,
					dateTo:schedule.dateTo,
					user: schedule.list.length,
				}
			});

			sSchedule = this.props.scheduleData.results.filter(schedule=>schedule._id === selectedSchedule);
		}

		return (
			<Animated animationIn="fadeIn">
				<div className="mainContentWrapper" style={{ paddingBottom: (this.props.play) ? '100px' : '20px' }}>
					<Row>
					<Col md={(!selectedSchedule) ? 24 : 12} lg={(!selectedSchedule) ? 24 : 12} xl={(!selectedSchedule) ? 24 : 16} xxl={(!selectedSchedule) ? 24 : 18} className={(selectedSchedule) ? 'tableListHolder':''}>	
							<HeaderContent title="Schedule" subtitle="List of Schedule" data={headerData} />
							<Card title={<p><span>Schedule </span></p>}>
								<Table columns={columns} dataSource={data} />
							</Card>

							<AddScheduleModal 
								show={addModal} 
								toggleAddModal={this.toggleAddModal.bind(this)} 
							/>
						</Col>
						<Col md={(!selectedSchedule) ? 0 : 12} lg={(!selectedSchedule) ? 0 : 12} xl={(!selectedSchedule) ? 0 : 8} xxl={(!selectedSchedule) ? 0 : 6}>
							<div className="mediaDetailsHolder">
								{
									(selectedSchedule) ?
										<div>
											<Animated animationIn="slideInRight" isVisible={(selectedSchedule) ? true : false}>
												<HeaderContent title={sSchedule[0].title} subtitle="Schedule Details" data={headerSScheduleData} />
												<Card className="cardDetailsHolder">
													<ScheduleDetails data={sSchedule[0]} callback={()=>this.props.scheduleList()} avatarCallback={true} />
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
	scheduleData: state.schedule.data,
	play: state.schedule.play
});

const mapDispatchToProps = dispatch =>
bindActionCreators(
	{
		scheduleList,
		scheduleDelete,
		scheduleListChange
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);