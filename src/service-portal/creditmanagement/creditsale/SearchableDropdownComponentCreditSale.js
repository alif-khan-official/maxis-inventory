import React		from "react"				;
import { Dropdown } from 'primereact/dropdown'	;
import '../../../App.css'						;
import AuthUtil from "../../../auth/AuthUtil";

class SearchableDropdownComponentCreditSale extends React.Component
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

		let list = this.props.list;
		let data = list;
		let name = fieldComponent.code;

		console.log("====fieldComponent====");
		console.log(fieldComponent);
		console.log("====list====");
		console.log(list);

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
		console.log("====selectedItem====");
		console.log(selectedItem);
		console.log(selectedItem[fieldComponent.filterField]);

		if (filter === true)
		{
			console.log("====filter====");

			data = [];
			
			console.log("rootComponent.state.dropDownValues[fieldComponent.sourceFilter]");
			console.log(rootComponent.state.dropDownValues[fieldComponent.sourceFilter]);
			
			let masterValue = rootComponent.state.dropDownValues[fieldComponent.sourceFilter];
			for(let i = 0; masterValue !== undefined && list !== undefined && list !== null && i < list.length; i++)
			{
				if (list[i][fieldComponent.filterField] === masterValue)
				{
					console.log("DROP DOWN MATCHED");
					data.push(list[i]);
				}
			}
			rootComponent.saveDropDownDependencies(fieldComponent.sourceFilter, this);
		}
		else
		{
			console.log("====no filter====");
		}

		this.state =	{	"code"			: name			,
							"data"			: data			,
							"list"			: list			,
							"value"			: value			,
							"filter"		: filter		,
							"meta"			: []			,

							"context"		: context		,
							"onChange"		: onChange		,
							"placeholder"	: placeholder	,

							"readOnly"		: readOnly		,
							"rootComponent"	: rootComponent	,
							"fieldComponent": fieldComponent,
							
							"selectedItemLabel"	:	selectedItemLabel
						}
		;
		
		this.setInputValue = this.setInputValue.bind(this);
		this.resetOptions = this.resetOptions.bind(this);
		this.loadCustomers = this.loadCustomers.bind(this);
	}

	resetOptions(val) 
	{
		this.setState({"value": ""});
		let list = this.state.list;
		console.log("====list====");
		console.log(list);
		let data = [];
		for(let i = 0; list !== undefined && list !== null && i <list.length; i++)
		{
			console.log("list[i][fieldComponent.filterField] ON CHANGE");
			console.log(list[i][this.state.fieldComponent.filterField]);
			console.log("rootComponent.state.dropDownValues[fieldComponent.sourceFilter] ON CHANGE");
			console.log(this.state.rootComponent.state.dropDownValues[this.state.fieldComponent.sourceFilter]);
			if (list[i][this.state.fieldComponent.filterField] === this.state.rootComponent.state.dropDownValues[this.state.fieldComponent.sourceFilter])
			{
				console.log("DROP DOWN MATCHED ON CHANGE");
				data.push(list[i]);
			}
		}
		this.setState({"data": data});
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	setInputValuePrime(value) 
	{
		let val = value.value;
		this.setState({"value": val});
		this.state.rootComponent.setCustomer(val);
	}

	async loadCustomers()
	{
		let meta = this.state.meta;
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
		
		meta["CUSTOMER_LIST"] = customerList;

		let customerDropDownList = [];
		for (let i = 0; customerList !== undefined && customerList != null && i < customerList.length; i++)
			customerDropDownList.push({"value": customerList[i].userId, "label": customerList[i].name});
		this.setInputValue("customerDropDownList", customerDropDownList);
		meta["CUSTOMER_DROPDOWN_LIST"] = customerDropDownList;
		this.setInputValue("meta", meta);
		this.setInputValue("data", customerDropDownList);

		console.log("========GATHER LIST: START========");
		console.log(this.state.customerList);
		console.log(customerListJson.result.data);
		console.log("========GATHER LIST: END========");		
		console.log("mounted");
	}

	componentDidMount()
	{
		this.loadCustomers();
	}
	
	render() 
	{
		if (this.state.data === undefined) return (<div>No data</div>);
		
		if (this.state.readOnly)
		{
			return (<div>{this.state.selectedItemLabel}</div>);
		}
		else
		{
			return	(
                        <Dropdown 
                        	inputId={this.state.code} 
                        	value={this.state.value} 
                        	options={this.state.data.sort((a, b) => (a.name > b.name) ? 1 : -1)} 
                        	onChange={(value) => { this.setInputValuePrime(value) }} 
                        	placeholder={this.state.placeholder} 
                        />
					)
			;
		}
	}
}

export default SearchableDropdownComponentCreditSale;
