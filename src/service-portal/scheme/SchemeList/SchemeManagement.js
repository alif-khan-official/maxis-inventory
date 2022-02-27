import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";

class SchemeManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state ={
						"tableData"	: [],
						"actions"	: [{"actionCode": "VIEW"}]
					}
		;

		console.log("constructed");
        this.setInputValue	= this.setInputValue.bind	(this);
		this.newScheme		= this.newScheme.bind		(this);
		this.viewEntity		= this.viewEntity.bind		(this);
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

	newScheme() {
		this.props.history.push({ "pathname": "/new-scheme", "state": {}});
	}

	viewEntity(item) 
	{
		this.props.history.push({ "pathname": "/scheme-details", "state": { "item": item}});
		console.log("====item====");
		console.log(item);
	}

	async componentDidMount() 
	{
		console.log("mounting");
        const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {"userId": AuthUtil.getUserId(), "role": AuthUtil.getRole(0).code, "tenantId": AuthUtil.getTanentId()};
        try {
            fetch(gwUrl + "maxisservice-service/endpoint/scheme/get-scheme", {
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
							{	"name"			: "Id"			,	"selector"		: "id"						, "style":{"width": "250px"}},
							{	"name"			: "Created on"	,	"selector"		: "creationDate"			, "style":{"width": "150px"}},
							{	"name"			: "Issuer"		,	"selector"		: "creator.name"			, "style":{"width": "250px"}},
							{	"name"			: "Customer"	,	"selector"		: "customer.name"			, "style":{"width": "250px"}},
							{	"name"			: "Phone"		,	"selector"		: "customer.phoneNumber"	, "style":{"width": "150px"}},
							{	"name"			: "Amount"		,	"selector"		: "schemeAmount"			, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Count"		,	"selector"		: "schemeInstallmentCount"	, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Paid"		,	"selector"		: "installPaidCount"		, "style":{"width": "100px", "textAlign": "right"}},
							{	"name"			: "Status"		,	"selector"		: "completeStatus"			, "style":{"width": "100px"}},
						]
			;
		if (role === "Maxis-Services-MM-Administrator")
			columnData =[
							{	"name"			: "Id"			,	"selector"		: "id"						, "style":{"width": "250px"}},
							{	"name"			: "Created on"	,	"selector"		: "creationDate"			, "style":{"width": "150px"}},
							{	"name"			: "Branch"		,	"selector"		: "localMerchant.name"		, "style":{"width": "250px"}},
							{	"name"			: "Issuer"		,	"selector"		: "creator.name"			, "style":{"width": "250px"}},
							{	"name"			: "Customer"	,	"selector"		: "customer.name"			, "style":{"width": "250px"}},
							{	"name"			: "Phone"		,	"selector"		: "customer.phoneNumber"	, "style":{"width": "150px"}},
							{	"name"			: "Amount"		,	"selector"		: "schemeAmount"			, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Count"		,	"selector"		: "schemeInstallmentCount"	, "style":{"width": "150px", "textAlign": "right"}},
							{	"name"			: "Paid"		,	"selector"		: "installPaidCount"		, "style":{"width": "100px", "textAlign": "right"}},
							{	"name"			: "Status"		,	"selector"		: "completeStatus"			, "style":{"width": "100px"}},
						]
			;
		let tableData = this.state.tableData;
		let actions = this.state.actions;

		let componentDesign = 
			<div className="card">
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">Sale Management</div>
					</div>
				</div>

				<hr/>
				{	AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" &&
					<div className="p-grid p-fluid" style={{ "marginRight": "0rem" }}>
						<div className="p-col-6 p-lg-3 p-order-md-3">
							<Button label="New" onClick={() => this.newScheme()} className="p-button-raised p-button-info" />
						</div>
					</div>
					
				}

				{	AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" &&
					<hr/>
				}

				<div className="p-grid fixedwidth512" >
					<div className="datatable-filter-demo">
						<DataTable value={tableData} paginator rows={10} className="p-datatable-customers">
							{	columnData && 
								columnData.map	(	(value, index) =>	
													{
														if (index === 1)
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
										body=	{	(h) =>	<div className="p-d-flex">
																{	actions.map	(	(value, index) => 
																					{
																						return	<div key={index}>
																									<Button label="View" onClick={() => {this.viewEntity(h)}}/>											
																								</div>
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
export default withRouter(SchemeManagement);
