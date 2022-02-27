import React from "react";
import '../../../App.css';
import StepInformationContext from "./StepInformationContext";

class StepComponentInformation extends React.Component 
{
	constructor(props) 
	{
		super(props);

		const step		= this.props.step		;
		const index		= this.props.index		;
		const activeStep= this.props.activeStep	;
		const readOnly= this.props.readOnly	;
		let dropDownValues = this.props.dropDownValues;
		const rootComponent= this.props.rootComponent	;
		this.rootComponent	= this.props.rootComponent	;
		
		const fields	= step.property1		;
		let allContexts	= []					;
		let contextFields = [];
		
		for (let i = 0 ; i < fields.length; i++)
		{
			let field = fields[i];
			
			if (field.context !== undefined && field.context !== "" && field.context !== null)
			{	
				allContexts.push(field.context);
			}
		}
		let contexts = [...new Set(allContexts)];
		if (contexts.length === 0)
			contexts.push("");
		
		for (let i = 0 ; i < contexts.length; i++)
		{
			let context = contexts[i];
			let fieldList = [];

			contextFields[context] = fieldList;
		}

		for (let i = 0 ; i < fields.length; i++)
		{
			let field = fields[i];
			fields[i].key = fields[i].code;
			fields[i].originalValue = fields[i].value;
			field.value = fields[i].value;
			field.type = fields[i].type;

			let fieldContext = field.context;
			if (fieldContext === undefined) 
			{
				fields[i].context = "";
				fieldContext = "";
			}
			
			if (contextFields[fieldContext] === undefined)
				contextFields[fieldContext] = []; 
			contextFields[fieldContext].push(field);
		}


		this.state =	{	"step"			: step		, 
							"index"			: index		, 
							"activeStep"	: activeStep,
							"contexts"		: contexts	,
							"fields"		: fields	,
							"readOnly"		: readOnly	,
							"contextFields"	: contextFields,
							"rootComponent"	: rootComponent,
							"dropDownValues": dropDownValues
						}
		;
	}

	render() 
 	{ 		
		return	(
					<div>
						<div className="row">
							<div className="col-sm-12" style={{"textAlign": "center"}}> 
								<h3><u>{this.state.step.stepName}</u></h3>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-12"> 
							{
								this.state.contexts.map	(	(context, index) =>	{
																	return	(
																				<div className="row" key={index}>
																					<div className="col-sm-12" >
																							<StepInformationContext
																								step={this.state.step}
																								index={this.state.index}
																								contextName = {context}
																								fields = {this.state.contextFields[context]}
																								key={index}
																								rootComponent={this.state.rootComponent}
																								dropDownValues={this.state.dropDownValues}
																								readOnly={this.state.readOnly}
																							>
																							</StepInformationContext>
																					</div>
																					<br/>
																				</div>
																			)
																}
														)
								
							}
							</div>
						</div>
					</div>
				)
		;
	}
}

export default StepComponentInformation;
