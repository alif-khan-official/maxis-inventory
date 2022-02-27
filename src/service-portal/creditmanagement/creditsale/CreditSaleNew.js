import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../../common/MainComponent";
import "../../../App.css";
import AuthUtil from "../../../auth/AuthUtil";
import DateTimeComponentCreditSale from "./DateTimeComponentCreditSale";
import SearchableDropdownComponentCreditSale	from "./SearchableDropdownComponentCreditSale"	;
import FileComponent from "../../../widgets/FileComponent"	;

class CreditSaleDNew extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props);

		let data = this.props.location.state.item;
		if (!data) data = {"id": "", "isActive": true, "parentId": "", "tanentId": AuthUtil.getTanentId()};

		this.state = {
			"id"	: data.id,
			"code"	: data.code,
			"meta"	: [],
			"label"	: data.label,
			"isActive"	: data.isActive,
			"parentId"	: data.parentId,
			"tenantId"	: data.tanentId,
			"saveOperation": {},
			"failureMessage": "",
			"userId": AuthUtil.getUserId()? AuthUtil.getUserId() : AuthUtil.getUsername(),
			"saleType" : "CREDIT_SALE"
		};

		this.addAPI = {
			path: "maxisservice-service/endpoint/credit-sale/add",
			headers: {
				"Content-Type"	: "application/json",
				"token"			: "Bearer " + AuthUtil.getIdToken(),
				"userid"		: AuthUtil.getUserId(),
			}
		};

		this.setInputValue	= this.setInputValue.bind(this)	;
		this.setFieldValue	= this.setFieldValue.bind(this)	;
		this.loadCustomers	= this.loadCustomers.bind(this)	;
		this.newSale		= this.newSale.bind(this)		;
		this.setCustomer	= this.setCustomer.bind(this)	;
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
				this.setInputValue("customerPhoneNumber", property);
				this.setInputValue("handlerId", customer.handlerId);
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

		let customerDropDownList = [];
		for (let i = 0; customerList !== undefined && customerList != null && i < customerList.length; i++)
			customerDropDownList.push({"value": customerList[i].userId, "label": customerList[i].name});
		this.setInputValue("customerDropDownList", customerDropDownList);
		meta["CUSTOMER_DROPDOWN_LIST"] = customerDropDownList;
		this.setInputValue("meta", meta);

		console.log("========GATHER LIST: START========");
		console.log(this.state.customerList);
		console.log(customerListJson.result.data);
		console.log("========GATHER LIST: END========");		
		console.log("mounted");
	}

	componentDidMount() {
		console.log("mounting");
//		this.loadCustomers();
	}

	newSale() {
		if(this.state.customer === undefined || this.state.customer === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Customer is not selected");
			return;
		}
		if(this.state.invoiceNumber === undefined || this.state.invoiceNumber === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Invoice number is not given");
			return;
		}
		if(this.state.amount === undefined || this.state.amount === "" || isNaN(this.state.amount))
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Amount is not available");
			return;
		}
		if(this.state.invoiceDate === undefined || this.state.invoiceDate === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Invoice date is not selected");
			return;
		}
		if(this.state.followUpDate === undefined || this.state.followUpDate === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Followup date is not selected");
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
		let customerListFieldComponent ={
											"source": "CUSTOMER_LIST",
											"code"	: "customer"
										}
		;
		let design = (
			<div className="card-form-body">
				<div width="100%" style={{ textAlign: "center" }}>
					<h3>
						<b>Credit Sale</b>
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
									<label className="form-input-label2">Customers</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										<SearchableDropdownComponentCreditSale
											filter		= {false}
											context		= {this}	
											placeholder		= "Select customer"
											rootComponent	= {this}
											fieldComponent	= {customerListFieldComponent}
											readOnly={false}
											code="customer"
											list	={this.state.customerDropDownList}
										/> 
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
					                        value={this.state.label}
					                        id={this.state.id + "-invoiceNumber"}
					                        onChange={(e) => this.setInputValue("invoiceNumber", e.target.value)}
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
					                        value={this.state.label}
					                        id={this.state.id + "-amout"}
					                        onChange={(e) => this.setInputValue("amount", e.target.value)}
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
 										<DateTimeComponentCreditSale
											value			= {this.state.invoiceDate}
											rootComponent	= {this}
											readOnly		= {false}
											code			= "invoiceDate"
										/> 
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Followup Date</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										<DateTimeComponentCreditSale
											value			= {this.state.Followup}
											rootComponent	= {this}
											readOnly		= {false}
											code			= "followUpDate"
										/> 
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Invoice</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										<FileComponent
											contextComponent= {this}
											fieldComponent	= {{"code": "receipt", "value": {"fileName" : "Choose a file", "fileCode": ""}}}
											rootComponent	= {this}
											readOnly		= {false}
										/> 
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<Button
										label="Save"
										onClick={() => this.newSale()}
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
								New sale is saved.
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
export default withRouter(CreditSaleDNew);
