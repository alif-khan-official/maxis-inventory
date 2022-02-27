import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import Picture from "../../../widgets/Picture";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

class CreditPartnerLedgerManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.location.state?.item;
		if (!this.state)
			this.state = this.props.location.state; 
		if (!this.state)
			this.state = {};
		this.state.tableData = [];

		console.log("constructed");

		this.viewEntity		= this.viewEntity.bind(this)		;
		this.dateTemplate	= this.dateTemplate.bind(this)		;
		this.setInputValue	= this.setInputValue.bind(this)		;
		this.pictureTemplate= this.pictureTemplate.bind(this)	;
		this.numberTemplate	= this.numberTemplate.bind(this)	;

		this.pageTitle = "Ledger";

		this.list = {
			path: "maxisservice-service/endpoint/entity-ledger/get",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};
	}

	numberTemplate(rowData, column)
	{
		let value = rowData[column.field];
		
		if (isNaN(value))
			return "";

		else if (value < 0)
			return "(" + (0 - value) + ")";
		
		else 
			return value;
	}

	pictureTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let receipt = rowData["receipt"];
		
		try{
			let receiptJSON = JSON.parse(receipt);
			let fileCode = receiptJSON.fileCode;
			let fileName = receiptJSON.fileName;
			let renderedString =	<Popup
										trigger={<Button className="button"> Receipt </Button>}
										modal
										nested
									>
										{	(close) => 
											{
												let modal = 
															<Picture
																code={fileCode}
																name={fileName}
																close={close}
															>
															</Picture>
												;
												return modal;
											}
										}
									</Popup>
			;
			return renderedString;		
		}
		catch(e)
		{
			return "";
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

	viewEntity(rowData, column) {
		console.log("column");
		console.log(column);

		this.props.history.push({ pathname: "/credit-collection-details", state: {item: rowData}  });
	}

	dateTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["creationDate"];

		let d = new Date(r);
		d = d.setTime(d.getTime() + (6 * 60 * 60 * 1000));
		d = new Date(d);
		let ret =	"" + d.getUTCFullYear() + "-" + 
					(d.getMonth() < 9? "0" : "") + (d.getMonth() + 1) + "-" + 
					(d.getDate() < 10? "0" : "") + (d.getDate() + 0) + " " +
					((d.getHours() < 10 || (d.getHours() > 12 && d.getHours() < 20))? "0" : "") + (d.getHours() > 12? (d.getHours() - 12):d.getHours()) + ":" +
					(d.getMinutes() < 10? "0" : "") + (d.getMinutes() + 0) + " " +
					(d.getHours() > 11? ("PM") : "AM")
		;
		return ret;
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	async componentDidMount() {
		console.log("mounting");
		const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {
			tenantId: this.state.userId? this.state.userId : AuthUtil.getTanentId(),
			tanentId: this.state.userId? this.state.userId : AuthUtil.getTanentId()
		};
		console.log(payLoad);
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
					this.setInputValue("balance", result[result.length - 1].balanceAfterAction);
				});
		} catch (e) {
			console.log(e);
		}
		console.log("mounted");
	}

	getComponentDesign() {
		let columnData = [];

			columnData = [
				{
					name: "Time",
					selector: "creationDate",
					style: { width: "200px" , textAlign: "right" },
				},
				{ name: "Event", selector: "action", style: { width: "150px" } },
				{
					name: "Opening balance",
					selector: "balanceBeforeAction",
					style: { width: "200px", textAlign: "right" },
				},
				{
					name: "Amount",
					selector: "amount",
					style: { width: "100px", textAlign: "right" },
				},
				{
					name: "Closing balance",
					selector: "balanceAfterAction",
					style: { width: "200px", textAlign: "right" },
				},
				{ name: "Reference", selector: "reference", style: { width: "500px" } },
			];
		let tableData = this.state.tableData;

		let componentDesign = (
			<div className="card">
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header"></div>
					</div>
				</div>

				<hr />
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">{this.pageTitle}</div>
					</div>
				</div>

				<div className="p-d-flex">
					<div className="p-col-2 p-lg-2">
						<b>Balance:</b> &nbsp; {(this.state.balance - 0).toFixed(2)}
					</div>
				</div>

				<hr />

				<div className="p-grid fixedwidth512">
					<div className="datatable-filter-demo">
						<DataTable
							value={tableData}
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
									else if (index === 2 || index === 3 || index === 4)
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
												body={this.numberTemplate}
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
export default withRouter(CreditPartnerLedgerManagement);
