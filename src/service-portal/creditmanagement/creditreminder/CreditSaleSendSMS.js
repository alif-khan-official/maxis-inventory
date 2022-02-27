import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../../common/MainComponent";
import "../../../App.css";
import AuthUtil from "../../../auth/AuthUtil";

class CreditSaleSendSMS extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props);

		let data = this.props.location.state.row;
		if (!data) data = {"id": "", "isActive": true, "parentId": "", "tanentId": AuthUtil.getTanentId()};

		this.state = {
			"id"	: data.id,
			"code"	: data.code,
			"meta"	: [],
			"label"	: data.label,
			"isActive"	: data.isActive,
			"parentId"	: data.parentId,
			"tenantId"	: AuthUtil.getTanentId(),
			"saveOperation": {},
			"failureMessage": "",
			"userId": AuthUtil.getUserId()? AuthUtil.getUserId() : AuthUtil.getUsername(),
			"saleType" : "CREDIT_SALE",
			"invoiceNumber": data.invoiceNumber,
			"amout": data.amount,
			"remainingAmount": data.remainingAmount,
			"invoiceDate": data.invoiceDate,
			"followUpDate": data.followUpDate,
			"customer": data.customer,
			"saleId": data.id,
			"smsContent": "You are supposed to pay Taka " + data.remainingAmount.toFixed(2) + " on " + data.followUpDate + ". Due balance: [TOTAL_DUE].",
		};

		this.addAPI = {
			path: "maxisservice-service/endpoint/credit-sale/send-sms",
			headers: {
				"Content-Type"	: "application/json",
				"token"			: "Bearer " + AuthUtil.getIdToken(),
				"userid"		: AuthUtil.getUserId(),
			}
		};

		this.setInputValue	= this.setInputValue.bind(this)	;
		this.setFieldValue	= this.setFieldValue.bind(this)	;
		this.loadCustomers	= this.loadCustomers.bind(this)	;
		this.sendSMS		= this.sendSMS.bind(this)		;
		this.setCustomer	= this.setCustomer.bind(this)	;
		this.loadCustomerSettings = this.loadCustomerSettings.bind(this);
	}


	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	setCustomer(property) 
	{
		console.log(property);
		
		for (let i = 0; this.state.customerList !== undefined && this.state.customerList != null && i < this.state.customerList.length; i++)
		{
			let customer = this.state.customerList[i];
			if (customer.userId === property)
			{
				this.setInputValue("customerId", property);
				this.setInputValue("customerName", customer.name);
				this.setInputValue("customerPhoneNumber", customer.phoneNumber);
			}	
		}
		this.setInputValue("customer", property);
	}

	setFieldValue(property, val) {
		let fields = this.state.fields;
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			if (field.code === property) {
				console.log("====property====");
				console.log(property);
				fields[i].value = val;
				fields[i].key = field.code;
				break;
			}
		}
		this.setInputValue("fields", fields);
	}

	async loadCustomers()
	{
		const gwUrlMO = process.env.REACT_APP_ONBOARD_API_GW_HOST;
		let meta = this.state.meta;
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
		
		meta["CUSTOMER_LIST"] = customerList;

		for (let i = 0; customerList !== undefined && customerList != null && i < customerList.length; i++)
		{
			if (this.state.customer === customerList[i].userId)
			{
				this.setInputValue("customerName", customerList[i].name);
				this.setInputValue("customerId", customerList[i].userId);
			}
		}
	}

	componentDidMount() {
		console.log("mounting");
		this.loadCustomers();
		this.loadCustomerSettings();
	}

	async loadCustomerSettings()
	{
		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {"tanentId": this.state.customer};

		try {
			fetch(gwUrlMO + "maxisservice-service/endpoint/entity-settings/get", {
				method	: "POST",
				headers	:	{
								"Content-Type": "application/json",
								"token": "Bearer " + AuthUtil.getIdToken(),
								"userid": AuthUtil.getUserId(),
							},
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					let content = this.state.smsContent;
					let list = result;
					content = content.replace("[TOTAL_DUE].", (0 - list[0].ledgerSummary).toFixed(2)) + " Taka.";
					this.setInputValue("smsContent", content);
				});
		} catch (e) {
			console.log(e);
		}
	}

	sendSMS() {
		if(this.state.smsContent === undefined || this.state.smsContent === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "SMS content date is not set");
			return;
		}
		let saveOperation = {result: ""};
		this.setInputValue("saveOperation", saveOperation);
		
		console.log("saving");
		const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = this.state;
		console.log(payLoad);
		try {
			fetch(gwUrl + this.addAPI.path, {
				"method"	: "POST",
				"headers"	: this.addAPI.headers,
				"body"		: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					if(result && result.status !== 200 && result.status !== "SUCCESS")
					{
						let saveOperation = {result: "FAILURE"};
						this.setInputValue("saveOperation", saveOperation);
						if (result && result.reason && result.reason === "Invalid Token or userId")
							this.setInputValue("failureMessage", "Your session has expired. Please login again.");
						else
							this.setInputValue("failureMessage", result.message? result.message : result.reason);
						this.setInputValue("saveOperation", result);
						return;
					}
					let saveOperation = {result: "SUCCESS"};
					this.setInputValue("saveOperation", saveOperation);
					this.setInputValue("failureMessage", "");
					return;
				});
		} catch (e) {
			console.log(e);
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", e.getMessage());
		}
		console.log("save operation finished");
	}

	getComponentDesign() {
		let design = (
			<div className="card-form-body">
				<div width="100%" style={{ textAlign: "center" }}>
					<h3>
						<b>Credit Sale: Send SMS</b>
					</h3>
				</div>
				<hr/>
				{	this.state.resultPresent ?
						<div width="100%" style={{"textAlign": "left"}}>
							{	this.state.resultPresentProcessing?
									<div width="100%" style={{"textAlign": "left", "backgroundColor": "#ccccff", "color": "#000000"}}>
										<h5> &nbsp;<div className="outerCircle"></div> &nbsp;<b>Processing</b></h5>
									</div>
								:
									null
							}
							{	this.state.resultPresentFailure?
									<div width="100%" style={{"textAlign": "left", "backgroundColor": "#ff7777", "color": "#ffffff"}}>
										<h5><span role="img" aria-labelledby="panda1">❌</span> Failed</h5>
									</div>
								:
									null
							}
							{	this.state.resultPresentSuccess?
									<div width="100%" style={{"textAlign": "left", "backgroundColor": "#22cc22", "color": "#ffffff"}}>
										<h5><span role="img" aria-labelledby="panda1">✅</span> Success</h5>
									</div>
								:
									null
							}
							<hr/>
						</div>
					:
						null
				}
				<div>
					<table className="width100">
						<tbody className="width100">
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Customer Name</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Customer Name"
					                        value={this.state.customerName}
					                        id={this.state.id + "-customerName"}
					                        onChange={(e) => this.setInputValue("customerName", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Customer Phone Number</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Customer Phone Number"
					                        value={this.state.customerId}
					                        id={this.state.id + "-customerId"}
					                        onChange={(e) => this.setInputValue("customerId", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Invoice Number</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Invoice Number"
					                        value={this.state.invoiceNumber}
					                        id={this.state.id + "-invoiceNumber"}
					                        onChange={(e) => this.setInputValue("invoiceNumber", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Invoice Amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Invoice Amount"
					                        value={this.state.amout}
					                        id={this.state.id + "-amout"}
					                        onChange={(e) => this.setInputValue("amount", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Due Amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Due Amount"
					                        value={this.state.remainingAmount}
					                        id={this.state.id + "-remainingAmount"}
					                        onChange={(e) => this.setInputValue("remainingAmount", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Invoice Date</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Invoice Date"
					                        value={this.state.invoiceDate}
					                        id={this.state.id + "-invoiceDate"}
					                        onChange={(e) => this.setInputValue("invoiceDate", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Followup Date</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Followup Date"
					                        value={this.state.followUpDate}
					                        id={this.state.id + "-followUpDate"}
					                        onChange={(e) => this.setInputValue("followUpDate", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Sale Id</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="Sale Id"
					                        value={this.state.saleId}
					                        id={this.state.id + "-saleId"}
					                        onChange={(e) => this.setInputValue("saleId", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">SMS Content</label>
								</td>
								<td className="width75">
									<div className="d-flex">
										<input
					                        className="form-input"
					                        type="text"
					                        placeholder="SMS Content"
					                        value={this.state.smsContent}
					                        id={this.state.id + "-smsContent"}
					                        onChange={(e) => this.setInputValue("smsContent", e.target.value)}
											readOnly
					                    >
					                    </input>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<Button
										label="Send SMS"
										onClick={() => this.sendSMS()}
										className="p-button-raised p-button-info"
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				{this.state.saveOperation.result === "SUCCESS" && (
					<div className="divsuccess">
						<div
							width="100%"
							style={{
								textAlign: "left",
								backgroundColor: "#22cc22",
								color: "#ffffff",
							}}
						>
							<h5>
								<span role="img" aria-labelledby="panda1">
									✅
								</span>
								SMS is saved.
							</h5>
						</div>
						<hr />
					</div>
				)}

				{this.state.saveOperation && (this.state.saveOperation.result === "FAILURE" || this.state.saveOperation.status === 500 || this.state.saveOperation.status === 400) && (
					<div className="divfailure">
						<div
							width="100%"
							style={{
								textAlign: "left",
								backgroundColor: "#ff7777",
								color: "#ffffff",
							}}
						>
							<h5>
								<span role="img" aria-labelledby="panda1">
									❌
								</span>
								{this.state.failureMessage}
							</h5>
						</div>
						<hr />
					</div>
				)}
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
export default withRouter(CreditSaleSendSMS);
