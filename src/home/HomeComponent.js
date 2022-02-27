import React from 'react';
import { withRouter } from 'react-router-dom';
import MainComponent from '../common/MainComponent'

import AuthUtil from "../auth/AuthUtil";

import '../App.css'

class HomeComponent extends React.Component {
	constructor(props) {
		super(props);
		this.obgwUrl= process.env.REACT_APP_ONBOARD_API_GW_HOST;
		this.msgwUrl= process.env.REACT_APP_SERVICE_API_GW_HOST;

		let today = new Date();
		let year	= today.getFullYear();
		let month	= today.getMonth();
		month = month + 1;
		if (month < 10)
			month = "0" + month;
		else
			month = "" + month;
		let day		= today.getDate();
		if (day < 10)
			day = "0" + day;
		else
			day = "" + day;
		
		this.todayString = year + "-" + month + "-" + day;

		this.collectionList = {
			path: "maxisservice-service/endpoint/credit-collection/get-tenant-collection",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};

		this.soSummary = {
			path: "maxisservice-service/endpoint/entity/sosummary",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};

		this.salesList = {
			path: "maxisservice-service/endpoint/credit-sale/get-tenant-sale",
			headers: {
				"Content-Type": "application/json",
				token: "Bearer " + AuthUtil.getIdToken(),
				userid: AuthUtil.getUserId(),
			},
		};

		this.loadSales	= this.loadSales.bind(this)	;
		this.loadCustomers	= this.loadCustomers.bind(this)	;
		this.setInputValue	= this.setInputValue.bind(this)	;
		this.loadCollection	= this.loadCollection.bind(this);
		this.loadSOSummary	= this.loadSOSummary.bind(this);
		
		this.state={customerCount: 0, totalDue: 0.00, todayTarget: 0.00, todayCollection: 0.00};
		
		this.roleName = AuthUtil.getUserDetails().role[0].name;
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	componentDidMount() {
		if (this.roleName === "Maxis-Business-House-Admin")
		{
			this.loadCustomers();
			this.loadSales();
			this.loadCollection();
		}
		else if (this.roleName === "Maxis-Business-House-Sales-Officer")
		{
			this.loadSOSummary();
		}
	}
	
	async loadCollection()
	{
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		let payLoad = {
			tenantId: AuthUtil.getTanentId()
		};
		console.log(payLoad);
		try {
			fetch(gwUrl + this.collectionList.path, {
				method	: "POST",
				headers	: this.collectionList.headers,
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					let collections = result.creditCollection;
					let totalCollection = 0.00;
					for(let i = 0; i < collections.length; i++)
					{
						let collection = collections[i];
						let amount = 0;
						let time = "";
						try
						{
							time = collection.creationTime.substring(0, 10);
						}
						catch(e)
						{
							time = collection.collectionDate;
						}
						try
						{
							amount = collection.amount - 0;	
						}
						catch(e)
						{
							
						}
						if (time === this.todayString)
						{
								totalCollection = (totalCollection - 0) + amount;	
						}
					}
					this.setInputValue("todayCollection", (totalCollection.toFixed(2) + " BDT"));
				});
		} catch (e) {
			console.log(e);
		}
	}

	async loadSOSummary()
	{
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		let payLoad = {
			userId: AuthUtil.getUserId(),
			tanentId: AuthUtil.getTanentId()
		};
		console.log(payLoad);
		try {
			fetch(gwUrl + this.soSummary.path, {
				method	: "POST",
				headers	: this.collectionList.headers,
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					console.log(result);
					
					let ach = 0 - 0 + (result.achieved / 1) - 0;
					let tgt = 0 - 0 + (result.target / 1) - 0;
					this.setInputValue("customerCount", result.followUps);
					this.setInputValue("totalDue", tgt.toFixed(2));
					this.setInputValue("todayTarget", result.done);
					this.setInputValue("todayCollection", ach.toFixed(2));
				});
		} catch (e) {
			console.log(e);
		}
	}

	async loadSales()
	{
		const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		const payLoad = {
			tenantId: AuthUtil.getTanentId()
		};
		console.log(payLoad);
		try {
			fetch(gwUrl + this.salesList.path, {
				method	: "POST",
				headers	: this.salesList.headers,
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					let sales = result.creditSales;
					let totalDue = 0.00;
					let todayTarget = 0.00;
					for(let i = 0; i < sales.length; i++)
					{
						let sale = sales[i];
						if (sale.paymentStatus === "DUE")
						{
							let amount = (sale.remainingAmount - 0).toFixed(2);
							totalDue = ((totalDue - 0) + (amount - 0)) - 0;
							
							if (sale.followUpDate === this.todayString)
							{
								todayTarget = ((todayTarget - 0) + (amount - 0)) - 0;
							}							
						}
					}
					this.setInputValue("todayTarget", (todayTarget + " BDT"));
					this.setInputValue("totalDue", (totalDue + " BDT"));
				});
		} catch (e) {
			console.log(e);
		}
	}

	async loadCustomers()
	{
		let payLoad = {"userId": AuthUtil.getUserId(), "accountId": AuthUtil.getUserId(), "role":"Maxis-Services-LM-Customer", "onBoardingStatus": null};

		try {
			fetch(this.msgwUrl + "maxisservice-authorization-service/endpoint/api/user/list-partner-role", {
				method	: "POST",
				headers	:	{
								"Content-Type": "application/json",
								"token": "Bearer " + AuthUtil.getIdToken(),
								"userid": AuthUtil.getUserId()
							},
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					this.customers = result;
					this.setInputValue("customers", result);
					
					payLoad = {"userId": AuthUtil.getUserId(), "accountId": AuthUtil.getUserId(), "role":"Maxis-Services-LM-Customer", "onBoardingStatus": null};
			
					try {
						fetch(this.obgwUrl + "authorization-service/endpoint/user/list-partner-role", {
							method	: "POST",
							headers	:	{
											"Content-Type": "application/json",
											"token": "Bearer " + AuthUtil.getIdToken()
										},
							body	: JSON.stringify(payLoad)
						})
							.then((res) => res.json())
							.then((json) => json)
							.then((result) => {
								this.customerOB = result.result.response;
								this.setInputValue("customerCount", this.customers.length);
							});
					} catch (e) {
						console.log(e);
					}
				});
		} catch (e) {
			console.log(e);
		}

	}

    getComponentDesign() {
        let componentDesign = <div className="card">
            <div className="p-fluid">
                <div className="p-col-12 p-lg-6">
                    <h3 className="centerText">DASHBOARD</h3>
                </div>
                {
					(this.roleName === "Maxis-Business-House-Admin" || this.roleName === "Maxis-Business-House-Sales-Officer") && 
	                <div className="p-col-12 p-lg-6">
	                    <h4 className="centerText">Summary</h4>
	                </div>
				}
                {
					(this.roleName === "Maxis-Business-House-Sales-Officer") && 
	                <div className="p-col-12 p-lg-12">
						<table>
							<tbody>
								<tr><td>Followups	</td><td>:</td><td>{this.state.customerCount	}</td></tr>
								<tr><td>Target		</td><td>:</td><td>{this.state.totalDue			}</td></tr>
								<tr><td>Done		</td><td>:</td><td>{this.state.todayTarget		}</td></tr>
								<tr><td>Achieved	</td><td>:</td><td>{this.state.todayCollection	}</td></tr>
							</tbody>
						</table>
	                </div>
				}
                {
					(this.roleName === "Maxis-Business-House-Admin") && 
	                <div className="p-col-12 p-lg-12">
						<table>
							<tbody>
								<tr><td>Total credit customers			</td><td>:</td><td>{this.state.customerCount	}</td></tr>
								<tr><td>Total due						</td><td>:</td><td>{this.state.totalDue			}</td></tr>
								<tr><td>Today's target collection amount</td><td>:</td><td>{this.state.todayTarget		}</td></tr>
								<tr><td>Today's collection amount		</td><td>:</td><td>{this.state.todayCollection	}</td></tr>
							</tbody>
						</table>
	                </div>
				}
            </div>

        </div>
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign()
        return <MainComponent component={componentDesign} />;
    }

}

export default withRouter(HomeComponent);