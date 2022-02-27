import React						from "react"						;
import InputFieldComponentv2		from "./InputFieldComponentv2"		;
import SearchableDropdownComponent	from "./SearchableDropdownComponent";
import DateTimeComponent			from "./DateTimeComponent"			;
import FileComponent				from "./FileComponent"				;
import "../../../App.css";

class StepInformationContextFields extends React.Component 
{
	constructor(props) 
	{
		super(props);

		const contextName	= this.props.contextName	;
		const fields		= this.props.fields			;
		const stepIndex		= this.props.index			;
		const rootComponent	= this.props.rootComponent	;
		this.rootComponent	= this.props.rootComponent	;
		let dropDownValues = this.props.dropDownValues;
		const readOnly= this.props.readOnly	;
		
		this.state =	{	"contextName"	: contextName	, 
							"fields"		: fields		,
							"rootComponent"	: rootComponent	,
							"stepIndex"		: stepIndex		,
							"readOnly"		: readOnly	,
							"dropDownValues": dropDownValues
						}
		;
	}

	saveStepInformationContextFields(key, value)
	{
		this.rootComponent.saveAttemptProfileComponentAuth2(this.props.step, this.props.contextName, key, value, this.props.index);
	}
	
	setInputValue(property, val) 
	{
		this.setState({[property]: val});
		try
		{
			this.rootComponent.saveAttemptProfileComponentAuth2(this.props.step, this.props.contextName, property, val, this.props.index);
		}
		catch(e)
		{
			console.log("ISSUE: StepInformationContextFields setInputValue saveAttemptProfileComponentAuth2");
		}
	}

	setFieldValue(property, val) 
	{
		let fields = this.state.fields;
		for (let i = 0; i < fields.length; i++)
		{
			const field = fields[i];
			if (field.code === property)
			{
				fields[i].value = val;
				fields[i].key= field.code;
				break;
			}
		}
		this.saveStepInformationContextFields(property, val);
		this.setInputValue("fields", fields);
	}

	setDropDownFieldValue(property, val) 
	{
		console.log(property);
		console.log(val);
		this.setFieldValue(property, val);
		this.rootComponent.saveDropDownValues(property, val);
	}

	setDateTimeFieldValue(property, val) 
	{
		this.setFieldValue(property, val);
		this.rootComponent.setInputValue(property, val);
	}

	render() 
 	{ 		
		return	(
					<table className="width100">
						<tbody className="width100"> 
							{	this.state.fields.map	(	(field, index) =>
															{
																let returnValue = null;

																if (field.hidden === true)
																{
																	returnValue =	
																					<tr key={field.code} style={{"display":"none"}} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
																							<div className="d-flex">
														 										<InputFieldComponentv2
																									className="form-input"
																									type="hidden"
																									placeholder={field.displayName}
																									id={field.code}
																									value={field.value}
																									readOnly={true}
																									rootComponent = {this.state.rootComponent}
																									fieldComponent= {field}
																								/> 
																							</div>
																						</td>
																					</tr>
																	;
																}
																else if (field.type === "STRING")
																{
																	returnValue =	
																					<tr key={field.code} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
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
																						</td>
																					</tr>
																	;
																}
																else if (field.type === "PASSWORD")
																{
																	returnValue =	
																					<tr key={field.code} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
																							<div className="d-flex">
														 										<InputFieldComponentv2
																									className="form-input"
																									type="password"
																									placeholder={field.displayName}
																									id={field.code}
																									value={field.value}
																									onChange={(val) => this.setFieldValue(field.code, val)}
																									rootComponent = {this.state.rootComponent}
																									fieldComponent= {field}
																									readOnly={this.state.readOnly}
																								/> 
																							</div>
																						</td>
																					</tr>
																	;
																}
																else if (field.type === "DROPDOWN")
																{
																	if (field.sourceFilter !== undefined && field.sourceFilter !== "" )
																	{
																		returnValue =	
																					<tr key={field.code} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
																								<div className="d-flex">
															 										<SearchableDropdownComponent
																										filter		= {true}
																										value		= {field.value}
																										context		= {this}	
																										onChange	= {(val) => this.setDropDownFieldValue(field.code, val)}
																										placeholder		= {field.displayName}
																										rootComponent	= {this.state.rootComponent}
																										fieldComponent	= {field}
																										readOnly={this.state.readOnly}
																										dropDownValues	={this.state.dropDownValues}
																									/> 
																								</div>
																							</td>
																						</tr>
																		;
																	}
																	else
																	{
																		returnValue =	
																					<tr key={field.code} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
																								<div className="d-flex">
															 										<SearchableDropdownComponent
																										filter		= {false}
																										value		= {field.value}
																										context		= {this}	
																										onChange	= {(val) => this.setDropDownFieldValue(field.code, val)}
																										placeholder		= {field.displayName}
																										rootComponent	= {this.state.rootComponent}
																										fieldComponent	= {field}
																										readOnly={this.state.readOnly}
																									/> 
																								</div>
																							</td>
																						</tr>
																		;
																	}
																}
																else if (field.type === "DATE")
																{
																	returnValue =	
																					<tr key={field.code} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
																								<div className="d-flex">
															 										<DateTimeComponent
																										value			= {field.value}
																										contextComponent= {this}
																										fieldComponent	= {field}
																										rootComponent	= {this.state.rootComponent}
																										readOnly={this.state.readOnly}
																									/> 
																								</div>
																							</td>
																						</tr>
																		;
																}
																else if (field.type === "FILE")
																{
																	console.log("field.type is FILE");
																	
																	returnValue =	
																					<tr key={field.code} className="width100">
																						<td className="width25">
																							<label className="form-input-label2">{field.displayName === undefined? field.code : field.displayName}</label>
																						</td>
																						<td className="width75">
																							<div className="d-flex">
														 										<FileComponent
																									value			= {field.value}
																									contextComponent= {this}
																									fieldComponent	= {field}
																									rootComponent	= {this.state.rootComponent}
																									readOnly={this.state.readOnly}
																								/> 
																							</div>
																						</td>
																					</tr>
																	;
																}
																return	(returnValue);
															}
							 							)
							}
						</tbody>
					</table>
				)
		;
	}
}

export default StepInformationContextFields;
