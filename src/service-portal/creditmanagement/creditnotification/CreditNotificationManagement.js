import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";

class ReminderManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tableData: []
		};

		console.log("constructed");
		this.contentTemplate = this.contentTemplate.bind(this);
		this.dateTemplate = this.dateTemplate.bind(this);
		this.pageTitle = "Credit Notifications";

		this.list = {
			path: "maxisservice-service/endpoint/scheme/get-notification",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};
	}

	contentTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["notificationContent"];

		if (r)
			return <div>{r}</div>;
		else
			return "";
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
			userId: AuthUtil.getUserId()
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
					this.setInputValue("tableData", result);
				});
		} catch (e) {
			console.log(e);
		}
		console.log("mounted");
	}

	getComponentDesign() {
		let columnData = [];

			columnData = [
//				{ name: "Id", selector: "id", style: { width: "350px" } },
				{
					name: "Date",
					selector: "creationDate",
					style: { width: "100px" , textAlign: "right" },
				},
				{ name: "Customer", selector: "customer.name", style: { width: "150px" } },
				{ name: "Phone", selector: "customer.userId", style: { width: "100px" } },
				{
					name: "Content",
					selector: "notificationContent",
					style: { width: "300px"},
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
									else if (index === 3)
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
												body={this.contentTemplate}
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
export default withRouter(ReminderManagement);
