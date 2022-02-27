import React		from "react"				;
import Searchable from "react-searchable-dropdown";
import "../../App.css";
import "./css/searchablestyles.scss";

class SearchableDropdownComponentDesign extends React.Component
{
	constructor(props) 
	{
		super(props);
		
		let filter			= this.props.filter			;
		let value			= this.props.value			; 
		let context			= this.props.context		;
		let onChange		= this.props.onChange		;
		let placeholder		= this.props.placeholder	;
		let fieldComponent	= this.props.fieldComponent	;
		let rootComponent	= this.props.rootComponent	;
		const readOnly= this.props.readOnly	;

		if (fieldComponent.source === "BUSINESS_AREA_THANA" || fieldComponent.source === "BUSINESS_AREA_DISTRICT")
			console.log("design test: source 1- " + fieldComponent.source);
		if (fieldComponent.source === "BUSINESS_AREA_THANA")
		{
			rootComponent.subscribe(this, fieldComponent.code, fieldComponent.source);
		}
		let list = rootComponent.state.meta[fieldComponent.source];
		let data = list;
		let name = fieldComponent.code;
		if (fieldComponent.source === "BUSINESS_AREA_THANA" || fieldComponent.source === "BUSINESS_AREA_DISTRICT")
			console.log("design test: rootComponent - ", list);

		let selectedItemLabel = "";
		let selectedItem = {};
		if (value !== undefined)
		{
			
			for (let i = 0; list !== undefined && i < list.length; i++)
			{
				if (list[i].value === value)
				{
					selectedItem = list[i];
					selectedItemLabel = selectedItem.label;
					break;
				}
			}
		}

		if (filter === true)
		{
			data = [];
			
			let masterValue = rootComponent.state.dropDownValues[fieldComponent.sourceFilter];
			for(let i = 0; masterValue !== undefined && list !== undefined && list !== null && i < list.length; i++)
			{
				if (list[i][fieldComponent.filterField] === masterValue)
				{
					data.push(list[i]);
				}
			}
			rootComponent.saveDropDownDependencies(fieldComponent.sourceFilter, this);
		}
		else
		{
		}

		this.state =	{	"code"			: name			,
							"data"			: data			,
							"list"			: list			,
							"value"			: value			,
							"filter"		: filter		,

							"context"		: context		,
							"onChange"		: onChange		,
							"placeholder"	: placeholder	,

							"readOnly"		: readOnly		,
							"rootComponent"	: rootComponent	,
							"fieldComponent": fieldComponent,
							
							"selectedItemLabel"	:	selectedItemLabel
						}
		;
		
		this.resetOptions	= this.resetOptions.bind(this)	;
		this.setInputValue	= this.setInputValue.bind(this)	;
		this.setStateValue	= this.setStateValue.bind(this)	;
		this.asyncLoadLists	= this.asyncLoadLists.bind(this);
	}

	async asyncLoadLists()
	{
		const gwUrl = process.env.REACT_APP_API_GW_HOST;
		if(this.state.fieldComponent.source === "BUSINESS_AREA_DISTRICT")
		{
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
			let districts = districtJson.districts;
			districts.sort	(	function(a, b) 
											{
												var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
												var nameB = b.displayName.toUpperCase(); // ignore upper and lowercase
												if (nameA < nameB) {
													return -1;
												}
												if (nameA > nameB) {
													return 1;
												}

												return 0;
											}
										)
			;
			
			for (let i = 0; i < districts.length; i++)
				districtDropDownList.push({"value": districts[i].id, "label": districts[i].displayName});
			
			this.setStateValue("list", districtJson.districts);		
			this.setStateValue("data", districtDropDownList);		
		}
		else if(this.state.fieldComponent.source === "BUSINESS_AREA_THANA")
		{
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
			let thanas = thanaJson.thanas;
			thanas.sort	(	function(a, b) 
											{
												var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
												var nameB = b.displayName.toUpperCase(); // ignore upper and lowercase
												if (nameA < nameB) {
													return -1;
												}
												if (nameA > nameB) {
													return 1;
												}

												return 0;
											}
										)
			;
			
			for (let i = 0; i < thanas.length; i++)
				thanaDropDownList.push({"value": thanas[i].displayName, "label": thanas[i].displayName, "parentId": thanas[i].districtId});
			
			this.setStateValue("list", thanas);		
			this.setStateValue("data", []);		
		}
		else if(this.state.fieldComponent.source === "CORPORATE_COMPANY")
		{
			let companyResponse = await fetch	(	gwUrl + "onboarding-service/endpoint/api/company-confirmed", 
													{
													 "method"	: "GET",
													 "headers"	:	{	"Content-Type"	: "application/json",
																		"token"			: "Bearer NO TOKEN"
																	}
						 							}
						 						)
			;
			let companyDropDownList = [];
			let companyJson = await companyResponse.json();
			let companies = companyJson.corporateCompanies;
			if (companies)
				companies.sort	(	function(a, b) 
												{
													var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
													var nameB = b.displayName.toUpperCase(); // ignore upper and lowercase
													if (nameA < nameB) {
														return -1;
													}
													if (nameA > nameB) {
														return 1;
													}
	
													return 0;
												}
											)
			;
			
			for (let i = 0; companies && i < companies.length; i++)
				companyDropDownList.push({"value": companies[i].displayName, "id": companies[i].id, "label": companies[i].displayName});
			
			this.setStateValue("list", companyDropDownList);		
			this.setStateValue("data", companyDropDownList);		
		}
	}

	resetOptions(field, val) 
	{
		console.log("IN resetOptions");
		this.setState({"value": ""});
		let list = this.state.list;
		let data = [];
		for(let i = 0; list !== undefined && list !== null && i <list.length; i++)
		{
			if (list[i][field] === val)
			{
				if (this.state.fieldComponent.source === "BUSINESS_AREA_THANA")
					data.push({"value": list[i].id, "label": list[i].displayName, "parentId": list[i].districtId});
			}
		}
		this.setState({"data": data});
	}

	setInputValue(val) 
	{
		this.setState({"value": val});
		let displayName = "";
		let data = this.state.data;
		for(let i = 0; data && i < data.length; i++)
			if (data[i].value === val)
				displayName = data[i].label;
		this.state.context.setDropDownFieldValue(this.state.code, val, displayName);
	}

	setStateValue(property, val) 
	{
		this.setState({[property]: val});
	}

	componentDidMount()
	{
		this.asyncLoadLists();
	}
	
	render() 
	{
		if (this.state.data === undefined) return (<div>No data</div>);
		let val = "";
		if (this.state.value !== undefined && this.state.value !== null)	val = this.state.value;
		
		
		if (this.state.readOnly)
		{
			return (<div>{this.state.selectedItemLabel}</div>);
		}
		else
		{
			return	(
						<Searchable 
							value={val} 
							placeholder={this.state.placeholder}
							options={this.state.data} 
							onSelect={(value) => { this.setInputValue(value) }}  
						/>
					)
			;
		}
	}
}

export default SearchableDropdownComponentDesign;