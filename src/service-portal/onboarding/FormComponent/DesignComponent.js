import React from "react";

import ButtonComponent2				from "./ButtonComponent2"			;
import InputFieldComponentv2		from "./InputFieldComponentv2"		;
import SearchableDropdownComponentDesign	from "./SearchableDropdownComponentDesign";
import "../../App.css";

class DesignComponent extends React.Component 
{
	constructor(props) 
	{
		super(props);

		let fieldComponent	= this.props.fieldComponent		;
		let contextComponent= this.props.contextComponent	;
		let rootComponent	= this.props.rootComponent		;
		let readOnly		= this.props.readOnly			;
		let fieldvalueString= fieldComponent.value			;
		let fieldvalueJSON	= [];
		let BUSINESS_AREA_TYPE =	[
										{"label": "Haat"		, "value": "BUSINESS_AREA_TYPE_HAAT"		},
										{"label": "Bazar"		, "value": "BUSINESS_AREA_TYPE_BAZAR"		},
										{"label": "Market"		, "value": "BUSINESS_AREA_TYPE_MARKET"		},
										{"label": "Standalone"	, "value": "BUSINESS_AREA_TYPE_STANDALONE"	}
									]
		;
		meta["BUSINESS_AREA_TYPE"] = BUSINESS_AREA_TYPE;

		this.banks =	[
							{"label": "AB Bank Limited", "value": "AB Bank Limited"},
							{"label": "Agrani Bank Limited", "value": "Agrani Bank Limited"},
							{"label": "Al-Arafah Islami Bank Limited", "value": "Al-Arafah Islami Bank Limited"},
							{"label": "Bangladesh Commerce Bank Limited", "value": "Bangladesh Commerce Bank Limited"},
							{"label": "Bangladesh Development Bank Limited", "value": "Bangladesh Development Bank Limited"},
							{"label": "Bangladesh Krishi Bank", "value": "Bangladesh Krishi Bank"},
							{"label": "Bank Al-Falah Limited", "value": "Bank Al-Falah Limited"},
							{"label": "Bank Asia Limited", "value": "Bank Asia Limited"},
							{"label": "BASIC Bank Limited", "value": "BASIC Bank Limited"},
							{"label": "Bengal Commercial Bank Limited", "value": "Bengal Commercial Bank Limited"},
							{"label": "BRAC Bank Limited", "value": "BRAC Bank Limited"},
							{"label": "Citibank N.A", "value": "Citibank N.A"},
							{"label": "Citizens Bank PLC", "value": "Citizens Bank PLC"},
							{"label": "Commercial Bank of Ceylon Limited", "value": "Commercial Bank of Ceylon Limited"},
							{"label": "Community Bank Bangladesh Limited", "value": "Community Bank Bangladesh Limited"},
							{"label": "Dhaka Bank Limited", "value": "Dhaka Bank Limited"},
							{"label": "Dutch-Bangla Bank Limited", "value": "Dutch-Bangla Bank Limited"},
							{"label": "Eastern Bank Limited", "value": "Eastern Bank Limited"},
							{"label": "EXIM Bank Limited", "value": "EXIM Bank Limited"},
							{"label": "First Security Islami Bank Limited", "value": "First Security Islami Bank Limited"},
							{"label": "Global Islami Bank Limited", "value": "Global Islami Bank Limited"},
							{"label": "Habib Bank Ltd.", "value": "Habib Bank Ltd."},
							{"label": "ICB Islamic Bank Ltd.", "value": "ICB Islamic Bank Ltd."},
							{"label": "IFIC Bank Limited", "value": "IFIC Bank Limited"},
							{"label": "Islami Bank Bangladesh Ltd", "value": "Islami Bank Bangladesh Ltd"},
							{"label": "Jamuna Bank Ltd", "value": "Jamuna Bank Ltd"},
							{"label": "Janata Bank Limited", "value": "Janata Bank Limited"},
							{"label": "Meghna Bank Limited", "value": "Meghna Bank Limited"},
							{"label": "Mercantile Bank Limited", "value": "Mercantile Bank Limited"},
							{"label": "Midland Bank Limited", "value": "Midland Bank Limited"},
							{"label": "Modhumoti Bank Limited", "value": "Modhumoti Bank Limited"},
							{"label": "Mutual Trust Bank Limited", "value": "Mutual Trust Bank Limited"},
							{"label": "National Bank Limited", "value": "National Bank Limited"},
							{"label": "National Bank of Pakistan", "value": "National Bank of Pakistan"},
							{"label": "National Credit & Commerce Bank Ltd", "value": "National Credit & Commerce Bank Ltd"},
							{"label": "NRB Bank Limited", "value": "NRB Bank Limited"},
							{"label": "NRB Commercial Bank Limited", "value": "NRB Commercial Bank Limited"},
							{"label": "One Bank Limited", "value": "One Bank Limited"},
							{"label": "Padma Bank Limited", "value": "Padma Bank Limited"},
							{"label": "Premier Bank Limited", "value": "Premier Bank Limited"},
							{"label": "Prime Bank Ltd", "value": "Prime Bank Ltd"},
							{"label": "Probashi Kollyan Bank", "value": "Probashi Kollyan Bank"},
							{"label": "Pubali Bank Limited", "value": "Pubali Bank Limited"},
							{"label": "Rajshahi Krishi Unnayan Bank", "value": "Rajshahi Krishi Unnayan Bank"},
							{"label": "Rupali Bank Limited", "value": "Rupali Bank Limited"},
							{"label": "Shahjalal Islami Bank Limited", "value": "Shahjalal Islami Bank Limited"},
							{"label": "Shimanto Bank Limited", "value": "Shimanto Bank Limited"},
							{"label": "Social Islami Bank Ltd.", "value": "Social Islami Bank Ltd."},
							{"label": "Sonali Bank Limited", "value": "Sonali Bank Limited"},
							{"label": "South Bangla Agriculture & Commerce Bank Limited", "value": "South Bangla Agriculture & Commerce Bank Limited"},
							{"label": "Southeast Bank Limited", "value": "Southeast Bank Limited"},
							{"label": "Standard Bank Limited", "value": "Standard Bank Limited"},
							{"label": "Standard Chartered Bank", "value": "Standard Chartered Bank"},
							{"label": "State Bank of India", "value": "State Bank of India"},
							{"label": "The City Bank Ltd.", "value": "The City Bank Ltd."},
							{"label": "The Hong Kong and Shanghai Banking Corporation. Ltd.", "value": "The Hong Kong and Shanghai Banking Corporation. Ltd."},
							{"label": "Trust Bank Limited", "value": "Trust Bank Limited"},
							{"label": "Union Bank Limited", "value": "Union Bank Limited"},
							{"label": "United Commercial Bank Limited", "value": "United Commercial Bank Limited"},
							{"label": "Uttara Bank Limited", "value": "Uttara Bank Limited"},
							{"label": "Woori Bank", "value": "Woori Bank"}
						]
 		;
	
		this.logisticDemography =	[	{"label": "Dhaka Metro City", "value": "Dhaka Metro City"},
										{"label": "Sub-area", "value": "Sub-area"},
										{"label": "Nation wide", "value": "Nation wide"}
									] 
		;
		try
		{
			fieldvalueJSON = JSON.parse(fieldvalueString);
		}
		catch(e)
		{
			
		}

		this.state =	{	"fieldComponent"	: fieldComponent	,
							"readOnly"			: readOnly			,
							"contextComponent"	: contextComponent	,
							"rootComponent"		: rootComponent		,
							"fieldvalueString"	: fieldvalueString	,
							"fieldvalueJSON"	: fieldvalueJSON	,
							"myString"			: "start"			,
							"fields"			: []				,
							"meta"				: {"PARTNER_BANK": this.banks, "LOGISTIC_DEMOGRAPHY": this.logisticDemography},
							"dropDownValues"	: []				,
							"subscriptions"		: []				,
							"designId"			: fieldComponent.source
						}
		;

		this.onClick	= this.onClick.bind(this)	;
		this.deleteRow	= this.deleteRow.bind(this)	;
		this.handleItem	= this.handleItem.bind(this);
		this.updateMeta	= this.updateMeta.bind(this);
		
		this.populateRow	= this.populateRow.bind(this)	;
		this.setFieldValue	= this.setFieldValue.bind(this)	;
		this.setInputValue	= this.setInputValue.bind(this)	;
		this.subscribe	= this.subscribe.bind(this)	;

		this.setDropDownFieldValue		= this.setDropDownFieldValue.bind(this)		;
		this.saveDropDownDependencies	= this.saveDropDownDependencies.bind(this)	;
	}

	subscribe(subscriber, subscriberode, subscribeTo)
	{
		let subscription = {"subscriber": subscriber, "subscriberode": subscriberode, "subscribeTo": subscribeTo};
		let subscriptions = this.state.subscriptions;
		subscriptions.push(subscription);
		this.setInputValue("subscriptions", subscriptions);
	}

	updateMeta(meta)
	{
		console.log("meta updated");
	}

	saveDropDownDependencies(property, val) 
	{
		this.setState({[property]: val});
	}

	setInputValue(property, val) 
	{
		this.setState({[property]: val});
	}

	populateRow(row, index)
	{
		return	<tr key={index}>
					{	this.state.fields.map((field) => {
							return <td key={field.code}>{row[field.code]}</td>
						})
					}
					{	!this.state.readOnly &&
						<td><button type="button" style={{backgroundColor: "#990000", border: "solid", color: "#ffffff", textAlign: "center"}} onClick={() => this.deleteRow(index)}>
							Delete
							</button>
						</td>
					}
				</tr>
		;
	}

	onClick(code)
	{
		let fields = this.state.fields;
		
		let row = {};
		for(let i = 0; i < fields.length; i++)
		{
			row[fields[i].code] = fields[i].displayValue?fields[i].displayValue:fields[i].value;
		}
		let fieldvalueJSON	= this.state.fieldvalueJSON;
		fieldvalueJSON.push(row);
		this.state.contextComponent.setInputValue(this.state.fieldComponent.code, JSON.stringify(fieldvalueJSON));
	}

	deleteRow(index)
	{
		let fieldvalueJSON = this.state.fieldvalueJSON;
		let newfieldvalueJSON = [];
		
		for(let i = 0; i < fieldvalueJSON.length; i++)
		{
			if (i !== index)
				newfieldvalueJSON.push(fieldvalueJSON[i]);
		}
		this.setInputValue("fieldvalueJSON", newfieldvalueJSON);
		this.state.contextComponent.setInputValue(this.state.fieldComponent.code, JSON.stringify(newfieldvalueJSON));
	}

	setDropDownFieldValue(code, val, label)
	{
		this.setFieldValue(code, val, label);
		
		if (code === "BUSINESS_AREA_DISTRICT")
		{
			console.log("IN setDropDownFieldValue: BUSINESS_AREA_DISTRICT");
			let districts = this.state.meta.DISTRICT;
			let subscriptions = this.state.subscriptions;
			let districtId = "";
			for(let i = 0; i < districts.length; i++)
			{
				let district = districts[i];
				if (district.value === val)
				{
					districtId = district.value;
				}
			}

			for (let i = 0; i < subscriptions.length; i++)
			{
				let subscription = subscriptions[i];
				subscription.subscriber.resetOptions("districtId", districtId);
			}
		}
	}

	setFieldValue(code, val, label)
	{
		let fields = this.state.fields;
		for(let i = 0; i < fields.length; i++)
		{
			if (fields[i].code === code)
			{
				fields[i].value = val;
				
				if (label !== undefined)
				{
					fields[i].displayValue = label;
				}
				else
				{
					fields[i].displayValue = val;
				}
			}
		}
		
		this.setInputValue("fields", fields);
	}

	handleItem(field) 
	{
		let returnValue =	"";
		
		if (field.type === "STRING")
		{
			returnValue =	<div className="row" key={field.code}>
								<div className="col-sm-4">
									<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
								</div>
								<div className="col-sm-8">
									<div className="d-flex">
 										<InputFieldComponentv2
											className="form-input"
											type="text"
											placeholder={field.displayName}
											id={field.code}
											value={field.value}
											onChange={(val) => this.setFieldValue(field.code, val)}
											rootComponent = {this.state.rootComponent}
											fieldComponent= {field}
											readOnly={this.state.readOnly}
										/> 
									</div>
								</div>
							</div>
			;
		}
		else if (field.type === "DROPDOWN_STRING")
		{
			returnValue =	<div className="row" key={field.code}>
								<div className="col-sm-4">
									<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
								</div>
								<div className="col-sm-8">
									<div className="d-flex">
										<SearchableDropdownComponentDesign
											filter		= {false}
											value		= {field.value}
											context		= {this}	
											onChange	= {(val) => this.setDropDownFieldValue(field.code, val)}
											placeholder		= {field.displayName}
											rootComponent	= {this}
											fieldComponent	= {field}
											readOnly={this.state.readOnly}
										/> 
									</div>
								</div>
								<br/>
								<div className="col-sm-4">
									&nbsp;
								</div>
								<div className="col-sm-8">
									<div className="d-flex">
 										<InputFieldComponentv2
											className="form-input"
											type="text"
											placeholder={"If other " + field.displayName}
											id={field.code}
											onChange={(val) => this.setFieldValue(field.code, val)}
											rootComponent = {this.state.rootComponent}
											fieldComponent= {field}
											readOnly={this.state.readOnly}
										/> 
									</div>
								</div>
							</div>
			;
		}
		else if (field.type === "DROPDOWN")
		{
			returnValue =	
							<div className="row" key={field.code}>
								<div className="col-sm-4">
									<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
								</div>
								<div className="col-sm-8">
									<div className="d-flex">
										<SearchableDropdownComponentDesign
											filter		= {false}
											value		= {field.value}
											context		= {this}	
											onChange	= {(val) => this.setDropDownFieldValue(field.code, val)}
											placeholder		= {field.displayName}
											rootComponent	= {this}
											fieldComponent	= {field}
											readOnly		= {this.state.readOnly}
										/> 
									</div>
								</div>
							</div>
			;
		}
		return returnValue;
	}

	async componentDidMount()
	{
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		
		let meta = this.state.meta;

		let DDD =	[	{"label": "Depot"		, "value": "Depot"			},
						{"label": "Distributor"	, "value": "Distributor"	},
						{"label": "Dealer"		, "value": "Dealer"			}
					]
		;		
		meta["DDD"] = DDD;

		let yearArray = [];
		for(let year = 1971; year <= (new Date().getFullYear()); year++)
		{
			let yearJSON = {"value": year + "", "label": year + ""};
			yearArray.push(yearJSON);
		}
		meta["YEAR"] = yearArray;
		meta["PASSING_YEAR"] = yearArray;
		this.setInputValue("meta", meta);
		
		let designResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/design/detail-only", 
												{
												 "method"	: "POST",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
												 ,
												 "body"		: JSON.stringify({"designId": this.state.designId})
					 							}
					 						)
		;
		let designDetails = await designResponse.json();
		this.setInputValue("fields", designDetails.result.designModel.steps[0].property1);
		this.setInputValue("myString", JSON.stringify(designDetails.result.designModel.steps[0].property1));

		let districtResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/api/district", 
												{
												 "method"	: "GET",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
					 							}
					 						)
		;
		let districtDropDownList = [];
		let districtJson = await districtResponse.json();
		for (let i = 0; i < districtJson.districts.length; i++)
			districtDropDownList.push({"value": districtJson.districts[i].id, "label": districtJson.districts[i].displayName});
		meta["DISTRICT"] = districtDropDownList;
		
		meta["BUSINESS_AREA_DISTRICT"] = meta["DISTRICT"];
		
		
		meta["CORPORATE_COMPANY"] = [{"label":"a", "value":"s"}, {"label":"d", "value":"f"}];
		
		this.setInputValue("meta", meta);
	}
	
	getComponentDesign() 
	{
		let componentDesign =	<div className="row" style={{borderStyle: "solid"}}>
									<div className="col-sm-12">
										<div className="row" >
											<div className="col-sm-12">
												{	this.state.fields.map((field) => {
														return this.handleItem(field);
													})
												}
											</div>
										</div>
										{	this.state.readOnly? 
											<div className="row">
												<div className="col-sm-12"></div>
											</div>
											:
											<div className="row">
												<div className="col-sm-4">
													<ButtonComponent2
														text="Add"
														code="ADD"
														item={this}
														itemClick={true}
													/> 
												</div>
												<div className="col-sm-8"></div>
											</div>
										}
										<hr/>
										<div className="row" >
											<div className="col-sm-12">
												<table className="width100">
													<tbody className="width100">
														<tr className="width100">
															{	this.state.fields.map((field) => {
																	return <th key={field.code} style={{padding:"2px 2px 2px 2px"}}>{field.displayName}</th>
																})
															}
														</tr>
														{
															this.state.fieldvalueJSON.length === 0 && 
															<tr>
																{	this.state.fields.map((field) => {
																		return <td key={field.code}>&nbsp;</td>
																	})
																}
															</tr>
														}
														{
															this.state.fieldvalueJSON.length !== 0 && 
																this.state.fieldvalueJSON.map((row, index)=>{
																	return this.populateRow(row, index);
																})
														}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
		;

		return componentDesign;
	}

	render() 
	{
		let componentDesign = this.getComponentDesign()
		return componentDesign;
	}
}

export default DesignComponent;
