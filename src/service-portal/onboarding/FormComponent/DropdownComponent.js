import React from "react";
import "../../App.css";

class DropDownComponent extends React.Component
{
	constructor(props) 
	{
		super(props);
		
        let type	= this.props.type	;
        let data	= this.props.data	;
        let parent	= this.props.parent	;
        let defaultValue = this.props.defaultValue; 

		this.state =	{	"data"	: data	,
							"parent": parent,
							"type"	: type	,
							"defaultValue": defaultValue
						}
		;
		
		this.setInputValue.bind(this);
	}

	setInputValue(property, val) 
	{
		this.setState({[property]: val});
	}

	onChange(key)
	{
		this.state.parent.onChange(this.state.type, key);
	}
	
	componentDidMount()
	{
	}
	
    render() 
    {
        return	(
		            <div className="dropdown">
		                <select 
		                	className="dropdown-select" 
		                	value={this.value} 
		                	onChange={(e) => this.onChange(e.target.value)}
		                	defaultValue={this.state.defaultValue}
		                >
		                    {
		                    	this.state.data.map	(	(item) =>	{
		                    											let design =	<option 
		                    																key		={item.key} 
		                    																value	={item.value}
		                    																disabled={item.disabled}
		                    															>
		                    																{item.displayName} 
		                    															</option>
		                    											;
		                    											
		                    											return design;
		                    										}
		                    						)
		                    }
		                </select>
		            </div>
        		)
        ;
    }
}

export default DropDownComponent;