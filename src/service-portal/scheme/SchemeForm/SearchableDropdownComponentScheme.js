import React		from "react"				;
import { Dropdown } from 'primereact/dropdown'	;
import '../../../App.css'						;

class SearchableDropdownComponentScheme extends React.Component
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

	setInputValue(val) 
	{
		this.setState({"value": val});
		this.state.context.setDropDownFieldValue(this.state.code, val);
	}

	setInputValuePrime(value) 
	{
		let val = value.value;
		this.setState({"value": val});
		this.state.rootComponent.setCustomer(val);
	}
	componentDidMount()
	{
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

export default SearchableDropdownComponentScheme;
