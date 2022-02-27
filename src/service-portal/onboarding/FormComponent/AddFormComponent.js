import React from 'react';
import { withRouter } from 'react-router-dom';
import MainComponent from '../../../common/MainComponent';
import StepComponentInformation from './StepComponentInformation';
import AuthUtil from "../../../auth/AuthUtil";
import '../../../App.css';
import { Button } from 'primereact/button';

class AddFormComponent extends React.Component {
	constructor(props) 
	{
		super(props);
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
		
		this.state =	{	"profileId"		: data.profileId, 
							"fields"		: []			, 
							"designName"	: "Form"		, 
							"fieldvalues"	: []			, 
							"attemptId"		: data.attemptId, 
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
							"attemptIdScheme"			: "", 
							"dropDownsDependencies"		: [],
							"dropDownValues"			: []
						}
		;

		this.saveAttemptProfileComponentAuth2 = this.saveAttemptProfileComponentAuth2.bind(this);
		this.saveDropDownDependencies = this.saveDropDownDependencies.bind(this);
		this.saveDropDownValues = this.saveDropDownValues.bind(this);
		this.activateStep = this.activateStep.bind(this);
		this.setInputValue = this.setInputValue.bind(this);
		this.setFieldValue = this.setFieldValue.bind(this);
		this.saveProfile = this.saveProfile.bind(this);
		this.stepChange = this.stepChange.bind(this);
		this.newScheme = this.newScheme.bind(this);
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
		const gwUrl = process.env.REACT_APP_ONBOARD_API_GW_HOST;
		let meta = this.state.meta;
		
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
		districtDropDownList.sort(this.GetSortOrder("label"));
		meta["DISTRICT"] = districtDropDownList;
		
		let thanaResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/api/thana-all", 
												{
												 "method"	: "GET",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
					 							}
					 						)
		;
		let thanaDropDownList = [];
		let thanaJson = await thanaResponse.json();
		for (let i = 0; i < thanaJson.thanas.length; i++)
			thanaDropDownList.push({"value": thanaJson.thanas[i].id, "label": thanaJson.thanas[i].displayName, "districtId": thanaJson.thanas[i].districtId});
		thanaDropDownList.sort(this.GetSortOrder("label"));
		meta["THANA"] = thanaDropDownList;

		let regionResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/api/region-all", 
												{
												 "method"	: "GET",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
					 							}
					 						)
		;
		let regionDropDownList = [];
		let regionJson = await regionResponse.json();
		for (let i = 0; i < regionJson.regions.length; i++)
			regionDropDownList.push({"value": regionJson.regions[i].id, "label": regionJson.regions[i].displayName});
		meta["REGION"] = regionDropDownList;

		let areaResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/api/area-all", 
												{
												 "method"	: "GET",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
					 							}
					 						)
		;
		let areaDropDownList = [];
		let areaJson = await areaResponse.json();
		for (let i = 0; i < areaJson.areas.length; i++)
			areaDropDownList.push({"value": areaJson.areas[i].id, "label": areaJson.areas[i].displayName, "regionId": areaJson.areas[i].regionId});
		meta["AREA"] = areaDropDownList;

		let territoryResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/api/territory-all", 
												{
												 "method"	: "GET",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
					 							}
					 						)
		;
		let territoryDropDownList = [];
		let territoryJson = await territoryResponse.json();
		for (let i = 0; i < territoryJson.territorys.length; i++)
			territoryDropDownList.push({"value": territoryJson.territorys[i].id, "label": territoryJson.territorys[i].displayName, "areaId": territoryJson.territorys[i].areaId});
		meta["TERRITORY"] = territoryDropDownList;

		let BUSINESS_CATEGORY =	[	{"label": "Fleet"	, "value": "FLEET"		},
									{"label": "Food"	, "value": "FOOD"		},
									{"label": "Logistic", "value": "LOGISTIC"	},
									{"label": "Shipping", "value": "SHIPPING"	}
								]
		;
		meta["BUSINESS_CATEGORY"] = BUSINESS_CATEGORY;

		let MFS =	[	{"label": "MyCash"	, "value": "MyCash"		}
					]
		;
		meta["MFS"] = MFS;
		meta["CURRENCY"] = MFS;
		let CURRENCY_TYPE =	[	{"label": "MFS"	, "value": "MFS"		}
					]
		;
		meta["CURRENCY_TYPE"] = CURRENCY_TYPE;

		let VEHICLE_TYPE =	[	{"label": "Mechanical"	, "value": "MECHANICLE"	},
								{"label": "Non-Mechanical"	, "value": "NONMECHANICLE"	}
							]
		;
		meta["VEHICLE_TYPE"] = VEHICLE_TYPE;

		let YESNO =	[	{"label": "yes"	, "value": "YES"},
						{"label": "No"	, "value": "NO"	}
					]
		;
		meta["YESNO"] = YESNO;

		let HANA =	[	{"label": "হ্যাঁ"	, "value": "YES"},
						{"label": "না"	, "value": "NO"	}
					]
		;
		meta["HANA"] = HANA;

		let MANUAL_EXCEL_SOFTWARE =	[	{"label": "খাতা"	, "value": "MANUAL"}, 
										{"label": "সফটওয়্যার (নিজস্ব)"	, "value": "SOFTWARE (OWN)"},
										{"label": "সফটওয়্যার (অন্য)"	, "value": "SOFTWARE (EXTERNAL)"},
										{"label": "এক্সেল"	, "value": "EXCEL"	}
									]
		;
		meta["MANUAL_EXCEL_SOFTWARE"] = MANUAL_EXCEL_SOFTWARE;

		let YESNOINTEGRATION =	[	{"label": "Integrate"	, "value": "pending"},
									{"label": "No"			, "value": ""		}
								]
		;
		meta["YESNOINTEGRATION"] = YESNOINTEGRATION;

		let VEHICLE =	[	{"label": "Bi-Cycle"			, "value": "BICYCLE"			},
							{"label": "Rickshaw Van"		, "value": "RICKSHAWVAN"		},
							{"label": "Rickshaw Covered Van", "value": "RICKSHAWCOVEREDVAN"	},
							{"label": "Motor cycle"			, "value": "MOTORCYCLE"			},
							{"label": "Van"					, "value": "VAN"				},
							{"label": "Truck"				, "value": "TRUCK"				}
						]
		;
		meta["VEHICLE"] = VEHICLE;

		let BUSINESS_AREA_TYPE =	[
										{"label": "Haat"		, "value": "BUSINESS_AREA_TYPE_HAAT"		},
										{"label": "Bazar"		, "value": "BUSINESS_AREA_TYPE_BAZAR"		},
										{"label": "Market"		, "value": "BUSINESS_AREA_TYPE_MARKET"		},
										{"label": "Standalone"	, "value": "BUSINESS_AREA_TYPE_STANDALONE"	}
									]
		;
		meta["BUSINESS_AREA_TYPE"] = BUSINESS_AREA_TYPE;

		let UNIT_LENGTH =	[	{"label": "Meter"	, "value": "METER"	},
								{"label": "Foot"	, "value": "FOOT"	}
							]
		;
		meta["UNIT_LENGTH"] = UNIT_LENGTH;

		let UNIT_MASS =	[	{"label": "Kilo-gram"	, "value": "KILOGRAM"	},
							{"label": "Pound"		, "value": "POUND"		}
						]
		;
		meta["UNIT_MASS"] = UNIT_MASS;

		let WAREHOUSE_TYPE =	[	{"label": "Central"	, "value": "CENTRAL"	},
									{"label": "General"	, "value": "GENERAL"	}
								]
		;
		meta["WAREHOUSE_TYPE"] = WAREHOUSE_TYPE;

		console.log("====this.state.roleName====");
		console.log(this.state.roleName);
		if (this.state.roleName === "Maxis-Services-OBE-LM" || this.state.roleName === "Maxis-Services-OBE-MM")
		{
			let un1 = AuthUtil.getUserId();
			let un2 = AuthUtil.getUserId();
			let lpBody =	{	"userId"			: un1			, 
								"accountId"			: un2			, 
								"role"				: "Maxis-Services-MM"	, 
								"onBoardingStatus"	: null								,
								"callerRole"		: this.state.roleName
							}
			;
			let lpResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-by-role", 
													{
														"method"	: "POST",
														"headers"	:	{	"Content-Type"	: "application/json",
																			"token"			: "Bearer NO TOKEN"
																		},
														"body"		: JSON.stringify(lpBody)
						 							}
						 						)
			;
			let lpDropDownList = [];
			let lpJson = await lpResponse.json();
			let lpdata = lpJson.result.response;
			for (let i = 0; i < lpdata.length; i++)
				lpDropDownList.push({"value": lpdata[i].userId, "label": lpdata[i].name});
			meta["M_S_MM"] = lpDropDownList;
		}
		if (this.state.roleName === "Maxis-Services-OBE-LM")
		{
			let lpBody =	{	"userId"			: AuthUtil.getUserId()			, 
								"accountId"			: AuthUtil.getUserId()			, 
								"role"				: "Maxis-Services-LM"	, 
								"onBoardingStatus"	: null								,
								"callerRole"		: this.state.roleName
							}
			;
			let lpResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-by-role", 
													{
														"method"	: "POST",
														"headers"	:	{	"Content-Type"	: "application/json",
																			"token"			: "Bearer NO TOKEN"
																		},
														"body"		: JSON.stringify(lpBody)
						 							}
						 						)
			;
			let lpDropDownList = [];
			let lpJson = await lpResponse.json();
			let lpdata = lpJson.result.response;
			for (let i = 0; i < lpdata.length; i++)
				lpDropDownList.push({"value": lpdata[i].userId, "label": lpdata[i].name});
			meta["M_S_LM"] = lpDropDownList;
		}
		if (this.state.roleName === "Maxis-Services-MM-Administrator")
		{
			let lpBody =	{	"userId"			: AuthUtil.getUserId()			, 
								"accountId"			: AuthUtil.getUserId()			, 
								"role"				: "Maxis-Services-LM"	, 
								"onBoardingStatus"	: null								,
								"callerRole"		: this.state.roleName
							}
			;
			let lpResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
													{
														"method"	: "POST",
														"headers"	:	{	"Content-Type"	: "application/json",
																			"token"			: "Bearer NO TOKEN"
																		},
														"body"		: JSON.stringify(lpBody)
						 							}
						 						)
			;
			let lpDropDownList = [];
			let lpJson = await lpResponse.json();
			let lpdata = lpJson.result.response;
			for (let i = 0; i < lpdata.length; i++)
				lpDropDownList.push({"value": lpdata[i].userId, "label": lpdata[i].name});
			meta["M_S_LM"] = lpDropDownList;
		}
		if (this.state.roleName === "Maxis-Services-MM-Administrator")
		{
			let lpBody =	{	"userId"			: AuthUtil.getUserId()			, 
								"accountId"			: AuthUtil.getUserId()			, 
								"role"				: "Maxis-Services-MM"	, 
								"onBoardingStatus"	: null								,
								"callerRole"		: this.state.roleName
							}
			;
			let lpResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-by-role", 
													{
														"method"	: "POST",
														"headers"	:	{	"Content-Type"	: "application/json",
																			"token"			: "Bearer NO TOKEN"
																		},
														"body"		: JSON.stringify(lpBody)
						 							}
						 						)
			;
			let lpDropDownList = [];
			let lpJson = await lpResponse.json();
			let lpdata = lpJson.result.response;
			for (let i = 0; i < lpdata.length; i++)
				lpDropDownList.push({"value": lpdata[i].userId, "label": lpdata[i].name});
			meta["M_S_MM"] = lpDropDownList;
		}
		if (this.state.roleName === "MAXISELSUPPORT")
		{
			let lpBody =	{	"userId"			: AuthUtil.getUsername(), 
								"accountId"			: AuthUtil.getUsername(), 
								"role"				: "MAXISELLP"			, 
								"onBoardingStatus"	: null					,
								"callerRole"		: this.state.roleName
							}
			;
			let lpResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
													{
														"method"	: "POST",
														"headers"	:	{	"Content-Type"	: "application/json",
																			"token"			: "Bearer NO TOKEN"
																		},
														"body"		: JSON.stringify(lpBody)
						 							}
						 						)
			;
			let lpDropDownList = [];
			let lpJson = await lpResponse.json();
			let lpdata = lpJson.result.response;
			for (let i = 0; i < lpdata.length; i++)
				lpDropDownList.push({"value": lpdata[i].userId, "label": lpdata[i].name});
			meta["M_EL_LP"] = lpDropDownList;
		}
		//Maxis-Business-House-Admin
		//
		if (this.state.roleName === "Maxis-Business-House-Admin" || this.state.roleName === "Maxis-Business-House-Manager" || this.state.roleName === "Maxis-Business-House-Sales-Officer" || this.state.roleName === "Maxis-Business-House-Accountant")
		{
			try
			{
				let eBody =	{	"userId"			: AuthUtil.getUserId(), 
								"accountId"			: AuthUtil.getUserId(), 
								"role"				: "Maxis-Business-House-Sales-Officer"	, 
								"onBoardingStatus"	: null					,
								"callerRole"		: this.state.roleName
							}
				;
				let eResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
												{
													"method"	: "POST",
													"headers"	:	{	"Content-Type"	: "application/json",
																		"token"			: "Bearer NO TOKEN"
																	},
													"body"		: JSON.stringify(eBody)
					 							}
							 				)
				;
				let eDropDownList = [];
				let eJson = await eResponse.json();
				let edata = eJson.result.response;
				for (let i = 0; i < edata.length; i++)
					if ((this.state.roleName !== "Maxis-Business-House-Sales-Officer") || (this.state.roleName === "Maxis-Business-House-Sales-Officer" && edata[i].userId === AuthUtil.getUserId()))
						eDropDownList.push({"value": edata[i].userId, "label": edata[i].name});
				meta["M_CM_BH_SO"] = eDropDownList;
			}
			catch(e)
			{
			}
		}

		if (this.state.roleName === "MAXISELLPADMIN" || this.state.roleName === "MAXISELLPENTERPRISEADMIN")
		{
			let eBody =	{	"userId"			: AuthUtil.getUsername(), 
							"accountId"			: AuthUtil.getUsername(), 
							"role"				: "MAXISELLPENTERPRISE"	, 
							"onBoardingStatus"	: null					,
							"callerRole"		: this.state.roleName
						}
			;
			let eResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
											{
												"method"	: "POST",
												"headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																},
												"body"		: JSON.stringify(eBody)
				 							}
						 				)
			;
			let eDropDownList = [];
			let eJson = await eResponse.json();
			let edata = eJson.result.response;
			for (let i = 0; i < edata.length; i++)
				eDropDownList.push({"value": edata[i].userId, "label": edata[i].name});
			meta["M_EL_LP_E"] = eDropDownList;
		}

		if (this.state.roleName === "MAXISELLPADMIN" || this.state.roleName === "MAXISELLPENTERPRISEADMIN")
		{
			let eBody =	{	"userId"			: AuthUtil.getUsername(), 
							"accountId"			: AuthUtil.getUsername(), 
							"role"				: "MAXISELLPENTERPRISE"	, 
							"onBoardingStatus"	: null					,
							"callerRole"		: this.state.roleName
						}
			;
			let eResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
											{
												"method"	: "POST",
												"headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																},
												"body"		: JSON.stringify(eBody)
				 							}
						 				)
			;
			let eDropDownList = [];
			let eJson = await eResponse.json();
			let edata = eJson.result.response;
			for (let i = 0; i < edata.length; i++)
				eDropDownList.push({"value": edata[i].userId, "label": edata[i].name});
			meta["M_EL_LP_E"] = eDropDownList;
		}

		if (this.state.roleName === "MAXISELLPADMIN" || this.state.roleName === "MAXISELLPSHIPMENTADMIN")
		{
			let sBody =	{	"userId"			: AuthUtil.getUsername(), 
							"accountId"			: AuthUtil.getUsername(), 
							"role"				: "MAXISELLPSHIPMENT"	, 
							"onBoardingStatus"	: null					,
							"callerRole"		: this.state.roleName
						}
			;
			let sResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
											{
												"method"	: "POST",
												"headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																},
												"body"		: JSON.stringify(sBody)
				 							}
						 				)
			;
			let sDropDownList = [];
			let sJson = await sResponse.json();
			let sdata = sJson.result.response;
			for (let i = 0; i < sdata.length; i++)
				sDropDownList.push({"value": sdata[i].userId, "label": sdata[i].name});
			meta["M_EL_LP_S"] = sDropDownList;
		}

		if (this.state.roleName === "MAXISELLPADMIN" || this.state.roleName === "MAXISELLPWADMIN")
		{
			let wBody =	{	"userId"			: AuthUtil.getUsername(), 
							"accountId"			: AuthUtil.getUsername(), 
							"role"				: "MAXISELLPWAREHOUSE"	, 
							"onBoardingStatus"	: null					,
							"callerRole"		: this.state.roleName
						}
			;
			let wResponse = await fetch	(	gwUrl + "authorization-service/endpoint/user/list-partner-role", 
											{
												"method"	: "POST",
												"headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																},
												"body"		: JSON.stringify(wBody)
				 							}
						 				)
			;
			let wDropDownList = [];
			let wJson = await wResponse.json();
			let wdata = wJson.result.response;
			for (let i = 0; i < wdata.length; i++)
				wDropDownList.push({"value": wdata[i].userId, "label": wdata[i].name});
			meta["M_EL_LP_W"] = wDropDownList;
		}

		this.setInputValue("meta", meta);
/*		
		let attemptResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/attempt/detail", 
												{
												 "method"	: "POST",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
												 ,
												 "body"		: JSON.stringify({"attemptId": this.state.attemptId})
					 							}
					 						)
		;
		let attemptDetails = await attemptResponse.json();
		
		console.log("====attemptDetails.result====");
		console.log(attemptDetails.result);
		console.log(attemptDetails.result.design);
*/		
		let designResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/design/detail", 
												{
												 "method"	: "POST",
												 "headers"	:	{	"Content-Type"	: "application/json",
																	"token"			: "Bearer NO TOKEN"
																}
												 ,
												 "body"		: JSON.stringify({"designId": this.state.profileId})
					 							}
					 						)
		;

		let designDetails = await designResponse.json();
		
//		let designDetails = {"result" : {"designModel": attemptDetails.result.design}, "attemptId": attemptDetails.result.attemptId};

//		let defaultSteps = this.getDefault();
//		attemptDetails.result.designModel.steps = defaultSteps.steps;
		
		this.setInputValue("designName", designDetails.result.designModel.designName);
		this.setInputValue("attemptId", designDetails.result.attemptId);
		
		for (let i = 0; i < designDetails.result.designModel.steps.length; i++)
		{	
			designDetails.result.designModel.steps[i].activeClass = "stepClassInactive";
			designDetails.result.designModel.steps[i].stepDisplayStyle = this.state.stepDisplayStyleInactive;
		}
		for (let i = 0; i < designDetails.result.designModel.steps.length; i++)
		{	
			if (designDetails.result.designModel.steps[i].stepType === "STEP_PUSH")
			{
				this.setInputValue("lastStep", i - 1);
				break;
			}
		}

		let dropDownSourceManager = [];
		for (let i = 0; i < designDetails.result.designModel.steps.length; i++)
		{	
			if (designDetails.result.designModel.steps[i].stepType === "STEP_PROPERTY_EXTENDER")
			{
				let propertyList = designDetails.result.designModel.steps[i].property1;

				for (let j = 0; j < propertyList.length; j++)
				{	
					if (propertyList[j].code === "CREATOR_ORGANIZATION")
					{
						let userDetail = AuthUtil.getUserDetails();
						designDetails.result.designModel.steps[i].property1[j].value = userDetail.taggedMerchantIds[0].merchantId;
						break;
					}
				}
				for (let j = 0; j < propertyList.length; j++)
				{	
					if (propertyList[j].code === "PARENT_ORGANIZATION_USER_ID" && propertyList[j].hidden === true)
					{
						let userDetail = AuthUtil.getUserDetails();
						designDetails.result.designModel.steps[i].property1[j].value = userDetail.taggedMerchantIds[0].merchantId;
						break;
					}
				}
				for (let j = 0; j < propertyList.length; j++)
				{	
					if (propertyList[j].type === "DROPDOWN")
					{
						dropDownSourceManager.push(propertyList[j]);
					}
				}
			}
		}
		
		this.setInputValue("dropdowns", dropDownSourceManager);

		designDetails.result.designModel.steps[this.state.activeStep].activeClass = "stepClassActive";
		designDetails.result.designModel.steps[this.state.activeStep].stepDisplayStyle = this.state.stepDisplayStyleActive;

		let dropDownValues = [];
		this.setInputValue("dropDownValues", dropDownValues);
		console.log("====this.state.dropDownValues====");
		console.log(this.state.dropDownValues);
		this.setInputValue("steps", designDetails.result.designModel.steps);
	}

    newScheme() {
        this.props.history.push({ "pathname": "/new-scheme", "state": {"attemptIdScheme": this.state.attemptIdScheme}});
    }

	async saveProfile()
	{
		const gwUrl = process.env.REACT_APP_ONBOARD_API_GW_HOST;
		
		this.setInputValue("resultPresent"			, true	);
		this.setInputValue("resultPresentProcessing", true	);
		this.setInputValue("resultPresentFailure"	, false	);
		this.setInputValue("resultPresentSuccess"	, false	);

		let consumerpeJSON = {};
		try
		{
			consumerpeJSON.attemptId = this.state.attemptId;
			this.setInputValue("attemptIdScheme", consumerpeJSON.attemptId );
			
			console.log("========ATTEMPTID========");
			console.log(this.state.attemptIdScheme);
			console.log("========ATTEMPTID========");
			
			consumerpeJSON.designId = this.state.profileId;
			consumerpeJSON.propertyList = [];

			for (let stepIndex = 0; stepIndex < this.state.steps.length; stepIndex++)
			{
				let currentStep = this.state.steps[stepIndex];
				let currentStepFields = currentStep.property1;
	
				for (let i = 0; currentStep.stepType !== "STEP_PUSH" && i < currentStepFields.length; i++)
				{
					let property =  currentStepFields[i];
	
					try{
						property.propertyName		= property.displayName === undefined? property.code : property.displayName;
						property.propertyCode		= property.code;
						property.propertyType		= property.type;
						property.propertyValue		= property.value;
						property.propertyValueLink	= "";
						property.contextId			= "";
						property.stepSerial			= stepIndex;
						property.stepName			= currentStep.stepName;
					}
					catch(e)
					{
						console.log("error");
					}
					consumerpeJSON.propertyList.push(property);
				}
			}
			consumerpeJSON.stepCompleted = (this.state.lastStep * 1 + 1);

			let saveResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/consumerpe", 
													{
													 "method"	: "POST",
													 "headers"	:	{	"Content-Type"	: "application/json",
																		"token"			: "Bearer NO TOKEN"
																	}
													 ,
													 "body"		: JSON.stringify(consumerpeJSON)
						 							}
						 						)
			;
		
			let responseJSON = await saveResponse.json();
	
			this.setInputValue("resultPresentProcessing", false	);

			if (responseJSON.result !== undefined)
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

	getComponentDesign() {
		let design = 
					<div className="card-form-body">
						<div width="100%" style={{"textAlign": "center"}}>
							<h3><b>{this.state.designName}</b></h3>
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
						<table width="100%"><tbody width="100%">
							<tr width="100%">
								{	this.state.steps.map	(	(step, index) =>	{
																						if (step.stepType === "STEP_PUSH")
																							return (<td key={index}></td>);
																						
																						return	(
																									<td key={index} className={step.activeClass} onClick={() => this.activateStep(index)}>
																										<b>Step {index + 1}</b>
																									</td>
																								)
																						;
																					}
								 							)
								}
							</tr></tbody>
						</table>
						<div>&nbsp;</div>
						<div>
						{	this.state.steps.map	(	(step, index) =>	{
																				if (step.stepType === "STEP_PUSH")
																					return (<div width="0px" key={index}></div>);
																				
																				return	(
																							<div style={step.stepDisplayStyle} key={index}>
																								<StepComponentInformation 
																									step={step}
																									index={index}
																									activeStep={this.state.activeStep}
																									rootComponent={this}
																									readOnly={false}
																								>
																								</StepComponentInformation>
																							</div>
																						)
																				;
																			}
						 							)
						}
						</div>
		                <hr />
		                {
		                    this.state.resultPresentSuccess !== true ?
		                        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
		                            {(this.state.activeStep > 0) && <div className="p-mb-2 p-mr-2"> <Button label="Previous" onClick={() => { this.stepChange(-1) }} className="p-button-raised p-button-secondary" /></div>}
		                            {(this.state.activeStep < this.state.lastStep) && <div className="p-mb-2 p-mr-2"><Button label="Next" onClick={() => { this.stepChange(1) }} className="p-button-raised p-button-secondary" /></div>}
		                            {(this.state.activeStep === this.state.lastStep) && <div className="p-mb-2 p-mr-2"><Button label="Submit" onClick={() => { this.saveProfile() }} className="p-button-raised p-button-secondary" /></div>}
		                        </div>
		                        :
		                        null
		                }
						{
							(this.state.resultPresentSuccess === true && this.state.designName === "Maxis Services Local Merchant Customer")?
		                        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
		                            <div className="p-mb-2 p-mr-2">
										<Button label="New Scheme" onClick={() => { this.newScheme(); }} className="p-button-raised p-button-secondary" />
									</div>
		                        </div>
							:
							null
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
export default withRouter(AddFormComponent);
