import { Dropdown } from 'primereact/dropdown';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import Picture from "../../../widgets/Picture";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import DateTimeComponentCreditSale from "./DateTimeComponentCreditSale";
import FileComponent from "../../../widgets/FileComponent"	;

class CreditSalesOfficerManagement extends React.Component {
	constructor(props) {
		super(props);
		this.obgwUrl= process.env.REACT_APP_ONBOARD_API_GW_HOST;
		this.msgwUrl= process.env.REACT_APP_SERVICE_API_GW_HOST;
		
		this.collectionList = {
			path: "maxisservice-service/endpoint/credit-collection/get-tenant-collection",
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
		this.addSalesAPI = {
			path: "maxisservice-service/endpoint/credit-sale/add",
			headers: {
				"Content-Type"	: "application/json",
				"token"			: "Bearer " + AuthUtil.getIdToken(),
				"userid"		: AuthUtil.getUserId(),
			}
		};
		this.addCollectionAPI = {
			path: "maxisservice-service/endpoint/credit-collection/add",
			headers: {
				"Content-Type"	: "application/json",
				"token"			: "Bearer " + AuthUtil.getIdToken(),
				"userid"		: AuthUtil.getUserId(),
			}
		};


		this.state	=	{	tableDataCollection	: [], 
							tableDataSales		: [], 
							tableDataSalesView		: [],
							tableDataCollectionView	: [],
							changeCustomerState	: "NONE", 
							selectedTab			: "NONE",
							salesTabStyle		: "p-col-6 p-lg-6 inactive-tab", 
							collectionTabStyle	: "p-col-6 p-lg-6 inactive-tab",
							collectionDate	: ""
						}
		;
		this.newSale	= this.newSale.bind(this)		;
		this.loadSales	= this.loadSales.bind(this)		;
		this.changeTab	= this.changeTab.bind(this)		;
		this.viewEntity	= this.viewEntity.bind(this)	;
		this.dateTemplate	= this.dateTemplate.bind(this)	;
		this.newCollection	= this.newCollection.bind(this)	;
		this.loadCustomers	= this.loadCustomers.bind(this)	;
		this.setInputValue	= this.setInputValue.bind(this)	;
		this.changeCustomer	= this.changeCustomer.bind(this);
		this.loadCollection= this.loadCollection.bind(this)	;
		this.viewEntitySales= this.viewEntitySales.bind(this)	;
		this.pictureTemplate= this.pictureTemplate.bind(this)	;
		this.booleanTemplate= this.booleanTemplate.bind(this)	;
		this.loadSalesOfficers		= this.loadSalesOfficers.bind(this)		;
		this.changeSalesOfficer		= this.changeSalesOfficer.bind(this)	;
		this.loadCustomerBalance	= this.loadCustomerBalance.bind(this)	;
		this.viewEntityCollection	= this.viewEntityCollection.bind(this)	;

		this.pageTitle = "Credit Issue | Collection";

		console.log("constructed");
	}

	newCollection() {
		if(this.state.customer === undefined || this.state.customer === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Customer is not selected");
			return;
		}
		if(this.state.collectionAmount === undefined || this.state.collectionAmount === "" || isNaN(this.state.collectionAmount))
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Amount is not available");
			return;
		}
		if(this.state.moneyReceiptNumber === undefined || this.state.moneyReceiptNumber === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Money receipt number is not available");
			return;
		}
		if(this.state.collectionDate === undefined || this.state.collectionDate === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Date is not available");
			return;
		}
		let saveOperation = {result: ""};
		this.setInputValue("saveOperation", saveOperation);
		
		console.log("saving");
		const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		let payLoad = {};
		payLoad.amount = this.state.collectionAmount	;
		payLoad.customer = this.state.customer		;
		payLoad.tenantId = AuthUtil.getTanentId();
		payLoad.userId = AuthUtil.getUserId();
		payLoad.receipt =  this.state.receipt;
		payLoad.collectionDate =  this.state.collectionDate;
		payLoad.moneyReceiptNumber =  this.state.moneyReceiptNumber;
		payLoad.handlerId =  this.state.selectedCustomer.handlerId;
		payLoad.followUpDate = this.state.followUpDate;
		payLoad.followUpAmount = this.state.followUpAmount;
		console.log(payLoad);
		try {
			fetch(gwUrl + this.addCollectionAPI.path, {
				"method"	: "POST",
				"headers"	: this.addCollectionAPI.headers,
				"body"		: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					if(result && result.status !== 200 && result.status !== "SUCCESS")
					{
						let saveOperation = {result: "FAILURE"};
						this.setInputValue("saveOperation", saveOperation);
						if (result && result.reason && result.reason === "Invalid Token or userId")
							this.setInputValue("failureMessage", "Your session has expired. Please login again.");
						else
							this.setInputValue("failureMessage", result.message? result.message : result.reason);
						this.setInputValue("saveOperation", result);
						return;
					}
					
					try {
						fetch(gwUrl + this.collectionList.path, {
								method	: "POST",
								headers	: this.collectionList.headers,
								body	: JSON.stringify(payLoad)
							})
								.then((res) => res.json())
								.then((json) => json)
								.then((result) => {
									this.setInputValue("tableDataCollection", result.creditCollection);
									let tableDataSalesView = [];
									let tableDataSales = result.creditCollection;
									
									for(let i = 0; tableDataSales && i < tableDataSales.length; i++)
									{
										if (tableDataSales[i].customer === this.state.selectedCustomer.userCode)
											tableDataSalesView.push(tableDataSales[i]);
									}
									
									this.setInputValue("tableDataCollectionView", tableDataSalesView);
									this.loadCustomerBalance(this.state.customer);
								});
					} catch (e) {
						console.log(e);
					}

					fetch(gwUrl + this.salesList.path, {
						method	: "POST",
						headers	: this.salesList.headers,
						body	: JSON.stringify({tenantId: AuthUtil.getTanentId()})
					})
						.then((res) => res.json())
						.then((json) => json)
						.then((result) => {
							this.setInputValue("tableDataSales", result.creditSales);
							let tableDataSalesView = [];
							let tableDataSales = result.creditSales;
							
							for(let i = 0; tableDataSales && i < tableDataSales.length; i++)
							{
								if (tableDataSales[i].customer === this.state.selectedCustomer.userCode && tableDataSales[i].paymentStatus === "DUE")
									tableDataSalesView.push(tableDataSales[i]);
							}
							
							this.setInputValue("tableDataSalesView", tableDataSalesView);
							this.loadCustomerBalance(this.state.customer);
						})
					;
					this.setInputValue("receipt", "");
					let saveOperation = {result: "SUCCESS"};
					this.setInputValue("saveOperation", saveOperation);
					this.setInputValue("failureMessage", "");
					return;
				});
		} catch (e) {
			console.log(e);
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", e.getMessage());
		}
		console.log("save operation finished");
	}

	newSale() {
		if(this.state.customer === undefined || this.state.customer === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Customer is not selected");
			return;
		}
		if(this.state.invoiceNumber === undefined || this.state.invoiceNumber === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Invoice number is not given");
			return;
		}
		if(this.state.invoiceAmount === undefined || this.state.invoiceAmount === "" || isNaN(this.state.invoiceAmount))
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Amount is not available");
			return;
		}
		if(this.state.invoiceDate === undefined || this.state.invoiceDate === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Invoice date is not selected");
			return;
		}
/*		if(this.state.followUpDate === undefined || this.state.followUpDate === "")
		{
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", "Followup date is not selected");
			return;
		}
*/		
		let saveOperation = {result: ""};
		this.setInputValue("saveOperation", saveOperation);
		
		console.log("saving");
		let gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
		let payLoad = {};
		payLoad.amount = this.state.invoiceAmount	;
		payLoad.customer = this.state.customer		;
		payLoad.invoiceNumber = this.state.invoiceNumber;
		payLoad.invoiceDate = this.state.invoiceDate;
		payLoad.followUpDate = this.state.followUpDate;
		payLoad.saleType = "CREDIT_SALE";
		payLoad.tenantId = AuthUtil.getTanentId();
		payLoad.userId = AuthUtil.getUserId();
		payLoad.receipt =  this.state.receipt;
		payLoad.handlerId =  this.state.selectedCustomer.handlerId;

		console.log(payLoad);
		try {
			fetch(gwUrl + this.addSalesAPI.path, {
				"method"	: "POST",
				"headers"	: this.addSalesAPI.headers,
				"body"		: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					if(result && result.status !== 200 && result.status !== "SUCCESS")
					{
						let saveOperation = {result: "FAILURE"};
						this.setInputValue("saveOperation", saveOperation);
						if (result && result.reason && result.reason === "Invalid Token or userId")
							this.setInputValue("failureMessage", "Your session has expired. Please login again.");
						else
							this.setInputValue("failureMessage", result.message? result.message : result.reason);
						this.setInputValue("saveOperation", result);

						return;
					}
					this.setInputValue("receipt", "");
					fetch(gwUrl + this.salesList.path, {
						method	: "POST",
						headers	: this.salesList.headers,
						body	: JSON.stringify({tenantId: AuthUtil.getTanentId()})
					})
						.then((res) => res.json())
						.then((json) => json)
						.then((result) => {
							this.setInputValue("tableDataSales", result.creditSales);
							let tableDataSalesView = [];
							let tableDataSales = result.creditSales;
							
							for(let i = 0; tableDataSales && i < tableDataSales.length; i++)
							{
								if (tableDataSales[i].customer === this.state.selectedCustomer.userCode && tableDataSales[i].paymentStatus === "DUE")
									tableDataSalesView.push(tableDataSales[i]);
							}
							
							this.setInputValue("tableDataSalesView", tableDataSalesView);
							this.loadCustomerBalance(this.state.customer);
						})
					;

					try {
						fetch(gwUrl + this.collectionList.path, {
								method	: "POST",
								headers	: this.collectionList.headers,
								body	: JSON.stringify(payLoad)
							})
								.then((res) => res.json())
								.then((json) => json)
								.then((result) => {
									this.setInputValue("tableDataCollection", result.creditCollection);
									let tableDataSalesView = [];
									let tableDataSales = result.creditCollection;
									
									for(let i = 0; tableDataSales && i < tableDataSales.length; i++)
									{
										if (tableDataSales[i].customer === this.state.selectedCustomer.userCode)
											tableDataSalesView.push(tableDataSales[i]);
									}
									
									this.setInputValue("tableDataCollectionView", tableDataSalesView);
									this.loadCustomerBalance(this.state.customer);
								});
					} catch (e) {
						console.log(e);
					}

					let saveOperation = {result: "SUCCESS"};
					this.setInputValue("saveOperation", saveOperation);
					this.setInputValue("failureMessage", "");
					return;
				});
		} catch (e) {
			console.log(e);
			let saveOperation = {result: "FAILURE"};
			this.setInputValue("saveOperation", saveOperation);
			this.setInputValue("failureMessage", e.getMessage());
		}
		console.log("save operation finished");
	}

	viewEntityCollection(rowData, column) {
		console.log("column");
		console.log(column);

		this.props.history.push({ pathname: "/credit-collection-details", state: {item: rowData}  });
	}

	pictureTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let receipt = rowData["receipt"];
		
		try{
			let receiptJSON = JSON.parse(receipt);
			let fileCode = receiptJSON.fileCode;
			let fileName = receiptJSON.fileName;
			let renderedString =	<Popup
										trigger={<Button className="button"> Memo </Button>}
										modal
										nested
									>
										{	(close) => 
											{
												let modal = 
															<Picture
																code={fileCode}
																name={fileName}
																close={close}
															>
															</Picture>
												;
												return modal;
											}
										}
									</Popup>
			;
			return renderedString;		
		}
		catch(e)
		{
			return "";
		}
	}

	booleanTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["active"];

		if (r)
			return "Yes";
		else
			return "";
	}

	changeTab(activeTab) {
		this.setInputValue("receipt", "");
		if(activeTab=== "SALES")
		{
			this.setInputValue("selectedTab", "SALES");
			this.setInputValue("salesTabStyle", "p-col-6 p-lg-6 active-tab");
			this.setInputValue("collectionTabStyle", "p-col-6 p-lg-6 inactive-tab");
		}
		else if(activeTab === "COLLECTION")
		{
			this.setInputValue("selectedTab", "COLLECTION");
			this.setInputValue("salesTabStyle", "p-col-6 p-lg-6 inactive-tab");
			this.setInputValue("collectionTabStyle", "p-col-6 p-lg-6 active-tab");
		}
	}

	viewEntity(rowData, column) {
		console.log("column");
		console.log(column);

		this.props.history.push({ pathname: "/credit-collection-details", state: {item: rowData}  });
	}

	viewEntitySales(item) {
		this.props.history.push({
			pathname: "/credit-sale-details",
			state: { item: item },
		});
		console.log("====item====");
		console.log(item);
	}

	changeSalesOfficer(selectedSalesOfficer) {
		this.setInputValue("selectedSalesOfficer", selectedSalesOfficer );
		let saveOperation = {result: ""};
		this.setInputValue("saveOperation", saveOperation);
		
		let so_customer = [];
		let customers = this.state.customers;
		
		for(let i = 0; customers && i < customers.length; i++)
		{
			let customer = customers[i];
			if (customer.handlerId === selectedSalesOfficer.userId)
			{
				so_customer.push(customer);
			}
		}
		
		this.setInputValue("so_customers", so_customer);
		
	}

	changeCustomer(selectedCustomer) {
		this.setInputValue("selectedCustomer"	, selectedCustomer	);
		this.setInputValue("changeCustomerState", "LOADING"			);
		this.setInputValue("tableDataCollectionView", []);
		this.setInputValue("tableDataSalesView"		, []);
		this.setInputValue("customerBalance"		, "");
		let saveOperation = {result: ""};
		this.setInputValue("saveOperation", saveOperation);
		
		if (this.state.selectedTab === "NONE")
		{
			this.setInputValue("selectedTab", "SALES");
			this.setInputValue("salesTabStyle", "p-col-6 p-lg-6 active-tab");
			this.setInputValue("collectionTabStyle", "p-col-6 p-lg-6 inactive-tab");
		}
		
		let tableDataSalesView = [];
		let tableDataSales = this.state.tableDataSales;
		
		for(let i = 0; tableDataSales && i < tableDataSales.length; i++)
		{
			if (tableDataSales[i].customer === selectedCustomer.userCode && tableDataSales[i].paymentStatus === "DUE")
				tableDataSalesView.push(tableDataSales[i]);
		}
		
		this.setInputValue("tableDataSalesView", tableDataSalesView);

		let tableDataCollectionView = [];
		let tableDataCollection = this.state.tableDataCollection;
		
		for(let i = 0; tableDataCollection && i < tableDataCollection.length; i++)
		{
			if (tableDataCollection[i].customer === selectedCustomer.userCode)
				tableDataCollectionView.push(tableDataCollection[i]);
		}
		
		this.setInputValue("tableDataCollectionView", tableDataCollectionView);

		this.setInputValue("changeCustomerState", "LOADED");
		this.setInputValue("customer", selectedCustomer.userCode);


		this.loadCustomerBalance(selectedCustomer.userCode);
	}

	async loadCustomerBalance(customer)
	{
		const payLoad = {"tanentId": customer};

		try {
			fetch(this.msgwUrl + "maxisservice-service/endpoint/entity-settings/get", {
				method	: "POST",
				headers	:	{
								"Content-Type"	: "application/json",
								"token"			: "Bearer " + AuthUtil.getIdToken(),
								"userid"		: AuthUtil.getUserId(),
							},
				body	: JSON.stringify(payLoad)
			})
				.then((res) => res.json())
				.then((json) => json)
				.then((result) => {
					try
					{
						this.setInputValue("customerBalance", result[0].ledgerSummary.toFixed(2));
					}
					catch(e)
					{
						
					}
				});
		} catch (e) {
					this.setInputValue("customerBalance", "");
			console.log(e);
		}
	}

	dateTemplate(rowData, column) {
		console.log("column");
		console.log(column);

		let r = rowData["creationTime"];

		let d = new Date(r);
		d = d.setTime(d.getTime() + (6 * 60 * 60 * 1000));
		d = new Date(d);
		let ret =	"" + d.getUTCFullYear() + "-" + 
					(d.getMonth() < 9? "0" : "") + (d.getMonth() + 1) + "-" + 
					(d.getDate() < 10? "0" : "") + (d.getDate() + 0) + " " +
					((d.getHours() < 10 || (d.getHours() > 12 && d.getHours() < 20))? "0" : "") + (d.getHours() > 12? (d.getHours() - 12):d.getHours()) + ":" +
					(d.getMinutes() < 10? "0" : "") + (d.getMinutes() + 0) + " " +
					(d.getHours() > 11? ("PM") : "AM")
		;
		return ret;
	}

	setInputValue(property, val) {
		this.setState({ [property]: val });
	}

	async loadSalesOfficers()
	{
		const payLoad = {"userId": AuthUtil.getUserId(), "accountId": AuthUtil.getUserId(), "role":"Maxis-Business-House-Sales-Officer", "onBoardingStatus": null};

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
					this.setInputValue("salesOfficers", result.result.response);
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
					this.setInputValue("tableDataSales", result.creditSales);
				});
		} catch (e) {
			console.log(e);
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
					this.setInputValue("tableDataCollection", result.creditCollection);
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
								this.setInputValue("customerOB", result.result.response);
								for(let i = 0; i < this.customers.length; i++)
								{
									for(let j = 0; j < this.customerOB.length; j++)
									{
										if (this.customers[i].userCode === this.customerOB[j].userId)
										{
											this.customers[i].name = this.customerOB[j].name; 
										}
									}
								}
							});
					} catch (e) {
						console.log(e);
					}
				});
		} catch (e) {
			console.log(e);
		}

	}

	componentDidMount() {
		console.log("mounting");

		this.loadSalesOfficers();
		this.loadCustomers();
		this.loadSales();
		this.loadCollection();
		console.log("mounted");
	}

	getComponentDesign() {
		let columnDataCollection =	[
										{
											name: "Entry Time",
											selector: "creationTime",
											style: { width: "200px" , textAlign: "right" },
										},
										{
											name: "Money receipt No.",
											selector: "moneyReceiptNumber",
											style: { width: "250px" },
										},
										{
											name: "Collection Date",
											selector: "collectionDate",
											style: { width: "200px" },
										},
										{
											name: "Collection Amount",
											selector: "amount",
											style: { width: "200px", textAlign: "right" },
										},
										{
											name: "Receipt",
											selector: "receipt",
											style: { width: "100px"},
										}
									]
		;
		let columnDataSales =	[
								{
									name: "Entry Time",
									selector: "creationTime",
									style: { width: "180px" , textAlign: "right" },
								},
								{
									name: "Invoice No.",
									selector: "invoiceNumber",
									style: { width: "150px" },
								},
								{
									name: "Invoice Date",
									selector: "invoiceDate",
									style: { width: "160px", textAlign: "right" },
								},
								{
									name: "Follow up",
									selector: "followUpDate",
									style: { width: "150px", textAlign: "right" },
								},
								{
									name: "Amount",
									selector: "amount",
									style: { width: "120px", textAlign: "right" },
								},
								{
									name: "Due",
									selector: "remainingAmount",
									style: { width: "120px", textAlign: "right" },
								},
								{
									name: "Memo",
									selector: "receipt",
									style: { width: "100px"},
								}
							]
		;

		let componentDesign = (
			<div className="card">
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header"></div>
					</div>
				</div>

				<hr />
				<div className="p-d-flex border">
					<div className="p-col-12 p-lg-12">
						<div className="table-header">{this.pageTitle}</div>
					</div>
				</div>

				<hr />

				<div className="p-d-flex border">
					<div className="p-col-2 p-lg-2">
						Sales Officer
					</div>
					<div className="p-col-3 p-lg-3">
						<Dropdown
	                        inputId="userId"
	                        value={this.state.selectedSalesOfficer ? this.state.selectedSalesOfficer : {}}
	                        options={this.state.salesOfficers ? this.state.salesOfficers.sort((a, b) => (a.name > b.name) ? 1 : -1) : []}
	                        onChange={(e) => { this.changeSalesOfficer(e.target.value) }}
	                        placeholder="Select Sales Officer"
	                        optionLabel="name" 
						/>
					</div>
					<div className="p-col-2 p-lg-2">
						
					</div>
					<div className="p-col-2 p-lg-2">
						Customer
					</div>
					<div className="p-col-3 p-lg-3">
						<Dropdown
	                        inputId="userId"
	                        value={this.state.selectedCustomer ? this.state.selectedCustomer : {}}
	                        options={this.state.so_customers ? this.state.so_customers.sort((a, b) => (a.userName > b.userName) ? 1 : -1) : []}
	                        onChange={(e) => { this.changeCustomer(e.target.value) }}
	                        placeholder="Select Customer"
	                        optionLabel="name" 
						/>
					</div>
				</div>
				
				<hr/>
				{	this.state.selectedSalesOfficer && this.state.selectedCustomer && 
					<div className="border p-col-12 p-lg-12">
						<div className="p-d-flex border">
							<div className="p-col-4 p-lg-4">
								<h4>Sales Officer</h4>
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-4 p-lg-4">
								<h4>Customer</h4>
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Sales officer name
							</div>
							<div className="p-col-2 p-lg-2">
								{this.state.selectedSalesOfficer?.name}
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
								Customer name
							</div>
							<div className="p-col-2 p-lg-2">
								{this.state.selectedCustomer?.name}
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Sales officer phone
							</div>
							<div className="p-col-2 p-lg-2">
								{this.state.selectedSalesOfficer?.phoneNumber}
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
								Customer phone
							</div>
							<div className="p-col-2 p-lg-2">
								{this.state.selectedCustomer?.userCode}
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								
							</div>
							<div className="p-col-2 p-lg-2">
								
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
								Ledger status
							</div>
							<div className="p-col-2 p-lg-2">
								{this.state.customerBalance}
							</div>
						</div>
					</div>
				}

				<hr/>
				{
					this.state.changeCustomerState === "LOADING" && 
					<div className="loading">
						<h3>Loading ... </h3>
					</div>
				}
				{
					this.state.changeCustomerState === "LOADED" && 
					<div className="p-d-flex border">
						<div className={this.state.salesTabStyle} onClick={() => {this.changeTab("SALES");}}>
							Issue
						</div>
						<div className={this.state.collectionTabStyle} onClick={() => {this.changeTab("COLLECTION");}}>
							Collection
						</div>
					</div>
				}
				{
					this.state.changeCustomerState === "LOADED" && 
					this.state.selectedTab === "SALES" && 
					<div className="border p-col-12 p-lg-12">
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Invoice number
							</div>
							<div className="p-col-2 p-lg-2">
								<input
			                        className="form-input"
			                        type="text"
			                        placeholder="Invoice number"
			                        value={this.state.invoiceNumber}
			                        id="invoiceNumber"
			                        onChange={(e) => this.setInputValue("invoiceNumber", e.target.value)}
			                    >
			                    </input>
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
								Credit issue amount
							</div>
							<div className="p-col-2 p-lg-2">
								<input
			                        className="form-input"
			                        type="text"
			                        placeholder="Credit issue amount"
			                        value={this.state.invoiceAmount}
			                        id="amount"
			                        onChange={(e) => this.setInputValue("invoiceAmount", e.target.value)}
			                    >
			                    </input>
							</div>
						</div>
						<br/>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Invoice date
							</div>
							<div className="p-col-2 p-lg-2">
								<DateTimeComponentCreditSale
									value			= {this.state.invoiceDate}
									rootComponent	= {this}
									readOnly		= {false}
									code			= "invoiceDate"
								/>
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
								Followup date
							</div>
							<div className="p-col-2 p-lg-2">
								<DateTimeComponentCreditSale
									value			= {this.state.followUpDate}
									rootComponent	= {this}
									readOnly		= {false}
									code			= "followUpDate"
								/>
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Invoice
							</div>
							<div className="p-col-3 p-lg-3">
								<FileComponent
									contextComponent= {this}
									fieldComponent	= {{"code": "receipt", "value": {"fileName" : "Choose a file", "fileCode": ""}}}
									rootComponent	= {this}
									readOnly		= {false}
								/> 
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-1 p-lg-1">
								<Button
									label="Save"
									onClick={() => this.newSale()}
									className="p-button-raised p-button-info"
								/>
							</div>
						</div>
					</div>
				}
				{
					this.state.changeCustomerState === "LOADED" && 
					this.state.selectedTab === "COLLECTION" && 
					<div className="border p-col-12 p-lg-12">
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Money Receipt No.
							</div>
							<div className="p-col-2 p-lg-3">
								<input
			                        className="form-input"
			                        type="text"
			                        placeholder="Money Receipt Number"
			                        value={this.state.moneyReceiptNumber}
			                        id="amount"
			                        onChange={(e) => this.setInputValue("moneyReceiptNumber", e.target.value)}
			                    >
			                    </input>
							</div>
							<div className="p-col-2 p-lg-1">
							</div>
							<div className="p-col-2 p-lg-2">
								Collection amount
							</div>
							<div className="p-col-2 p-lg-2">
								<input
			                        className="form-input"
			                        type="text"
			                        placeholder="Deposit amount"
			                        value={this.state.collectionAmount}
			                        id="collectionAmount"
			                        onChange={(e) => this.setInputValue("collectionAmount", e.target.value)}
			                    >
			                    </input>
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Collection Date
							</div>
							<div className="p-col-2 p-lg-2">
								<DateTimeComponentCreditSale
									value			= {this.state.collectionDate}
									rootComponent	= {this}
									readOnly		= {false}
									code			= "collectionDate"
								/>
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Followup date
							</div>
							<div className="p-col-2 p-lg-2">
								<DateTimeComponentCreditSale
									value			= {this.state.followUpDate}
									rootComponent	= {this}
									readOnly		= {false}
									code			= "followUpDate"
								/>
							</div>
							<div className="p-col-2 p-lg-1">
							</div>
							<div className="p-col-2 p-lg-2">
								Followup amount
							</div>
							<div className="p-col-2 p-lg-2">
								<input
			                        className="form-input"
			                        type="text"
			                        placeholder="Followup amount"
			                        value={this.state.followUpAmount}
			                        id="followUpAmount"
			                        onChange={(e) => this.setInputValue("followUpAmount", e.target.value)}
			                    >
			                    </input>
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-2 p-lg-2">
								Money Receipt
							</div>
							<div className="p-col-2 p-lg-3">
								<FileComponent
									contextComponent= {this}
									fieldComponent	= {{"code": "receipt", "value": {"fileName" : "Choose a file", "fileCode": ""}}}
									rootComponent	= {this}
									readOnly		= {false}
								/> 
							</div>
							<div className="p-col-2 p-lg-1">
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
							<div className="p-col-2 p-lg-2">
							</div>
						</div>
						<div className="p-d-flex border">
							<div className="p-col-1 p-lg-1">
								<Button
									label="Save"
									onClick={() => this.newCollection()}
									className="p-button-raised p-button-info"
								/>
							</div>
						</div>
					</div>
				}
				<hr/>
				{this.state.saveOperation && this.state.saveOperation.result === "SUCCESS" && (
					<div className="divsuccess">
						<div
							width="100%"
							style={{
								textAlign: "left",
								backgroundColor: "#22cc22",
								color: "#ffffff",
							}}
						>
							<h5>
								<span role="img" aria-labelledby="panda1">
									✅
								</span>
								Operation successful.
							</h5>
						</div>
						<hr />
					</div>
				)}

				{this.state.saveOperation && (this.state.saveOperation.result === "FAILURE" || this.state.saveOperation.status === 500 || this.state.saveOperation.status === 400) && (
					<div className="divfailure">
						<div
							width="100%"
							style={{
								textAlign: "left",
								backgroundColor: "#ff7777",
								color: "#ffffff",
							}}
						>
							<h5>
								<span role="img" aria-labelledby="panda1">
									❌
								</span>
								{this.state.failureMessage}
							</h5>
						</div>
						<hr />
					</div>
				)}
				{
					this.state.changeCustomerState === "LOADED" && 
					this.state.selectedTab === "SALES" && 
						<div className="div-horizontal-scroll">
							<DataTable
								value={this.state.tableDataSalesView}
								paginator
								rows={8}
								className="p-datatable-customers"
							>
								{columnDataSales &&
									columnDataSales.map((value, index) => {
										if (index === 0)
											return (
												<Column
													key={index}
													field={value.selector}
													header={value.name}
													style={value.style}
													sortable={true}
													filter
													filterPlaceholder="Search here"
													filterMatchMode="contains"
													body={this.dateTemplate}
												/>
											);
										else if (index === 6)
											return (
												<Column
													key={index}
													field={value.selector}
													header={value.name}
													style={value.style}
													body={this.pictureTemplate}
												/>
											);
										else
											return (
												<Column
													key={index}
													field={value.selector}
													header={value.name}
													style={value.style}
													sortable={true}
													filter
													filterPlaceholder="Search here"
													filterMatchMode="contains"
												/>
											);
									})}
								<Column
									header="Details"
									style={{ width: "100px" }}
									body={(h) => (
										<div className="p-d-flex">
											<div >
												<Button
													label="Details"
													onClick={() => {
														this.viewEntitySales(h);
													}}
												/>
											</div>
										</div>
									)}
								/>
							</DataTable>
						</div>
				}
				{
					this.state.changeCustomerState === "LOADED" && 
					this.state.selectedTab === "COLLECTION" && 
						<div className="div-horizontal-scroll">
							<DataTable
								value={this.state.tableDataCollectionView}
								paginator
								rows={8}
								className="p-datatable-customers"
							>
								{columnDataCollection &&
									columnDataCollection.map((value, index) => {
										if (index === 0)
											return (
												<Column
													key={index}
													field={value.selector}
													header={value.name}
													style={value.style}
													sortable={true}
													filter
													filterPlaceholder="Search here"
													filterMatchMode="contains"
													body={this.dateTemplate}
												/>
											);
										else if (index === 4)
											return (
												<Column
													key={index}
													field={value.selector}
													header={value.name}
													style={value.style}
													filterPlaceholder="Search here"
													filterMatchMode="contains"
													body={this.pictureTemplate}
												/>
											);
										else
											return (
												<Column
													key={index}
													field={value.selector}
													header={value.name}
													style={value.style}
													sortable={true}
													filter
													filterPlaceholder="Search here"
													filterMatchMode="contains"
												/>
											);
									})}
								<Column
									header="Action"
									style={{ width: "256px" }}
									body={(h) => (
										<div className="p-d-flex">
											<div >
												<Button
													label="View"
													onClick={() => {
														this.viewEntityCollection(h);
													}}
												/>
											</div>
										</div>
									)}
								/>
							</DataTable>
						</div>
				}
				<br />
			</div>
		);
		return componentDesign;
	}
	
	render() {
		let componentDesign = this.getComponentDesign();
		return <MainComponent component={componentDesign} />;
	}
}
export default withRouter(CreditSalesOfficerManagement);
