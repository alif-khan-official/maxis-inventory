import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../../common/MainComponent";
import "../../../App.css";
import AuthUtil from "../../../auth/AuthUtil";

class CreditSaleDetails extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props);

		let val = this.props.location.state.item;
		if (val) this.state = this.props.location.state;
		
		this.state = {id: val.id};

		this.loadDetails	= this.loadDetails.bind(this)	;
		this.loadCustomers	= this.loadCustomers.bind(this)	;
		this.setInputValue	= this.setInputValue.bind(this)	;
		this.setCustomer	= this.setCustomer.bind(this)	;
		this.dateTemplate	= this.dateTemplate.bind(this)	;
		this.viewEntity		= this.viewEntity.bind(this)	;
		this.dateTemplateString		= this.dateTemplateString.bind(this)	;
	}

	viewEntity(rowData, column) {
		console.log("column");
		console.log(column);

		this.props.history.push({ pathname: "/credit-collection-details", state: {item: rowData}  });
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	dateTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["creationTime"];

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

	dateTemplateString(dateString) {
		let r = dateString;

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

	setCustomer(customerList) 
	{
		let customer = this.state.customer;
		for (let i = 0; customerList !== undefined && customerList != null && i < customerList.length; i++)
		{
			let item = customerList[i];
			if (customer === item.userId)
			{
				this.setInputValue("customerId", item.userId);
				this.setInputValue("customerName", item.name);
				this.setInputValue("customerPhoneNumber", item.phoneNumber);
				this.setInputValue("customerAddress", item.address);
			}	
		}
	}

	async loadDetails()
	{
		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad = {
            "id": this.state.id
        };
		let customerListResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/credit-sale/get-by-id", 
												            {
												                "method"	: "POST",
												                "headers"	:	{
															                    	"Content-Type"	: "application/json",
															                    	"token"			: "Bearer " + AuthUtil.getIdToken(),
																					"userid"		: AuthUtil.getUserId()
												                				},
												                "body"		: JSON.stringify(payLoad)
												            }
								 						)
		;
		let customerListJson	= await customerListResponse.json()	;
		let creditSale = customerListJson.creditSales[0];
		this.setInputValue("customerListJson", customerListJson);
		this.setInputValue("creationTime", creditSale.creationTime);
		this.setInputValue("customerId", creditSale.customer);
		this.setInputValue("customerName", creditSale.customerName);
		this.setInputValue("amount", creditSale.amount);
		this.setInputValue("invoiceNumber", creditSale.invoiceNumber);
		this.setInputValue("invoiceDate", creditSale.invoiceDate);

		this.setInputValue("followUpDate", creditSale.followUpDate);
		this.setInputValue("paymentStatus", creditSale.paymentStatus);
		this.setInputValue("remainingAmount", creditSale.remainingAmount);
		this.setInputValue("handlerName", creditSale.handlerName);
		this.setInputValue("creditCollections", creditSale.creditCollections);

		this.loadCustomers();
		
		console.log("mounted");
	}

	async loadCustomers()
	{
		const gwUrlMO = process.env.REACT_APP_ONBOARD_API_GW_HOST;
        let payLoad = {
            "userId"			: AuthUtil.getUserId()			,
            "accountId"			: AuthUtil.getUserId()			,
            "role"				: "Maxis-Services-LM-Customer"	,
            "onBoardingStatus"	: ""
        };
		let customerListResponse = await fetch	(	gwUrlMO + "authorization-service/endpoint/user/list-partner-role", 
												            {
												                "method"	: "POST",
												                "headers"	:	{
															                    	"Content-Type"	: "application/json",
															                    	"token"			: "Bearer " + AuthUtil.getIdToken()
												                				},
												                "body"		: JSON.stringify(payLoad)
												            }
								 						)
		;
		let customerListJson	= await customerListResponse.json()	;
		let customerList = customerListJson.result.response;
		this.setInputValue("customerList", customerList);
		this.setCustomer(customerList);
		
		console.log("mounted");
	}

	componentDidMount() {
		console.log("mounting");
		this.loadDetails();
	}

	getComponentDesign() {
		let columnData =	[
								{
									name: "Date",
									selector: "creationTime",
									style: { width: "150px" , textAlign: "right" },
								},//
								{
									name: "Receipt",
									selector: "moneyReceiptNumber",
									style: { width: "200px", textAlign: "center" },
								},
								{
									name: "Adjusted",
									selector: "takenAmount",
									style: { width: "100px", textAlign: "right" },
								}
							]
		;
		let design = (
			<div className="card-form-body">
				<div width="100%" style={{ textAlign: "center" }}>
					<h3>
						<b>Credit Issue Details</b>
					</h3>
				</div>
				<div>
					<table className="width100">
						<tbody className="width100">
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Sale ID</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.id}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Customer Phone number</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.customerId}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Customer name</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.customerName}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Issued credit amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.amount}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Invoice number</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.invoiceNumber}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Invoice date</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.invoiceDate}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Followup date</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.followUpDate}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Entry time</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{ this.dateTemplateString(this.state.creationTime)}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Status</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.paymentStatus}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Due amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.remainingAmount}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">SalesOfficer</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.handlerName}
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<hr />
				<div>
					<table className="width100">
						<tbody className="width100">
							<tr className="width100">
								<td className="width25">
									<h4><label className="form-input-label2">Related Collections</label></h4>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<DataTable
										value={this.state.creditCollections}
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
											<Column
												header="Details"
												style={{ width: "256px" }}
												body={(h) => (
													<div className="p-d-flex">
														<div >
															<Button
																label="Details"
																onClick={() => {
																	this.viewEntity(h);
																}}
															/>
														</div>
													</div>
												)}
											/>
									</DataTable>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<hr />
			</div>
		);
		return design;
	}

	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}
}
export default withRouter(CreditSaleDetails);
