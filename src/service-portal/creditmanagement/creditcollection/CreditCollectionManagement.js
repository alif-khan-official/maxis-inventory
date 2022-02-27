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

class CreditCollectionManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: [],
		};

		console.log("constructed");

		this.viewEntity		= this.viewEntity.bind(this)		;
		this.dateTemplate	= this.dateTemplate.bind(this)		;
		this.setInputValue	= this.setInputValue.bind(this)		;
		this.newCreditSale	= this.newCreditSale.bind(this)		;
		this.pictureTemplate= this.pictureTemplate.bind(this)	;

		this.pageTitle = "Credit Collections";

		this.list = {
			path: "maxisservice-service/endpoint/credit-collection/get-tenant-collection",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};
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

		let r = rowData["creationTime"];

		return r.replace("T", " ").substring(0, 16);
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	newCreditSale() {
		this.props.history.push({ pathname: "/credit-collection-new", state: {} });
	}

	async componentDidMount() {
		console.log("mounting");
		const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {
			tenantId: AuthUtil.getTanentId()
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
					this.setInputValue("tableData", result.creditCollection);
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
					name: "Date",
					selector: "creationTime",
					style: { width: "200px" , textAlign: "right" },
				},
				{ name: "Customer", selector: "customer", style: { width: "250px" } },
				{
					name: "Amount",
					selector: "amount",
					style: { width: "100px", textAlign: "right" },
				},
				{
					name: "Status",
					selector: "availability",
					style: { width: "100px", textAlign: "right" },
				},
				{
					name: "Free Amount",
					selector: "remainingAmount",
					style: { width: "100px", textAlign: "right" },
				},
				{
					name: "Receipt",
					selector: "receipt",
					style: { width: "100px"},
				}
			];
		let tableData = this.state.tableData;

		let componentDesign = (
			<div className="card">
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">{this.pageTitle}</div>
					</div>
				</div>

				<hr />

				<div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>
					<div className="p-col-6 p-lg-3 p-order-md-3">
						<Button
							label="New"
							onClick={() => this.newCreditSale()}
							className="p-button-raised p-button-info"
						/>
					</div>
				</div>

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
									else if (index === 5)
										return (
											<Column
												key={index}
												field={value.selector}
												header={value.name}
												style={value.style}
												filterPlaceholder="Search here"
												filterMatchMode="contains"
												body={this.pictureTemplate}
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
								<Column
									header="Action"
									style={{ width: "256px" }}
									body={(h) => (
										<div className="p-d-flex">
											<div >
												<Button
													label="View"
													onClick={() => {
														this.viewEntity(h);
													}}
												/>
											</div>
										</div>
									)}
								/>
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
export default withRouter(CreditCollectionManagement);
