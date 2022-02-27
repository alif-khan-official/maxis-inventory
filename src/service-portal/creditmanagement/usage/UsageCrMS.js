import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";
import DateTimeComponentUsage from "./DateTimeComponentUsage";

class UsageCrMS extends React.Component {
	constructor(props) {
		super(props);

		this.pageTitle = "CrMS Usage";

		let val = new Date();
		let year	= val.getFullYear();
		let month	= val.getMonth() + 1;
		let day		= val.getDate();
		let date = year + "-";
		date = date + (month < 10? "0" : "") + month + "-";
		date = date + (day < 10? "0" : "") + day;
		console.log(date);


		this.state = {
			"tableData": [],
			"actions": undefined,
			"viewDate": date
		};

		console.log("constructed");
		this.list = {
			"path": "maxisservice-service/endpoint/usage/get-usage-crms",
			"headers": {
				"Content-Type": "application/json",
				"token": "Bearer " + AuthUtil.getIdToken(),
				"userid": AuthUtil.getUserId(),
			},
		};
		
		this.setInputValue	= this.setInputValue.bind(this)	;
		this.dateTemplate	= this.dateTemplate.bind(this)	;
		this.collectData	= this.collectData.bind(this)	;
	}

	async collectData()
	{
		const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {
			"viewDate": this.state.viewDate			
		};
		console.log(payLoad);
		try {
			fetch(gwUrl + this.list.path, {
				method	: "POST",
				headers	: this.list.headers,
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((result) => {
					this.setInputValue("tableData", result?result:[]);
				});
		} catch (e) {
		}
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

	async componentDidMount() {
		console.log("mounting");
		console.log("mounted");
	}

	getComponentDesign() {
		let columnData =[
							
							{ name: "Customer", selector: "businessHouseName", style: { width: "250px" } },
							{
								name: "FollowUp",
								selector: "followUpCount",
								style: { width: "150px", textAlign: "right" },
							},
							{
								name: "Credit Sale",
								selector: "creditSaleCount",
								style: { width: "150px", textAlign: "right" },
							},
							{
								name: "Credit Collection",
								selector: "collectionCount",
								style: { width: "150px", textAlign: "right" },
							}
						]
		;
		let tableData = this.state.tableData;

		let componentDesign = (
			<div className="card">
				<hr />

				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">{this.pageTitle}</div>
					</div>
				</div>

				<hr />

				<div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>
					<div className="p-col-2 p-lg-2">
						<DateTimeComponentUsage
							value			= {this.state.viewDate}
							rootComponent	= {this}
							readOnly		= {false}
							code			= "viewDate"
						/>
					</div>
					<div className="p-col-6 p-lg-3 p-order-md-3">
						<Button
							label="View"
							onClick={() => this.collectData()}
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
export default withRouter(UsageCrMS);
