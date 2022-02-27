import React from "react";

import ButtonComponent2	from "./ButtonComponent2"	;
import AuthUtil			from "../auth/AuthUtil"		;

class FileComponent extends React.Component 
{
	constructor(props) 
	{
		super(props);

		let mode			= this.props.mode				;
		let fieldComponent	= this.props.fieldComponent		;
		let contextComponent= this.props.contextComponent	;
		let rootComponent	= this.props.rootComponent		;
		const readOnly= this.props.readOnly	;

		let fieldvalueString = fieldComponent.value;
		let fieldvalueJSON = {"fileName" : "Choose a file", "fileCode": ""};
		
		try
		{
			fieldvalueJSON = JSON.parse(fieldvalueString);
		}
		catch(e)
		{
		}

		this.state =	{	"mode"				: mode				,
							"fileInfo"			: fieldvalueJSON	,
							"selectedFile"		: {}				,
							"fieldComponent"	: fieldComponent	,
							"readOnly"			: readOnly			,
							"contextComponent"	: contextComponent	,
							"rootComponent"		: rootComponent		,
							"fileSelected"		: false				,
							"fileUploaded"		: false
						}
		;

		this.onClick		= this.onClick.bind(this)		;
		this.onFileChange	= this.onFileChange.bind(this)	;
		this.onFileUpload	= this.onFileUpload.bind(this)	;
		this.requestOnload	= this.requestOnload.bind(this)	;
		this.onFileDownload = this.onFileDownload.bind(this);
	}

	onClick(code) 
	{
		if (code === "UPLOAD")
		{
			console.log("FileComponent : " + code + " clicked");
			this.onFileUpload() ;
			console.log("FileComponent : " + code + " complete");
		}
		else if (code === "DOWNLOAD")
		{
			console.log("FileComponent : " + code + " clicked");
			this.onFileDownload() ;
			console.log("FileComponent : " + code + " complete");
		}
		else if (code === "BROWSE")
		{
			document.getElementById(this.state.fieldComponent.code + "_FILE").click();
		}
		else
		{
			console.log("FileComponent : " + code + " clicked");
		}
	};

	onFileChange(event) 
	{
		try{
			console.log("FileComponent : onFileChange clicked");
			console.log(event.target.files[0]);
			this.setState({ "selectedFile": event.target.files[0] });
			this.setState({ "fileSelected": true });
			this.setState({ "fileUploaded": false });
			let fileInfo = this.state.fileInfo;
			fileInfo.fileName = event.target.files[0].name;
			this.setState({ "fileInfo": fileInfo });
		}
		catch(e)
		{}
	};

	requestOnload(request)
	{
		if (request.status !== 200) 
		{
			console.log(request.responseText);
		} 
		else 
		{
			console.log(request.responseText);
			let responseJSON = JSON.parse(request.responseText);
			let fileInfo = this.state.fileInfo;
			fileInfo.fileCode = responseJSON.fileCode;
			this.setState({ "fileInfo": fileInfo });
			this.state.contextComponent.setInputValue(this.state.fieldComponent.code, JSON.stringify(fileInfo));
			this.setState({ "fileSelected": false });
			this.setState({ "fileUploaded": true });
		}
	}

	onFileUpload() 
	{
		let formData= new FormData()					;
		let request = new XMLHttpRequest()				;
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		request.open("POST", gwUrl + "maxisservice-service/endpoint/file/upload");
		request.setRequestHeader("token", "Bearer " + AuthUtil.getIdToken());
		request.setRequestHeader("userid", AuthUtil.getUserId());

		formData.append("file", this.state.selectedFile);
		request.send(formData);
//		this.setState({ "selectedFile": this.state.selectedFile });
		let thisRequestOnload = this.requestOnload;
		request.onload =	function()
							{
								thisRequestOnload(request);
							}
		;
	};

	onFileDownload() 
	{
		let fileCode = this.state.fileInfo.fileCode;
		let fileName = this.state.fileInfo.fileName;
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

		try 
		{
			fetch	(	gwUrl + "maxisservice-service/endpoint/file/download/" + fileCode, 
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
								let link = document.createElement("a");
								link.href = url;
								link.download = fileName;
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
							}
						)
			;
		}
		catch (e) {
			console.log(e);
		}
	};

	getComponentDesign() 
	{
		let componentDesign =	<table>
									<tbody>
										<tr>
											<td>
												<div>
													{this.state.fileInfo.fileName}
												</div> 
											</td>
											{	this.state.readOnly === false &&
												<td>
													<ButtonComponent2
														text="Browse"
														code="BROWSE"
														item={this}
														itemClick={true}
													/> 
													<input type="file" id={this.state.fieldComponent.code + "_FILE"} style={{"display": "none"}} onChange={ (e) => this.onFileChange(e) } />
												</td>
											}
											{	this.state.readOnly === false && this.state.fileSelected === true && this.state.fileUploaded === false && 
												<td>
													<ButtonComponent2
														text="Upload"
														code="UPLOAD"
														item={this}
														itemClick={true}
													/> 
												</td>
											}
											{	this.state.fileInfo.fileCode !== "" &&
												<td>
													<ButtonComponent2
														text="Download"
														code="DOWNLOAD"
														item={this}
														itemClick={true}
													/> 
												</td>
											}
										</tr>
									</tbody>
								</table>
		;

		return componentDesign;
	}

	render() 
	{
		let componentDesign = this.getComponentDesign()
		return componentDesign;
	}
}

export default FileComponent;
