import React from 'react';
import { withRouter } from 'react-router-dom';
import MainComponent from '../../../common/MainComponent';
import InputFieldComponentv2		from "../../onboarding/FormComponent/InputFieldComponentv2"			;
import SearchableDropdownComponentScheme	from "./SearchableDropdownComponentScheme"	;
import DateTimeComponentScheme from "./DateTimeComponentScheme";
import AuthUtil from "../../../auth/AuthUtil";
import '../../../App.css';
import { Button } from 'primereact/button';

class NewScheme extends React.Component {
	constructor(props) 
	{
		let val = new Date();
		let year	= val.getFullYear()	;
		let month	= val.getMonth() + 1;
		let day		= val.getDate()		;
		let date	= year + "-"		;
		date = date + (month < 10? "0" : "") + month + "-"	;
		date = date + (day < 10? "0" : "") + day			;

		console.log("========data attempt========");
		super(props);
		console.log(this.props);
		let data = this.props.location.state;
		const stepDisplayStyleActive	= {"display": "block"	}; 
		const stepDisplayStyleInactive	= {"display": "none"	}; 
		
		let roleList = AuthUtil.getRoleList();
		console.log(roleList);
		let roleId = "";

		for (let index = 0; index < roleList.length; index++) 
		{
			if (roleList[index].name === "admin") 
			{
				roleId = roleList[index].code;
				break;
			} 
			else 
			{
				roleId = roleList[index].code;
				break;
			}
		}
		
		this.state =	{	
							"attemptId"		: data.attemptIdScheme	, 
							"propCustomerId": data.userId			,
							"profileId"		: data.profileId		, 
							"fields"		: []			, 
							"designName"	: "Form"		, 
							"fieldvalues"	: []			, 
							"activeStep"	: 0				, 
							"lastStep"		: 0				, 
							"steps"			: []			,
							"roleName"		: roleId		,
							
							"stepDisplayStyleActive"	: stepDisplayStyleActive	,
							"stepDisplayStyleInactive"	: stepDisplayStyleInactive	,
							
							"resultPresent"				: false,
							"resultPresentProcessing"	: false,
							"resultPresentFailure"		: false,
							"resultPresentSuccess"		: false,
							
							"meta"						: [],
							"dropdowns"					: [],
							"customerId"				: "",
							"customerPhoneNumber"		: "",
							"customerName"				: "",
							"customerList"				: [],
							"customerDropDownList"		: [],
							"attemptIdScheme"			: data.attemptIdScheme, 
							"dropDownsDependencies"		: [],
							"dropDownValues"			: [],
							
							"installmentYYYYMMDD"		: date,
							"installmentDuration"		: "MONTHLY",
							"installmentAmount"			: "",
							"installmentCount"			: "",
							"installmentDetails"		: "",
							"installmentSchedule"		: []
						}
		;

		this.saveDropDownDependencies	= this.saveDropDownDependencies.bind(this)	;
		this.resetInstalleSchedule		= this.resetInstalleSchedule.bind(this)		;
		this.saveDropDownValues			= this.saveDropDownValues.bind(this)		;
		this.setInputValue				= this.setInputValue.bind(this)				;
		this.setFieldValue				= this.setFieldValue.bind(this)				;
		this.activateStep				= this.activateStep.bind(this)				;
		this.setCustomer				= this.setCustomer.bind(this)				;
		this.saveScheme					= this.saveScheme.bind(this)				;
		this.stepChange					= this.stepChange.bind(this)				;
		this.newScheme					= this.newScheme.bind(this)					;
	}

	resetInstalleSchedule(key, value)
	{
		this.setInputValue(key, value);
		
		let count = 0;
		let date = new Date();
		
		if (isNaN(count))
		{
			return;
		}
		
		if(key === "installmentYYYYMMDD")
		{
			date = new Date(value);
			count = this.state.installmentCount;
		}
		else if(key === "installmentCount")
		{
			date = new Date(this.state.installmentYYYYMMDD);
			count = value;
		}
		
		let newSchedule = [];
		this.setInputValue("installmentSchedule", newSchedule);
		
		for(let i = 0; i < count; i++)
		{
			let installment = {};
			let currentDate = new Date(date);
			installment.installmentSerial = i - 0 + 1;
			currentDate.setMonth(currentDate.getMonth() + i);
			installment.dateObject = currentDate;

			
			let year	= currentDate.getFullYear();
			let month	= currentDate.getMonth() + 1;
			let day		= currentDate.getDate();
			let dateString = year + "-";
			dateString = dateString + (month < 10? "0" : "") + month + "-";
			dateString = dateString + (day < 10? "0" : "") + day;

			installment.installmentDate = dateString;
			newSchedule.push(installment);	
		}
		this.setInputValue("installmentSchedule", newSchedule);
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
	}

	GetSortOrder(prop) 
	{    
		return	function(a, b) 
				{
					if (a[prop] > b[prop]) 
					{
						return -1;    
					} 
					else if (a[prop] < b[prop]) 
					{
						return 1;
					}
					return 0;
				}
	}
		
	saveDropDownDependencies(key, element)
	{
		console.log("saveDropDownDependencies");
		console.log(key);
		console.log(element);
		let dropDownsDependencies = this.state.dropDownsDependencies;
		
		if (dropDownsDependencies[key] === undefined)
			dropDownsDependencies[key] = [];
		dropDownsDependencies[key].push(element);
		this.setInputValue("dropDownsDependencies", dropDownsDependencies);
		console.log("this.state.dropDownsDependencies");
		console.log(this.state.dropDownsDependencies);
	}
	
	saveDropDownValues(key, value)
	{
		console.log("saveDropDownValues");
		console.log(key);
		console.log(value);
		let currentDropDownValues = this.state.dropDownValues;
		currentDropDownValues[key] = value;
		this.setInputValue("dropDownValues", currentDropDownValues);
		console.log("this.state.dropDownValues");
		console.log(this.state.dropDownValues);
		
		let depList = this.state.dropDownsDependencies[key];
		for (let i = 0; depList !== undefined && i < depList.length; i++)
		{
			let dd = depList[i];
			dd.resetOptions(value);
		}
	}
	
	saveAttemptProfileComponentAuth2(step, context, key, value, stepIndex)
	{
		let theSteps	= this.state.steps;
		let theStep		= theSteps[stepIndex];
		let theFields	= theStep.property1;
		let theField	=	{	"code"			: "",
								"context"		: "",
								"displayName"	: "",
								"key"			: "",
								"originalValue"	: "",
								"type"			: "",
								"value"			: ""
							}
		;		
		let theFieldIndex	= -1;
		
		for (let i = 0; i < theFields.length; i++)
		{
			let currentField = theFields[i];

			if (currentField.context === context && currentField.code === key)
			{
				theField = currentField;
				theFieldIndex = i;
				theField.value = value;
				break;
			}
		}
		
		theFields[theFieldIndex] = theField;
		theStep.property1 = theFields;
		theSteps[stepIndex] = theStep;
		this.setInputValue("steps", theSteps);
	}
	
	activateStep(newActiveState)
	{
		let steps = this.state.steps;
		let activeStep = this.state.activeStep;
		
		activeStep = newActiveState;

		for (let i = 0; i < steps.length; i++)
		{	
			steps[i].activeClass = "stepClassInactive";
			steps[i].stepDisplayStyle = this.state.stepDisplayStyleInactive;
		}
		steps[activeStep].activeClass = "stepClassActive";
		steps[activeStep].stepDisplayStyle = this.state.stepDisplayStyleActive;
		
		this.setInputValue("activeStep", activeStep);
		this.setInputValue("steps", steps);
	}
	
	stepChange(change)
	{
		let steps = this.state.steps;
		let activeStep = this.state.activeStep;
		
		activeStep = activeStep + change;

		for (let i = 0; i < steps.length; i++)
		{	
			steps[i].activeClass = "stepClassInactive";
			steps[i].stepDisplayStyle = this.state.stepDisplayStyleInactive;
		}
		steps[activeStep].activeClass = "stepClassActive";
		steps[activeStep].stepDisplayStyle = this.state.stepDisplayStyleActive;
		
		this.setInputValue("activeStep", activeStep);
		this.setInputValue("steps", steps);
	}

	setInputValue(property, val) 
	{
		this.setState({[property]: val});
	}

	setFieldValue(property, val) 
	{
		let fields = this.state.fields;
		for (let i = 0; i < fields.length; i++)
		{
			const field = fields[i];
			if (field.code === property)
			{
				console.log("====property====");
				console.log(property);
				fields[i].value = val;
				fields[i].key= field.code;
				break;
			}
		}
		this.setInputValue("fields", fields);
	}

	resetForm() 
	{
	}

	async componentDidMount()
	{
		let meta = this.state.meta;
		const gwUrlMO = process.env.REACT_APP_ONBOARD_API_GW_HOST;
//		const gwUrlMS = process.env.REACT_APP_SERVICE_API_GW_HOST;
		
		if (this.state.attemptIdScheme !== undefined && this.state.attemptIdScheme !== "")
		{
			let attemptDetailRequest = {"attemptId": this.state.attemptIdScheme};
			let attemptUserDetailsResponse = await fetch	(	gwUrlMO + "onboarding-service/endpoint/attempt/detail", 
																{
																 "method"	: "POST",
																 "headers"	:	{	"Content-Type"	: "application/json",
																					"token"			: "Bearer NO TOKEN"
																				},
																 "body"		: JSON.stringify(attemptDetailRequest)
									 							}
									 						)
			;
			let attemptUserDetailsJson = await attemptUserDetailsResponse.json();
			
			let foundId		= false;
			let foundName	= false;
			let foundPhone	= false;
			let valueId		= "";
			let valueName	= "";
			let valuePhone	= "";
			let proertyList = attemptUserDetailsJson.result.extendedPropertyList.propertyList;
			
			for(let i = 0; proertyList !== undefined && proertyList != null && i < proertyList.length && (!foundId || !foundName || !foundPhone); i++)
			{
				if (proertyList[i].propertyCode === "USERID")
				{
					foundId = true;
					valueId = proertyList[i].propertyValue;
				}
				else if (proertyList[i].propertyCode === "NAME")
				{
					foundName = true;
					valueName = proertyList[i].propertyValue;
				}
				else if (proertyList[i].propertyCode === "PHONE_NUMBER")
				{
					foundPhone = true;
					valuePhone = proertyList[i].propertyValue;
				}
			}
			
			this.setInputValue("customerPhoneNumber", valuePhone);
			this.setInputValue("customerName"		, valueName	);
			this.setInputValue("customerId"			, valueId	);
		}
		if (this.state.propCustomerId !== undefined && this.state.propCustomerId !== "")
		{
			let attemptUserDetailsResponse = await fetch	(	gwUrlMO + "authorization-service/endpoint/user/" + this.state.propCustomerId, 
																{
																 "method"	: "GET",
																 "headers"	:	{	"Content-Type"	: "application/json",
																					"token"			: "Bearer NO TOKEN"
																				}
									 							}
									 						)
			;
			let userDetailsJson	= await attemptUserDetailsResponse.json()	;
			
			let customerName			= userDetailsJson.result.response[0].name				;
			let customerPhoneNumber 	= userDetailsJson.result.response[0].phoneNumber		;
			
			this.setInputValue("customerPhoneNumber", customerPhoneNumber		);
			this.setInputValue("customerName"		, customerName				);
			this.setInputValue("customerId"			, this.state.propCustomerId	);
		}
		if ((this.state.attemptIdScheme === undefined || this.state.attemptIdScheme === "") && (this.state.propCustomerId === undefined || this.state.propCustomerId === ""))
		{
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
			this.setInputValue("meta", meta);
	
			let customerDropDownList = [];
			for (let i = 0; customerList !== undefined && customerList != null && i < customerList.length; i++)
				customerDropDownList.push({"value": customerList[i].userId, "label": customerList[i].name});
			this.setInputValue("customerDropDownList", customerDropDownList);

			console.log("========GATHER LIST: START========");
			console.log(this.state.customerList);
			console.log(customerListJson.result.data);
			console.log("========GATHER LIST: END========");		
		}
		else
		{
			console.log("========GATHER DATA: START========");
			console.log(this.state.customerId);
			console.log(this.state.customerName);
			console.log(this.state.customerPhoneNumber);
			console.log("========GATHER DATA: END========");		
		}
	}

    newScheme() {
        this.props.history.push({ "pathname": "/new-scheme", "state": {"attemptIdScheme": this.state.attemptIdScheme}});
    }

	async saveScheme()
	{
		const gwUrlMS = process.env.REACT_APP_SERVICE_API_GW_HOST;
		
		this.setInputValue("resultPresent"			, true	);
		this.setInputValue("resultPresentProcessing", true	);
		this.setInputValue("resultPresentFailure"	, false	);
		this.setInputValue("resultPresentSuccess"	, false	);

		try
		{
			let newSchemeJSON = {
									"installmentDate"	: this.state.installmentYYYYMMDD,
									"installmentDuration"	: this.state.installmentDuration,
									"installmentAmount"		: this.state.installmentAmount	,
									"installmentCount"		: this.state.installmentCount	,
									"schemeDetails"	: this.state.installmentDetails	,
									"installmentSchedule"	: this.state.installmentSchedule,
									
									"customerId"			: this.state.customerId	,
									"creatorId"				: AuthUtil.getUserId()
								}
			;
			
			let saveResponse = await fetch	(	gwUrlMS + "maxisservice-service/endpoint/scheme/add", 
													{
													 "method"	: "POST",
													 "headers"	:	{	"Content-Type"	: "application/json",
												                        "token": "Bearer " + AuthUtil.getIdToken(),
												                        "userid": AuthUtil.getUserId()
																	}
													 ,
													 "body"		: JSON.stringify(newSchemeJSON)
						 							}
						 						)
			;
		
			let responseJSON = await saveResponse.json();
	
			this.setInputValue("resultPresentProcessing", false	);

			if (responseJSON.result !== undefined || responseJSON.id !== undefined)
			{
				this.setInputValue("resultPresentSuccess"	, true	);
			}
			else
			{
				this.setInputValue("resultPresentFailure"	, true	);
			}
		}
		catch(e)
		{
			this.setInputValue("resultPresentFailure"	, true	);
		}
	}

	getComponentDesign() 
	{
		let customerListFieldComponent ={
											"source": "CUSTOMER_LIST",
											"code"	: "CUSTOMER_LIST"
										}
		;
		console.log("META");
		console.log(this.state.meta);
		let design = 
					<div className="card-form-body">
						<div width="100%" style={{"textAlign": "center"}}>
							<h3><b>Issue New Installament</b></h3>
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
									{
										(	(this.state.attemptIdScheme === undefined || this.state.attemptIdScheme === "") && 
											(this.state.propCustomerId === undefined || this.state.propCustomerId === "") && 
											(this.state.customerDropDownList !== undefined && this.state.customerDropDownList != null && this.state.customerDropDownList.length > 0)
										)
										?
											<tr className="width100">
												<td className="width25">
													<label className="form-input-label2">Customers</label>
												</td>
												<td className="width75">
													<div className="d-flex">
				 										<SearchableDropdownComponentScheme
															filter		= {false}
															context		= {this}	
															placeholder		= "Select customer"
															rootComponent	= {this}
															fieldComponent	= {customerListFieldComponent}
															readOnly={false}
															list	={this.state.customerDropDownList}
														/> 
													</div>
												</td>
											</tr>
										:
										null
									}
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Customer Id</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Customer Id"
													id="customerId"
													value={this.state.customerId === undefined?"":this.state.customerId}
													onChange={(val) => this.setInputValue("customerId", val)}
													readOnly={true}
													filter={false}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Customer Name</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Customer Name"
													id="customerName"
													value={this.state.customerName === undefined?"":this.state.customerName}
													onChange={(val) => this.setInputValue("customerName", val)}
													readOnly={true}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Customer Phone</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Customer Phone"
													id="customerPhoneNumber"
													value={this.state.customerPhoneNumber === undefined?"":this.state.customerPhoneNumber}
													onChange={(val) => this.setInputValue("customerPhone", val)}
													readOnly={true}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Installment Period</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Installment Period"
													id="installmentDuration"
													value={this.state.installmentDuration === undefined?"":this.state.installmentDuration}
													onChange={(val) => this.setInputValue("installmentDuration", val)}
													readOnly={true}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											&nbsp;
										</td>
										<td className="width75">
											&nbsp;
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Installment Details</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Installment Details"
													id="installmentDetails"
													onChange={(val) => this.setInputValue("installmentDetails", val)}
													readOnly={false}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Installment Amount</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Installment Amount"
													id="installmentAmount"
													onChange={(val) => this.setInputValue("installmentAmount", val)}
													readOnly={false}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">Installment Count</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<InputFieldComponentv2
													className="form-input"
													type="text"
													placeholder="Installment Count"
													id="installmentCount"
													value={this.state.installmentCount === undefined?"":this.state.installmentCount}
													onChange={(val) => this.resetInstalleSchedule("installmentCount", val)}
													readOnly={false}
												/> 
											</div>
										</td>
									</tr>
									<tr className="width100">
										<td className="width25">
											<label className="form-input-label2">First Installment Date</label>
										</td>
										<td className="width75">
											<div className="d-flex">
		 										<DateTimeComponentScheme
													value			= {this.state.installmentYYYYMMDD}
													rootComponent	= {this}
													readOnly		={false}
												/> 
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						
						{
							this.state.installmentSchedule !== undefined && this.state.installmentSchedule.length > 0 &&
							<div style={{"textAlign":"center"}}>
				                <hr />
								<h3><b>Schedule</b></h3>
								<br/>
								<table className="width100">
									<tbody className="width100"> 
										<tr key="scheduleTableHeader">
											<th>#</th>
											<th>Date</th>
										</tr>
									{
										this.state.installmentSchedule.map	(	(item) => 
																				(
																					<tr key={item.installmentSerial}>
																						<td style={{"textAlign":"center"}}>{item.installmentSerial}	</td>
																						<td style={{"textAlign":"center"}}>{item.installmentDate}		</td>
																					</tr>
																				)
																			)
									}
									</tbody>
								</table>
							</div>
						}


		                <hr />
						{	this.state.resultPresentSuccess? null:
		                        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
		                            <div className="p-mb-2 p-mr-2">
										<Button label="New Scheme" onClick={() => { this.saveScheme(); }} className="p-button-raised p-button-secondary" />
									</div>
		                        </div>
						}
					</div>
		;
		return design;
	}

	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}
}
export default withRouter(NewScheme);
