import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../../common/MainComponent";
import "../../../App.css";
import AuthUtil from "../../../auth/AuthUtil";
import { Button } from "primereact/button";

class CreditCollectionDetails extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.props);

		this.state = this.props.location.state?this.props.location.state.item:undefined;
		if (!this.state)
			this.state = this.props.location.state; 

		if (!this.state)
		{
			this.state = {};
			this.state.userId = AuthUtil.getTanentId();
		}
		this.annual			= this.annual.bind(this)		;
		this.onboard		= this.onboard.bind(this)		;
		this.discount		= this.discount.bind(this)		;
		this.changeFee		= this.changeFee.bind(this)		;
		this.subscribe		= this.subscribe.bind(this)		;
		this.collection		= this.collection.bind(this)	;
		this.loadSettings	= this.loadSettings.bind(this)	;
		this.dateTemplate	= this.dateTemplate.bind(this)	;
		this.saveSettings	= this.saveSettings.bind(this)	;
		this.setInputValue	= this.setInputValue.bind(this)	;
	}

	async onboard() {
		let clientOnboardFee = this.state.clientOnboardFee;
		
		if (!clientOnboardFee || isNaN(clientOnboardFee))
		{
			this.setInputValue("saveResult", {});
			return;
		}

		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad =	{	"partnerId"	: this.state.userId,
							"amount"	: clientOnboardFee,
							"reference"	: "Onboard fee",
							"action"	: "ONBOARD"
						}
		;
		let settingsSaveResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-ledger/add", 
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
		let settingsSaveJSON	= await settingsSaveResponse.json()	;
		this.setInputValue("saveResult", settingsSaveJSON);				
	}

	async annual() {
		let clientAnnualFee = this.state.clientAnnualFee;
		
		if (!clientAnnualFee || isNaN(clientAnnualFee))
		{
			this.setInputValue("saveResult", {});
			return;
		}

		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad =	{	"partnerId"	: this.state.userId,
							"amount"	: clientAnnualFee,
							"reference"	: "Annual fee",
							"action"	: "ANNUAL"
						}
		;
		let settingsSaveResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-ledger/add", 
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
		let settingsSaveJSON	= await settingsSaveResponse.json()	;
		this.setInputValue("saveResult", settingsSaveJSON);				
	}

	async collection() {
		let collectionAmount = this.state.collectionAmount;
		
		if (!collectionAmount || isNaN(collectionAmount))
		{
			this.setInputValue("saveResult", {});
			return;
		}

		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad =	{	"partnerId"	: this.state.userId,
							"amount"	: collectionAmount,
							"reference"	: this.state.collectionReference,
							"action"	: "DEPOSIT"
						}
		;
		let settingsSaveResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-ledger/add", 
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
		let settingsSaveJSON	= await settingsSaveResponse.json()	;
		this.setInputValue("saveResult", settingsSaveJSON);				
	}

	async discount() {
		let discountAmount = this.state.discountAmount;
		
		if (!discountAmount || isNaN(discountAmount))
		{
			this.setInputValue("saveResult", {});
			return;
		}

		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad =	{	"partnerId"	: this.state.userId,
							"amount"	: discountAmount,
							"reference"	: this.state.discountReference,
							"action"	: "INCENTIVE"
						}
		;
		let settingsSaveResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-ledger/add", 
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
		let settingsSaveJSON	= await settingsSaveResponse.json()	;
		this.setInputValue("saveResult", settingsSaveJSON);				
	}

	async subscribe() {
		let subscribeYear = this.state.subscribeYear;
		
		if (!subscribeYear || isNaN(subscribeYear))
		{
			this.setInputValue("saveResult", {});
			return;
		}

		let subscribeMonth = this.state.subscribeMonth;
		if (!subscribeMonth)
		{
			this.setInputValue("saveResult", {});
			return;
		}
		let month = subscribeMonth.toLowerCase();
		if	(	month === "january"		|| month === "february"	|| month === "march"	|| month === "april"	||
				month === "may"			|| month === "june" 	|| month === "july"		|| month === "august"	||
				month === "september"	|| month === "october"	|| month === "november" || month === "december"
			)
		{			
		}
		else
		{
			this.setInputValue("saveResult", {});
			return;
		}

		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad =	{	"partnerId"	: this.state.userId,
							"amount"	: this.state.subscriptionFee,
							"reference"	: ("Subscription fee: " + subscribeYear + " " + month),
							"action"	: "SUBSCRIPTION"
						}
		;
		let settingsSaveResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-ledger/add", 
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
		let settingsSaveJSON	= await settingsSaveResponse.json()	;
		this.setInputValue("saveResult", settingsSaveJSON);				
	}

	async saveSettings() {
		this.setInputValue("saveResult", {});
		
		if	(
				this.state.subscriptionFee	&& 
				this.state.clientOnboardFee	&& 
				this.state.smsFee			&&
				this.state.clientAnnualFee	&&
				this.state.sendSMSNewSale		!== "" &&
				this.state.sendSMSNewDeposit	!== "" &&
				this.state.sendSMSReminder		!== "" &&
				((this.state.sendSMSReminder !== "YES") || (this.state.sendSMSReminder === "YES" && this.state.autoSMSBefore))
			)
		{
			
		}
		else
		{
			this.setInputValue("saveResult", {});
			return;
		}

		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad =	{	"partnerId"			: this.state.userId				,
							"subscriptionFee"	: this.state.subscriptionFee	,
							"clientOnboardFee"	: this.state.clientOnboardFee	,
							"clientAnnualFee"	: this.state.clientAnnualFee	,
							"smsFee"			: this.state.smsFee				,

							"sendSMSNewSale"	: this.state.sendSMSNewSale		,
							"sendSMSNewDeposit"	: this.state.sendSMSNewDeposit	,
							"sendSMSReminder"	: this.state.sendSMSReminder	,
							"autoSMSBefore"		: this.state.autoSMSBefore
						}
		;
		let settingsSaveResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-settings/add", 
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
		let settingsSaveJSON	= await settingsSaveResponse.json()	;
		this.setInputValue("saveResult", settingsSaveJSON);
	}

	changeFee(key, val) {
		if (isNaN(val))
			return;
		this.setInputValue(key, val);
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	dateTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["creationTime"];

		return r; //.replace("T", " ").substring(0, 16);
	}

	async loadSettings()
	{
		const gwUrlMO = process.env.REACT_APP_SERVICE_API_GW_HOST;
        let payLoad = {"tanentId": this.state.userId};
		let customerListResponse = await fetch	(	gwUrlMO + "maxisservice-service/endpoint/entity-settings/get", 
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
		
		if (customerListJson.length > 0)
		{
			let settings = customerListJson[0];
			this.setInputValue("smsFee"				, settings.smsFee			);
			this.setInputValue("subscriptionFee"	, settings.subscriptionFee	);
			this.setInputValue("clientOnboardFee"	, settings.clientOnboardFee	);
			this.setInputValue("clientAnnualFee"	, settings.clientAnnualFee	);
			this.setInputValue("ledgerSummary"		, settings.ledgerSummary	);
			this.setInputValue("sendSMSNewSale"		, settings.sendSMSNewSale	);
			this.setInputValue("sendSMSNewDeposit"	, settings.sendSMSNewDeposit);
			this.setInputValue("sendSMSReminder"	, settings.sendSMSReminder	);
			this.setInputValue("autoSMSBefore"		, settings.autoSMSBefore	);
		}
		
		console.log("mounted");
	}

	componentDidMount() {
		console.log("mounting");
		this.loadSettings();
	}

	getComponentDesign() {
		let design = (
			<div className="card-form-body">
				<div width="100%" style={{ textAlign: "center" }}>
					<h3>
						<b>Business House Settings</b>
					</h3>
				</div>
				<div>
					<table className="width100">
						<tbody className="width100">
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">ID</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.userId}
									</div>
								</td>
							</tr>
							{	
								this.state.name &&
								<tr className="width100">
									<td className="width25">
										<label className="form-input-label2">Name</label>
									</td>
									<td className="width75">
										<div className="d-flex">
	 										{this.state.name}
										</div>
									</td>
								</tr>
							}
							{	this.state.phoneNumber &&
								<tr className="width100">
									<td className="width25">
										<label className="form-input-label2">Phone number</label>
									</td>
									<td className="width75">
										<div className="d-flex">
	 										{this.state.phoneNumber}
										</div>
									</td>
								</tr>
							}
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Available amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
 										{this.state.ledgerSummary}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Subscription fee</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Subscription fee"
						                    value={this.state.subscriptionFee}
						                    onChange={(e) => this.changeFee("subscriptionFee", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Annual fee</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Annual fee"
						                    value={this.state.clientAnnualFee}
						                    onChange={(e) => this.changeFee("clientAnnualFee", e.target.value)}
						                >
						                </input>
											&nbsp;
										<Button
											label="Annual Fee"
											onClick={this.annual}
										/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Onboard fee</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Onboard fee"
						                    value={this.state.clientOnboardFee}
						                    onChange={(e) => this.changeFee("clientOnboardFee", e.target.value)}
						                >
						                </input>
											&nbsp;
										<Button
											label="Onboard"
											onClick={this.onboard}
										/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">SMS charge</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="SMS charge"
						                    value={this.state.smsFee}
						                    onChange={(e) => this.changeFee("smsFee", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Send SMS for new issue</label>
								</td>
								<td className="width75">
									<div className="width25">
						                <select className="dropdown-select" value={this.state.sendSMSNewSale} onChange={(e) => this.setInputValue("sendSMSNewSale", e.target.value)}>
						                    <option key="send-sms-new-sale-select" value="">--SELECT--</option>
						                    <option key="send-sms-new-sale-yes" value="YES">Yes</option>
						                    <option key="send-sms-new-sale-no" value="NO">No</option>
						                </select>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Send SMS for new collection</label>
								</td>
								<td className="width75">
									<div className="width25">
						                <select className="dropdown-select" value={this.state.sendSMSNewDeposit} onChange={(e) => this.setInputValue("sendSMSNewDeposit", e.target.value)}>
						                    <option key="send-sms-new-deposit-select" value="">--SELECT--</option>
						                    <option key="send-sms-new-deposit-yes" value="YES">Yes</option>
						                    <option key="send-sms-new-deposit-no" value="NO">No</option>
						                </select>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">SMS for reminder / followup</label>
								</td>
								<td className="width75">
									<div className="width25">
						                <select className="dropdown-select" value={this.state.sendSMSReminder} onChange={(e) => this.setInputValue("sendSMSReminder", e.target.value)}>
						                    <option key="send-sms-new-reminder-select" value="">--SELECT--</option>
						                    <option key="send-sms-new-reminder-yes" value="YES">Yes</option>
						                    <option key="send-sms-new-reminder-no" value="NO">No</option>
						                </select>
									</div>
								</td>
							</tr>
							{
								this.state.sendSMSReminder === "YES" && 
								<tr className="width100">
									<td className="width25">
										<label className="form-input-label2">Send auto reminder SMS before (days)</label>
									</td>
									<td className="width75">
										<div className="width25">
							                <input
							                    type="text"
							                    placeholder="Send auto reminder SMS before (days)"
							                    value={this.state.autoSMSBefore}
							                    onChange={(e) => this.changeFee("autoSMSBefore", e.target.value)}
							                >
							                </input>
										</div>
									</td>
								</tr>
							}
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<Button
										label="Save"
										onClick={this.saveSettings}
									/>
								</td>
								<td className="width25">
									<div className="d-flex">
										{this.state.saveResult && this.state.saveResult.partnerId && (
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
														Operation Successful.
													</h5>
												</div>
												<hr />
											</div>
										)}
						
										{this.state.saveResult && !this.state.saveResult.partnerId && (
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
														Operation failed.
													</h5>
												</div>
												<hr />
											</div>
										)}
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Year</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Year"
						                    value={this.state.subscribeYear}
						                    onChange={(e) => this.changeFee("subscribeYear", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Month</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="January, February, ..."
						                    value={this.state.subscribeMonth}
						                    onChange={(e) => this.setInputValue("subscribeMonth", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<Button
										label="Subscribe"
										onClick={this.subscribe}
									/>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Deposit amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Deposit amount"
						                    value={this.state.collectionAmount}
						                    onChange={(e) => this.changeFee("collectionAmount", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Deposit reference</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Deposit reference"
						                    value={this.state.collectionReference}
						                    onChange={(e) => this.setInputValue("collectionReference", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<Button
										label="Deposit"
										onClick={this.collection}
									/>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Incentive amount</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Incentive amount"
						                    value={this.state.discountAmount}
						                    onChange={(e) => this.changeFee("discountAmount", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<label className="form-input-label2">Incentive reference</label>
								</td>
								<td className="width75">
									<div className="d-flex">
						                <input
						                    type="text"
						                    placeholder="Incentive reference"
						                    value={this.state.discountReference}
						                    onChange={(e) => this.setInputValue("discountReference", e.target.value)}
						                >
						                </input>
									</div>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<Button
										label="Incentive"
										onClick={this.discount}
									/>
								</td>
							</tr>
							<tr className="width100">
								<td className="width25">
									<hr/>
								</td>
								<td className="width75">
									<div className="d-flex">
									<hr/>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
		return design;
	}

	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}
}
export default withRouter(CreditCollectionDetails);
