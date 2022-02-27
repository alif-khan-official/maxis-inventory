import React from "react";
import "../../../App.css";
import { Button } from 'primereact/button';

class ButtonComponentFileDownload extends React.Component {
	constructor(props) 
	{
		super(props);
		
		this.state =	{
							"text"		: this.props.text,
							"code"		: this.props.code,
							"item"		: this.props.item,
							"root"		: this.props.root,
							"itemClick"	: this.props.itemClick
						}
		;
		
		this.onClick = this.onClick.bind(this);
	}

	onClick()
	{
		if(this.state.itemClick === undefined || this.state.itemClick === null)
		{
			if (this.state.item === undefined || this.state.item === null)
			{
				this.state.root.onClick(this.state.code);
			}
			else
			{
				this.state.root.onClick(this.state.code, this.state.item);
			}
		}
		else
		{
			this.state.item.onClick(this.state.code);
		}
	}
	
	render() 
	{
		return	(
					<div className="buttonComponent">
						<Button
							className="p-button-raised p-button-info" 
							onClick={() => this.onClick()}
							label={this.state.text} 
        				/>
					</div>
				)
		;
	}
}

export default ButtonComponentFileDownload;