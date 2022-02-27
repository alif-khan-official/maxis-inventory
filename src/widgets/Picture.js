import React from "react";

import AuthUtil			from "../auth/AuthUtil"		;

class Picture extends React.Component 
{
	constructor(props) 
	{
		super(props);

		let code= this.props.code	;
		let name= this.props.name	;

		this.state =	{	"code"	: code	,
							"name"	: name
						}
		;

		this.setInputValue	= this.setInputValue.bind(this)		;
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	async componentDidMount() {
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		let t = this;
		fetch	(	gwUrl + "maxisservice-service/endpoint/file/download/" + this.state.code, 
					{
						"method"	: "GET",
						"headers"	:	{
											"Content-Type"	: "application/json",
											"token"			: "Bearer " + AuthUtil.getIdToken(),
											"userid"		: AuthUtil.getUserId(),
										},
					}
				)
			.then(response => response.blob())
			.then(blob => URL.createObjectURL(blob))
			.then	(	url => 
						{
							t.setInputValue("url", url)
							console.log(url);
						}
					)
		;
	}

	getComponentDesign() 
	{
		let componentDesign =	<div style={{textAlign: "center", backgroundColor: "transparent"}}>
									<img alt="" src={this.state.url} style={{width:"512px", height: "512px"}}></img>
								</div>
		;

		return componentDesign;
	}

	render() 
	{
		let componentDesign = this.getComponentDesign()
		return componentDesign;
	}
}

export default Picture;
