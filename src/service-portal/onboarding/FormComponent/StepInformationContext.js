import React from "react";
import '../../../App.css';
import StepInformationContextFields from "./StepInformationContextFields";
import { Fieldset } from 'primereact/fieldset';

class StepInformationContext extends React.Component {

	constructor(props) {
		super(props);

		const contextName = this.props.contextName;
		const fields = this.props.fields;
		const rootComponent = this.props.rootComponent;
		this.rootComponent = this.props.rootComponent;
		const index = this.props.index;
		const readOnly= this.props.readOnly	;

		this.state = {
			"fields": fields,
			"contextName": contextName,
			"step": this.props.step,
			"index": index,
			"readOnly"		: readOnly		,
			"rootComponent": rootComponent
		}
			;
	}

	render() {
		return (
			<div>
				<div>
					<br />
					{
						this.state.contextName !== "" ?
							<Fieldset legend={this.state.contextName} toggleable>
											<StepInformationContextFields
												fields = {this.state.fields}
												step={this.state.step}
												contextName={this.state.contextName}
												index={this.state.index}
												rootComponent={this.state.rootComponent}
												dropDownValues={this.state.dropDownValues}
												readOnly={this.state.readOnly}
											>
											</StepInformationContextFields>
							</Fieldset>
							:
							<Fieldset legend={this.state.contextName} toggleable>
								<StepInformationContextFields
									fields = {this.state.fields}
									step={this.state.step}
									contextName={this.state.contextName}
									index={this.state.index}
									rootComponent={this.state.rootComponent}
									dropDownValues={this.state.dropDownValues}
									readOnly={this.state.readOnly}
								>
								</StepInformationContextFields>
							</Fieldset>
					}
				</div>
			</div>
		);
	}
}

export default StepInformationContext;