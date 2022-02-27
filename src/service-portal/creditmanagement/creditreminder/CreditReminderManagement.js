import { Dropdown } from 'primereact/dropdown';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";
import DateTimeComponentReminder from "./DateTimeComponentReminder";

class CreditReminderManagement extends React.Component {
	constructor(props) {
		super(props);
		this.obgwUrl= process.env.REACT_APP_ONBOARD_API_GW_HOST;

		let val = new Date();
		let year	= val.getFullYear();
		let month	= val.getMonth() + 1;
		let day		= val.getDate();
		let date = year + "-";
		date = date + (month < 10? "0" : "") + month + "-";
		date = date + (day < 10? "0" : "") + day;
		this.dateFrom = date;
		this.dateTo = date;

		this.state = {
			tableData: [],
			salesOfficers: [],
			selectedSalesOfficer: {userId: "", name: "----All----"},
			dateFrom: date,
			dateTo: date,
			message: "",
			doneStatus:""
		};

		console.log("constructed");
		this.setInputValue = this.setInputValue.bind(this);
		this.newCreditSale = this.newCreditSale.bind(this);
		this.dateTemplate = this.dateTemplate.bind(this);
		this.getSalesId = this.getSalesId.bind(this);

		this.changeSalesOfficer = this.changeSalesOfficer.bind(this);
		this.sendSMS = this.sendSMS.bind(this);
		this.doneClick = this.doneClick.bind(this);
		this.reschedule = this.reschedule.bind(this);
		this.viewEntity = this.viewEntity.bind(this);
		this.loadSalesOfficers = this.loadSalesOfficers.bind(this);
		this.search = this.search.bind(this);
		
		this.pageTitle = "Followup Management";
//sosummary
		this.sosummary = {
			path: "maxisservice-service/endpoint/entity/sosummary",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};
		
		this.done = {
			path: "maxisservice-service/endpoint/followup/done",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};
		
		this.list = {
			path: "maxisservice-service/endpoint/followup/get-tenant-followups",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};
		
		this.role = AuthUtil.getRole(0).code;
		console.log(this.role);
	}

	changeSalesOfficer(selectedSalesOfficer) {
		this.setInputValue("selectedSalesOfficer", selectedSalesOfficer );
		
		let filteredData = [];
		let data = this.state.tableData;
		
		for(let i = 0; data && i < data.length; i++)
		{
			let sale = data[i];
			if	(
					(	sale.saleOfficerId === selectedSalesOfficer.userId ||
						selectedSalesOfficer.userId === "" 
					)
				)
			{
				filteredData.push(sale);
			}
		}
		
		this.setInputValue("filteredData", filteredData);
	}

	async loadSalesOfficers()
	{
		const payLoad = {"userId": AuthUtil.getUserId(), "accountId": AuthUtil.getUserId(), "role":"Maxis-Business-House-Sales-Officer", "onBoardingStatus": null};

		try {
			fetch(this.obgwUrl + "authorization-service/endpoint/user/list-partner-role", {
				method	: "POST",
				headers	:	{
								"Content-Type": "application/json",
								"token": "Bearer " + AuthUtil.getIdToken()
							},
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					let list = result.result.response;
					list.push({userId: "", name: "----All----"});
					this.setInputValue("salesOfficers", list);
				});
		} catch (e) {
			console.log(e);
		}
	}

	booleanTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["active"];

		if (r)
			return "Yes";
		else
			return "";
	}

	reschedule(rowData) {
		this.props.history.push({ pathname: "/credit-sales-reschedule", state: {row: rowData} });
		console.log(rowData);
	}

	doneClick(rowData) {
		try {
			let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
			let payLoad = {
				id: rowData.id
			};
			
			fetch(gwUrl + this.done.path, {
				method	: "POST",
				headers	: this.list.headers,
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					this.setInputValue("doneStatus", "DONE");
				});
		} catch (e) {
			console.log(e);
		}
	}

	sendSMS(rowData) {
		this.props.history.push({ pathname: "/credit-sales-send-sms", state: {row: rowData} });
		console.log(rowData);
	}
	
	getSalesId(rowData, column) {
		let r = rowData["id"];

		return r;
	}

	dateTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["createddateTime"];

		return r.replace("T", " ").substring(0, 16);
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	newCreditSale() {
		this.props.history.push({ pathname: "/credit-sale-new", state: {} });
	}

	viewEntity(item) {
		this.props.history.push({
			pathname: "/measurement-unit-category-details",
			state: { item: item },
		});
		console.log("====item====");
		console.log(item);
	}

	componentDidMount() {
		console.log("mounting");
		if (this.role === "Maxis-Business-House-Admin" || this.role === "Maxis-Business-House-Manager" || this.role === "Maxis-Business-House-Accountant")
		{
			this.loadSalesOfficers();
		}

		this.search();
		console.log("mounted");
	}

	async search()
	{
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		
		
		if (this.state.dateFrom > this.state.dateTo)
		{
			this.setInputValue("message", "* The 'From' date should a previous date than the 'To' date");
			return;
		}
		else
		this.setInputValue("message", "");
		
		let payLoad = {
			businessHouseId: AuthUtil.getTanentId(),
			followUpDateLongFrom: this.state.dateFrom	,
			followUpDateLongTo	: this.state.dateTo
		};
		
		if (this.role === "Maxis-Business-House-Admin" || this.role === "Maxis-Business-House-Manager" || this.role === "Maxis-Business-House-Accountant")
		{
		}
		else
		{
			payLoad.saleOfficerId = AuthUtil.getUserId();
			this.list.path= "maxisservice-service/endpoint/followup/get-bh-so-date-range";
		}

		try {
			fetch(gwUrl + this.list.path, {
				method	: "POST",
				headers	: this.list.headers,
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					this.setInputValue("tableData", result);
					this.setInputValue("filteredData", result);
					this.changeSalesOfficer(this.state.selectedSalesOfficer);
				});
		} catch (e) {
			console.log(e);
		}
	}

	getComponentDesign() {
		let columnData = [];
		if(this.role === "Maxis-Business-House-Admin" || this.role === "Maxis-Business-House-Manager" || this.role === "Maxis-Business-House-Accountant")
			columnData = [
				{
					name: "Entry Time",
					selector: "createddateTime",
					style: { width: "170px" , textAlign: "right" },
				},
				{ name: "Customer Name", selector: "customerCredit.name", style: { width: "200px" } },
				{
					name: "Follow up Date",
					selector: "followUpDateString",
					style: { width: "180px", textAlign: "right" },
				},
				{
					name: "Amount",
					selector: "followUpAmount",
					style: { width: "100px", textAlign: "right" },
				},
				{
					name: "Status",
					selector: "status",
					style: { width: "100px", textAlign: "right" },
				},
				{ name: "Sales Officer", selector: "saleOfficer.name", style: { width: "200px" } }
			];
		else
			columnData = [
				{
					name: "Entry Time",
					selector: "createddateTime",
					style: { width: "170px" , textAlign: "right" },
				},
				{ name: "Customer Name", selector: "customerCredit.name", style: { width: "200px" } },
				{
					name: "Follow up Date",
					selector: "followUpDateString",
					style: { width: "180px", textAlign: "right" },
				},
				{
					name: "Amount",
					selector: "followUpAmount",
					style: { width: "100px", textAlign: "right" },
				},
				{
					name: "Status",
					selector: "status",
					style: { width: "100px", textAlign: "right" },
				}
			];

		let filteredData = this.state.filteredData;

		let componentDesign = (
			<div className="card">
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">{this.pageTitle}</div>
					</div>
				</div>

				<div className="p-d-flex border">
					<div className="p-col-2 p-lg-2 text-center">
						<b>From</b>
					</div>
					<div className="p-col-2 p-lg-2">
					</div>
					<div className="p-col-2 p-lg-2 text-center">
						<b>To</b>
					</div>
					<div className="p-col-2 p-lg-2">
					</div>
				</div>

				<div className="p-d-flex border">
					<div className="p-col-2 p-lg-2">
						<DateTimeComponentReminder
							value			= {this.state.dateFrom}
							rootComponent	= {this}
							readOnly		= {false}
							code			= "dateFrom"
						/> 
					</div>
					<div className="p-col-2 p-lg-2">
					</div>
					<div className="p-col-2 p-lg-2">
						<DateTimeComponentReminder
							value			= {this.state.dateTo}
							rootComponent	= {this}
							readOnly		= {false}
							code			= "dateTo"
						/> 
					</div>
					<div className="p-col-2 p-lg-2">
					</div>
				</div>

				<div className="p-d-flex border">
					<div className="p-col-3 p-lg-3 text-center">
						<Button
							label="Filter by Dates"
							onClick={() => {
								this.search();
							}}
						/>
					</div>
					
					{
						this.state.message !== "" &&
						<div className="p-col-9 p-lg-9 text-center error-color">
							<b>{this.state.message}</b>
						</div>
					}
				</div>

				<hr />

				{
					(this.role === "Maxis-Business-House-Admin") &&
					<div className="p-d-flex border">
						<div className="p-col-2 p-lg-2">
							Sales Officer
						</div>
						<div className="p-col-3 p-lg-3">
							<Dropdown
		                        inputId="userId"
		                        value={this.state.selectedSalesOfficer ? this.state.selectedSalesOfficer : {}}
		                        options={this.state.salesOfficers ? this.state.salesOfficers.sort((a, b) => (a.name > b.name) ? 1 : -1) : []}
		                        onChange={(e) => { this.changeSalesOfficer(e.target.value) }}
		                        placeholder="Select Sales Officer"
		                        optionLabel="name" 
							/>
						</div>
					</div>
				}

				<hr />

				{
					this.state.doneStatus !== "" &&
					<div style={{color: "green"}}>
						Done
						<br/>
						<hr/>
					</div>
				}
				<div className="p-grid fixedwidth512">
					<div className="datatable-filter-demo">
						<DataTable
							value={filteredData}
							paginator
							rows={10}
							className="p-datatable-customers"
						>
							{columnData &&
								columnData.map((value, index) => {
									if (index === 0)
										return (
											<Column
												key={index}
												field={value.selector}
												header={value.name}
												style={value.style}
												sortable={true}
												filter
												filterPlaceholder="Search here"
												filterMatchMode="contains"
												body={this.dateTemplate}
											/>
										);
									else
										return (
											<Column
												key={index}
												field={value.selector}
												header={value.name}
												style={value.style}
												sortable={true}
												filter
												filterPlaceholder="Search here"
												filterMatchMode="contains"
											/>
										);
								})}
								{
									(this.role === "Maxis-Business-House-Sales-Officer") &&
									<Column
										header="Done"
										style={{ width: "200px" }}
										body={(h) => (
											<div className="p-d-flex">
												<Button
													label="Done"
													onClick={() => {
														this.doneClick(h);
													}}
												/>
											</div>
										)}
									/>
								}
								{
									(this.role === "Maxis-Business-House-Admin" || this.role === "Maxis-Business-House-Manager" || this.role === "Maxis-Business-House-Accountant") &&
									<Column
										header="Reschedule"
										style={{ width: "200px" }}
										body={(h) => (
											<div className="p-d-flex">
												<Button
													label="Reschedule"
													onClick={() => {
														this.reschedule(h);
													}}
												/>
											</div>
										)}
									/>
								}
								{
									(this.role === "Maxis-Business-House-Admin" || this.role === "Maxis-Business-House-Manager" || this.role === "Maxis-Business-House-Accountant") &&
									<Column
										header="Notify"
										style={{ width: "200px" }}
										body={(h) => (
											<div className="p-d-flex">
												<Button
													label="Send SMS"
													onClick={() => {
														this.sendSMS(h);
													}}
												/>
											</div>
										)}
									/>
								}
						</DataTable>
					</div>
				</div>
				<hr />
				<br />
			</div>
		);
		return componentDesign;
	}
	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}
}
export default withRouter(CreditReminderManagement);
