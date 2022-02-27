import React from "react";
import "../../../App.css";

class ButtonComponent2 extends React.Component {
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
						<button
							className="loginBtn"
							onClick={() => this.onClick()}
        				>
							{this.state.text}
						</button>
					</div>
				)
		;
	}
}

export default ButtonComponent2;