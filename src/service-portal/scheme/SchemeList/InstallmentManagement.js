import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import InputFieldComponentv2		from "../../onboarding/FormComponent/InputFieldComponentv2"			;
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";

class InstallmentManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
						"tableData"				: [],
						"actions"				: [{"actionCode": "NOTIFY", "actionLabel":"Notify"}, {"actionCode": "MARK", "actionLabel":"Mark Paid"}],
						"notificationContent"	: "Amount [[AMOUNT]] for installment number [[#]] of [[SCHEME]] is due to [[MERCHANT]] on [[DATE]] at [[SHOWROOM]]."
					}
		;

		console.log("constructed");
        this.setInputValue		= this.setInputValue.bind	(this)	;
		this.handleInstallment	= this.handleInstallment.bind(this)	;
		this.loadInstallments	= this.loadInstallments.bind(this)	;
	}

	handleInstallment(action, installment) 
	{
		console.log(action);
		console.log(installment);
		
		this.setInputValue("installResultPresent", {"serial":"", "status":"ABSENT"});
		this.setInputValue("notifyResultPresent", {"serial":"", "status":"ABSENT"});

        const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		if (action === "MARK")
		{
			let payLoad = {"installmentId": installment.id};
	        try {
	            fetch(gwUrl + "maxisservice-service/endpoint/scheme/pay-installment", {
	                method: "POST",
	                headers: {
	                    "Content-Type": "application/json",
	                    "token": "Bearer " + AuthUtil.getIdToken(),
	                    "userid": AuthUtil.getUserId()
	                },
	                body: JSON.stringify(payLoad)
	            })
	                .then(res => res.json())
	                .then(json => json)
	                .then(result => {
						if (result.paymentStatus !== undefined && result.paymentStatus !== null && result.paymentStatus !== "")
						{
							this.setInputValue("installResultPresent", {"serial": result.installmentSerial, "status": "SUCCESS"});
							this.loadInstallments();
						}
						else
						{
							this.setInputValue("installResultPresent", {"serial": result.installmentSerial, "status": "FAILURE"});
						}
	                })
	        }
	        catch (e) {
	            console.log(e)
	        }
		}
		else if (action === "NOTIFY")
		{
			let payLoad = {"installmentId": installment.id, "senderId": AuthUtil.getUserId(), "notificationContent": this.state.notificationContent};
	        try {
	            fetch(gwUrl + "maxisservice-service/endpoint/scheme/notify-installment", {
	                method: "POST",
	                headers: {
	                    "Content-Type": "application/json",
	                    "token": "Bearer " + AuthUtil.getIdToken(),
	                    "userid": AuthUtil.getUserId()
	                },
	                body: JSON.stringify(payLoad)
	            })
	                .then(res => res.json())
	                .then(json => json)
	                .then(result => {
						if (result.id !== undefined && result.paymentStatus !== null && result.id !== "")
						{
							this.setInputValue("notifyResultPresent", {"serial": result.installmentSerial, "status": "SUCCESS"});
						}
						else
						{
							this.setInputValue("notifyResultPresent", {"serial": result.installmentSerial, "status": "FAILURE"});
						}
	                })
	        }
	        catch (e) {
	            console.log(e)
	        }
		}
		console.log("mounted");
	}

	dateTemplate(rowData, column) {
		console.log("column");
		console.log(column);
		
		let r = rowData["creationDate"];
		
		return r.substring(0, 10);
	}

    setInputValue(property, val) {
        this.setState({ [property]: val });
    }

	componentDidMount() 
	{
		this.loadInstallments();
	}
	async loadInstallments() 
	{
		console.log("mounting");
        const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {"userId": AuthUtil.getUserId(), "role": AuthUtil.getRole(0).code, "tenantId": AuthUtil.getTanentId()};
        try {
            fetch(gwUrl + "maxisservice-service/endpoint/scheme/get-installment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken(),
                    "userid": AuthUtil.getUserId()
                },
                body: JSON.stringify(payLoad)
            })
                .then(res => res.json())
                .then(json => json)
                .then(result => {
                    this.setInputValue("tableData", result);
                })
        }
        catch (e) {
            console.log(e)
        }
		console.log("mounted");
	}

	getComponentDesign() 
	{
		let columnData = [];
		let role = AuthUtil.getRole(0).code;
		
		if (role === "Maxis-Services-LM-Administrator")
			columnData =[
							{	"name"			: "Created on"	,	"selector"		: "creationDate"				, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Collect on"	,	"selector"		: "installmentDate"				, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Status"		,	"selector"		: "paymentStatus"				, "style":{"width": "150px", "textAlign": "center"}},
							{	"name"			: "Issue id"	,	"selector"		: "schemeId"					, "style":{"width": "250px", "textAlign": "center"}},
							{	"name"			: "Serial"		,	"selector"		: "installmentSerial"			, "style":{"width": "100px", "textAlign": "right"}},
							{	"name"			: "Amount"		,	"selector"		: "installmentAmount"			, "style":{"width": "100px", "textAlign": "right"}},
							{	"name"			: "Paid on"		,	"selector"		: "installmentSubmissionDate"	, "style":{"width": "250px", "textAlign": "right"}},
							{	"name"			: "Phone"		,	"selector"		: "customer.phoneNumber"		, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Customer"	,	"selector"		: "customer.name"				, "style":{"width": "250px", "textAlign": "left"}},
							{	"name"			: "Issuer"		,	"selector"		: "creator.name"				, "style":{"width": "250px", "textAlign": "left"}},
						]
			;
		if (role === "Maxis-Services-MM-Administrator")
			columnData =[
							{	"name"			: "Branch"		,	"selector"		: "localMerchant.name"			, "style":{"width": "250px"}},
							{	"name"			: "Issuer"		,	"selector"		: "creator.name"				, "style":{"width": "250px"}},
							{	"name"			: "Created on"	,	"selector"		: "creationDate"				, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Collect on"	,	"selector"		: "installmentDate"				, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Status"		,	"selector"		: "paymentStatus"				, "style":{"width": "150px", "textAlign": "center"}},
							{	"name"			: "Issue id"	,	"selector"		: "schemeId"					, "style":{"width": "250px", "textAlign": "center"}},
							{	"name"			: "Serial"		,	"selector"		: "installmentSerial"			, "style":{"width": "100px", "textAlign": "right"}},
							{	"name"			: "Amount"		,	"selector"		: "installmentAmount"			, "style":{"width": "100px", "textAlign": "right"}},
							{	"name"			: "Paid on"		,	"selector"		: "installmentSubmissionDate"	, "style":{"width": "250px", "textAlign": "right"}},
							{	"name"			: "Phone"		,	"selector"		: "customer.phoneNumber"		, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Customer"	,	"selector"		: "customer.name"				, "style":{"width": "250px", "textAlign": "left"}},
						]
			;
		let tableData = this.state.tableData;
		let actions = this.state.actions;

		let componentDesign = 
			<div className="card">
				<br/>
				<table className="width100">
					<tbody className="width100"> 
						<tr className="width100">
							<td className="width25">
								<label className="form-input-label2"><b>Notification content</b></label>
							</td>
							<td className="width75">
								<div className="d-flex">
									<InputFieldComponentv2
										className="form-input"
										type="text"
										placeholder="Notification content"
										id="notificationContent"
										value={this.state.notificationContent === undefined? "" : this.state.notificationContent}
										readOnly={false}
										onChange={(val) => this.setInputValue("notificationContent", val)}
									/> 
								</div>
							</td>
						</tr>
						<tr className="width100">
							<td className="width25">
								<label className="form-input-label2"><b>Markers</b></label>
							</td>
							<td className="width75">
								<div className="d-flex">
									<table>
										<tbody>
											<tr><td>[AMOUNT]	</td><td>==&gt;</td><td>Installment amount	</td></tr>
											<tr><td>[#]			</td><td>==&gt;</td><td>Installment serial	</td></tr>
											<tr><td>[SCHEME]	</td><td>==&gt;</td><td>Issue ID			</td></tr>
											<tr><td>[MERCHANT]	</td><td>==&gt;</td><td>Company Name		</td></tr>
											<tr><td>[DATE]		</td><td>==&gt;</td><td>Installment Date	</td></tr>
											<tr><td>[SHOWROOM]	</td><td>==&gt;</td><td>Showroom Name		</td></tr>
										</tbody>
									</table>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
				<hr/>
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">Installments</div>
					</div>
				</div>

				<div className="p-grid fixedwidth512" >
					<div className="datatable-filter-demo">
						<DataTable value={tableData} paginator rows={5} className="p-datatable-customers">
							{	columnData && 
								columnData.map	(	(value, index) =>	
													{
														if (index === 0)
															return	<Column 
																		key		= {index} 
																		field	= {value.selector} 
																		header	= {value.name} 
																		style	= {value.style}
																		sortable= {true}
																		filter filterPlaceholder="Search here" filterMatchMode="contains" 
																		body={this.dateTemplate}
																	/>
														else
															return	<Column 
																		key		= {index} 
																		field	= {value.selector} 
																		header	= {value.name} 
																		style	= {value.style}
																		sortable= {true}
																		filter filterPlaceholder="Search here" filterMatchMode="contains" 
																	/>
													}
												)
							}
									{	actions && 
										<Column	header="Action" style= {{"width": "256px"}} 
												body=	{	(h) =>	
																	<div className="p-d-flex">
																		{	
																			actions.map	(	(value, index) => 
																							{
																								if (h.paymentStatus === undefined || h.paymentStatus === null || h.paymentStatus === "" || h.paymentStatus === "DUE")
																								{	return	<div key={index} style={{"padding": "2px"}}>
																												<Button label={value.actionLabel} onClick={() => {this.handleInstallment(value.actionCode, h)}}/>											
																											</div>
																								}
																								else
																									return null;
																							}
																						)
																		}
																	</div>
														}
										/>
									}
						</DataTable>
					</div>
				</div>
				<hr/>
				<br/>
			</div>
		;
		return componentDesign;
	}
	render() {
		let componentDesign = this.getComponentDesign()
		return <MainComponent component={componentDesign} />;
	}
}
export default withRouter(InstallmentManagement);
