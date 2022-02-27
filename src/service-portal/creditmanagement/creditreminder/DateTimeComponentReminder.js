import React			from "react";

//import DateTimePicker	from "react-datetime-picker";
import { Calendar } from 'primereact/calendar';

import "../../../App.css";

class DateTimeComponentReminder extends React.Component
{
	constructor(props) 
	{
		super(props);

		let value			= this.props.value				; 
		let rootComponent	= this.props.rootComponent		;
		let readOnly		= this.props.readOnly			;
		let code			= this.props.code				;

		if (value === undefined || value === "" || value === null)
		{
			let val = new Date();
			let year	= val.getFullYear();
			let month	= val.getMonth() + 1;
			let day		= val.getDate();
			let date = year + "-";
			date = date + (month < 10? "0" : "") + month + "-";
			date = date + (day < 10? "0" : "") + day;
			value = date;
		}
		let year	= value.substr(0, 4);
		let month	= value.substr(5, 2);
		let day		= value.substr(8, 2);
		let date	= new Date();
		date.setFullYear(year);
		date.setMonth(month - 1);
		date.setDate(day);

		this.state =	{	"readOnly"		: readOnly		,
							"value"			: value			,
							"code"			: code			,
							"rootComponent"	: rootComponent	,
							"day"			: day			,
							"month"			: month			,
							"year"			: year			,
							"date"			: date
						}
		;
		
		console.log("====date: state====");
		console.log(this.state);
		this.setInputValue = this.setInputValue.bind(this);
	}

	setInputValue(val) 
	{
		if (val === undefined || val === null)
			return;
		this.setState({"date": val});
		console.log("====datetime: val====");
		console.log(val);
		let year	= val.getFullYear();
		let month	= val.getMonth() + 1;
		let day		= val.getDate();
		let date = year + "-";
		date = date + (month < 10? "0" : "") + month + "-";
		date = date + (day < 10? "0" : "") + day;
		console.log(date);
		this.state.rootComponent.setInputValue(this.state.code, date);
	}

	setInputValuePrime(value) 
	{
		let val = value.value;
		this.setState({"date": val});
		console.log("====datetime: val====");
		console.log(val);
		let year	= val.getFullYear();
		let month	= val.getMonth() + 1;
		let day		= val.getDate();
		let date = year + "-";
		date = date + (month < 10? "0" : "") + month + "-";
		date = date + (day < 10? "0" : "") + day;
		console.log(date);
		this.state.rootComponent.setInputValue(this.state.code, date);
	}

	componentDidMount()
	{
	}
	
	render() 
	{
		return	(
					<Calendar
						value={this.state.date}
						onChange={(value) => {this.setInputValuePrime(value);}}
						showIcon={true}
						dateFormat="yy-mm-dd"
						disabled={this.state.readOnly}
					/>
				)
		;
	}
}

export default DateTimeComponentReminder;
