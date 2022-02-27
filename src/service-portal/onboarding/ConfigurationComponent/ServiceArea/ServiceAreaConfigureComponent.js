import React from 'react';
import { withRouter } from 'react-router-dom';
import MainComponent from '../../../../common/MainComponent';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { PickList } from 'primereact/picklist';
import AuthUtil from '../../../../auth/AuthUtil';
import '../../../../App.css';
//import GeneralConstants from '../../../../constants/GeneralConstants';
class ServiceAreaConfigureComponent extends React.Component {
	constructor(props) {
		super(props);
		let receivedData = this.props.location.state;
		console.log("====RECEIVED====: ", receivedData);

		let meta = receivedData.configs.meta;

		let api = [];
		if (meta) {
			for (let i = 0; i < meta.length; i++) {
				api[meta[i].code] = { "api": meta[i].api, "type": meta[i].apiMethod };
			}
		}
		console.log("api: ", api);
		if (receivedData) {
			this.state = {
				apiList: api,
				receivedRowData2: receivedData.item2, //selected entity
				receivedRowData: receivedData.item,
				receivedConfigs: receivedData.configs,
				receivedMeta: receivedData.configs.meta,
				actionMode: receivedData.mode,
				entityDetail: receivedData.entityDetail,
				saName: receivedData.item ? receivedData.item.property4 : '',

				thana: [],
				district: [],
				serviceProperty: receivedData.item ? receivedData.item.property5 : [],
				servicePropertyValue: [],


				districtSourceData: [],
				districtTargetData: [],

				thanaSourceData: [],
				thanaTargetData: receivedData.item ? receivedData.item.property6 : [],


				createdBy: AuthUtil.getUserId(),
				modifiedBy: '',
				saveBtnClick: false
			}
		} else {
			this.state = {
				apiList: [],
				receivedRowData: {},
				receivedMeta: [],

				saName: '',

				thana: [],
				district: [],
				serviceProperty: [],

				districtSourceData: [],
				districtTargetData: [],

				thanaSourceData: [],
				thanaTargetData: [],

				createdBy: AuthUtil.getUserId(),
				modifiedBy: '',
				saveBtnClick: false
			}
		}
	}

	setInputValue(property, val) {
		this.setState({
			[property]: val
		})
	}


	checkObject(obj) {
		let flag = true;
		if (obj === undefined) return false;

		for (var key in obj) {
			if (obj[key] === undefined || obj[key] === null || obj[key] === '' || obj[key] === "") {
				flag = false;
			}
		}
		return flag;
	}

	async loadFilterDistrictThana() {
		const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;
		console.log("====loadFilterDistrictThana====");
		console.log(this.state.thana);
		try {
			// eslint-disable-next-line
			let userDetail = {};

			let taggedWarehouseId = "";

			// eslint-disable-next-line
			let taggedWarehouse = {};

			let userId = this.state.receivedRowData2.userId;
			console.log(userId);
			if (this.state.receivedConfigs.entityMOBRoleCode === "MAXISELLPDDELIVERYRIDER") {
				let resRider = await fetch(gwUrl + "elog-service/endpoint/maxisellpdeliveryrider/get", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'token': 'Bearer ' + AuthUtil.getIdToken(),
						'userid': AuthUtil.getUserId()
					},
					body: JSON.stringify({ "code": userId })
				});

				let riderList = await resRider.json();

				for (let i = 0; riderList !== undefined && i < riderList.length; i++) {
					if (riderList[i].taggedWarehouse === undefined || riderList[i].taggedWarehouse === null || riderList[i].taggedWarehouse.code === undefined || riderList[i].taggedWarehouse.code === null || riderList[i].taggedWarehouse.code === "") {
					}
					else {
						userDetail = riderList[i];
						taggedWarehouseId = riderList[i].taggedWarehouse.code;
						taggedWarehouse = riderList[i].taggedWarehouse;
						break;
					}
				}
			}

			if (this.state.receivedConfigs.entityMOBRoleCode === "MAXISELLPDDELIVERYPNDC") {
				let resPNDC = await fetch(gwUrl + "elog-service/endpoint/maxisellpdeliverypndc/get", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'token': 'Bearer ' + AuthUtil.getIdToken(),
						'userid': AuthUtil.getUserId()
					},
					body: JSON.stringify({ "code": userId })
				});

				let pndcList = await resPNDC.json();

				for (let i = 0; pndcList !== undefined && i < pndcList.length; i++) {
					if (pndcList[i].taggedWarehouse === undefined || pndcList[i].taggedWarehouse === null || pndcList[i].taggedWarehouse.code === undefined || pndcList[i].taggedWarehouse.code === null || pndcList[i].taggedWarehouse.code === "") {
					}
					else {
						userDetail = pndcList[i];
						taggedWarehouseId = pndcList[i].taggedWarehouse.code;
						taggedWarehouse = pndcList[i].taggedWarehouse;
						break;
					}
				}
			}

			if (taggedWarehouseId === undefined || taggedWarehouseId === null || taggedWarehouseId === "") {
				return;
			}
			else {
				console.log("====taggedWarehouseId====");
				console.log(taggedWarehouseId);
			}

			if (this.state.receivedConfigs.entityMOBRoleCode === "MAXISELLPDDELIVERYRIDER" || this.state.receivedConfigs.entityMOBRoleCode === "MAXISELLPDDELIVERYPNDC") {
				let warehouseThanaListRequest = await fetch(gwUrl + "elog-service/endpoint/configuration/get-w-thana-list", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json',
						'token': 'Bearer ' + AuthUtil.getIdToken(),
						'userid': AuthUtil.getUserId()
					},
					body: JSON.stringify({ "property2": taggedWarehouseId })
				});

				let warehouseThanaListResponse = await warehouseThanaListRequest.json();

				console.log("====warehouseThanaListResponse====");
				console.log(warehouseThanaListResponse);
				this.setState({ "thana": warehouseThanaListResponse });
			}
		}
		catch (e) {
			console.log("ServiceAreaConfigureComponent: role based filtering district thana load error");
		}

	}

	componentDidMount() {
		const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

		// eslint-disable-next-line
		let userRole = AuthUtil.getRoleList();

		try {
			fetch(gwUrl + this.state.apiList['DISTRICT'].api.substring(1), {
				method: this.state.apiList['DISTRICT'].type,
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken(),
					'userid': AuthUtil.getUserId()
				},
			})
				.then(res => res.json())
				.then(json => json.districts)
				.then(result => {
					try {

						if (this.state.receivedRowData.length === 0) {

							this.setState({
								'district': result,
								'districtSourceData': result
							});
						} else {

							console.log(this.state.receivedRowData);
							let selectedThanas = this.state.receivedRowData.property6;
							let sourceDist = [];
							let targetDist = [];
							sourceDist = result.filter(function (d) {
								return !selectedThanas.find(function (t) {
									return d.id === t.districtId
								})
							});

							targetDist = result.filter(function (d) {
								return selectedThanas.find(function (t) {
									return d.id === t.districtId
								})
							});

							this.setState({
								'district': result,
								'districtSourceData': sourceDist
							});
							this.setTarget(targetDist, "DISTRICT");
						}




					} catch (error) {
						this.setState({
							'district': [],
							'districtSourceData': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}

		try {
			fetch(gwUrl + this.state.apiList['THANA'].api.substring(1), {
				method: this.state.apiList['THANA'].type,
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken(),
					'userid': AuthUtil.getUserId()
				},
			})
				.then(res => res.json())
				.then(json => json.thanas)
				.then(result => {
					try {
						this.setState({
							'thana': result
						});
						this.loadFilterDistrictThana();
					} catch (error) {
						console.log(error);
						this.setState({
							'thana': []
						});
					}
				})
		}
		catch (e) {
			console.log(e)
		}

		try {
			fetch(gwUrl + this.state.apiList['SERVICE-PROPERTY'].api.substring(1), {
				method: this.state.apiList['SERVICE-PROPERTY'].type,
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken(),
					'userid': AuthUtil.getUserId()
				},
			})
				.then(res => res.json())
				.then(json => json)
				.then(result => {
					try {
						let spList = this.state.serviceProperty;
						if (spList && spList.length > 0) {
							for (let i = 0; i < spList.length; i++) {

								if (spList[i].value) {
									for (let j = 0; j < result.length; j++) {
										if (spList[i].code === result[j].code) {
											result[j]['value'] = spList[i].value;
										}
									}
								}
							}
						}
						this.setState({
							'serviceProperty': result
						});
					} catch (error) {
						console.log(error);
						this.setState({
							'serviceProperty': []
						});
					}
				})

		}
		catch (e) {
			console.log(e)
		}

	}

	loadThanaInAvailableBox() {
		let allThana = this.state.thana;
		let selectedDistricts = this.state.districtTargetData;
		let thanaListForSource = this.state.thanaSourceData;
		let selectedThanas = this.state.thanaTargetData;

		thanaListForSource = allThana.filter(function (t) {
			return selectedDistricts.find(function (d) {
				return d.id === t.districtId
			})
		});

		if (selectedThanas && selectedThanas.length > 0) {
			thanaListForSource = thanaListForSource.filter(function (t) {
				return !selectedThanas.find(function (st) {
					return st.id === t.id
				})
			});
		}
		return thanaListForSource;
	}

	loadThanaInSelectedBox() {
		let selectedDistricts = this.state.districtTargetData;
		let selectedThanas = this.state.thanaTargetData;
		let thanaListForTarget = [];
		if (selectedThanas && selectedThanas.length > 0) {
			thanaListForTarget = selectedThanas.filter(function (t) {
				return selectedDistricts.find(function (d) {
					return d.id === t.districtId
				})
			});
		}

		return thanaListForTarget;
	}

	async save() {
		let selectedThana = this.loadThanaInSelectedBox();

		let servicePropertyList = this.state.serviceProperty;
		for (let i = 0; i < servicePropertyList.length; i++) {
			if (this.state[servicePropertyList[i].code]) {
				servicePropertyList[i]['value'] = this.state[servicePropertyList[i].code];
			}
		}

		let payload = {
			"property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
			"property2": this.state.receivedRowData2.userId, //newEnterpriseEntityId
			"property3": this.state.receivedConfigs.configurationType, //ConfigurationType
			"property4": this.state.saName, //serviceAreaName
			"property5": servicePropertyList, //newServicePropertyList
			"property6": selectedThana //newThanaList
		}
		if (this.state.receivedRowData) {
			payload['id'] = this.state.receivedRowData.id
		}
		if (payload.property2 === undefined)
			payload.property2 = payload.property1;

		const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;
		//const gwUrl = 'http://192.168.0.27:8090/api/';
		try {
			let res = await fetch(gwUrl + this.state.receivedConfigs.addAPI.substring(1), {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'token': 'Bearer ' + AuthUtil.getIdToken(),
					'userid': AuthUtil.getUserId()
				},
				body: JSON.stringify(payload)
			});

			let response = await res.json();
			let routeBack = this.props.location.state.routeBack;
			if (routeBack === undefined || routeBack === null || routeBack === "") {
				routeBack = "configure"
			}
			if (response) {
				this.props.history.push({ "pathname": "/" + routeBack, "state": { "item": this.state.receivedRowData2, "entityDetail": this.state.entityDetail } });
			}
		} catch (e) {
			console.log(e);
		}

	}

	setSource(data, itemType) {
		if (itemType === "THANA") {
			this.setState({
				thanaSourceData: data
			});
		}
		if (itemType === "DISTRICT") {
			this.setState({
				districtSourceData: data
			});
		}
	}

	setTarget(data, itemType) {
		if (itemType === "THANA") {
			this.setState({
				thanaTargetData: data
			});
		}
		if (itemType === "DISTRICT") {
			this.setState({
				districtTargetData: data
			});
		}
	}

	onChange(event, itemType) {
		this.setTarget(event.target, itemType);
		this.setSource(event.source, itemType);
	}

	itemTemplate(item) {
		return (
			<div className="product-item">
				<div className="product-list-detail">
					<h5 className="p-mb-2">{item.displayName}</h5>
				</div>
			</div>
		);
	}

	getComponentDesign() {

		let servicePropertyList = this.state.serviceProperty;

		let componentDesign = <div className="card">
			<div className="p-d-flex border">
				<div className="p-col-12 p-lg-12">
					<div className="table-header">Service Area Configuration</div>
				</div>
			</div>

			<div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>

				<div className="p-col-6 p-lg-4">
					<label htmlFor="saName" className="p-col-6 p-md-2">Service Area Name</label>
					<div className="p-col-6 p-md-12">
						<InputText
							id="saName"
							value={this.state.saName !== undefined && this.state.saName !== null ? this.state.saName : ''}
							onChange={(e) => this.setState({ saName: e.target.value })}
							type="text" />
					</div>

					{servicePropertyList && servicePropertyList.length > 0 && servicePropertyList.map((sProperty, index) => {
						return <div key={index}>
							<label htmlFor={sProperty.code} className="p-col-6 p-md-2">{sProperty.displayName}</label>
							<div className="p-col-6 p-md-12">
								<InputText
									id={sProperty.code}
									value={this.state[sProperty.code] !== undefined && this.state[sProperty.code] !== null ? this.state[sProperty.code] : sProperty.value}
									onChange={(e) => this.setInputValue(sProperty.code, e.target.value)}
									type="text" />
							</div>
						</div>
					})}
				</div>

				<div className="p-col-12 p-lg-4">

					<label htmlFor="district" className="p-col-12 p-md-2">Choose District</label>
					<div className="p-col-12 p-md-12">
						<PickList
							source={this.state.districtSourceData ? this.state.districtSourceData.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1) : []}
							target={this.state.districtTargetData}
							itemTemplate={this.itemTemplate}
							sourceHeader="Available"
							targetHeader="Selected"
							sourceStyle={{ height: '320px' }} targetStyle={{ height: '320px' }}
							showSourceControls={false}
							showTargetControls={false}
							onChange={(e) => { this.onChange(e, "DISTRICT"); }}>
						</PickList>
					</div>

				</div>

				<div className="p-col-12 p-lg-4">

					<label htmlFor="thana" className="p-col-12 p-md-2">Choose Thana</label>
					<div className="p-col-12 p-md-12">
						<PickList
							source={this.loadThanaInAvailableBox() ? this.loadThanaInAvailableBox().sort((a, b) => (a.displayName > b.displayName) ? 1 : -1) : []}
							target={this.loadThanaInSelectedBox() ? this.loadThanaInSelectedBox().sort((a, b) => (a.displayName > b.displayName) ? 1 : -1) : []}
							itemTemplate={this.itemTemplate}
							sourceHeader="Available"
							targetHeader="Selected"
							sourceStyle={{ height: '320px' }} targetStyle={{ height: '320px' }}
							showSourceControls={false}
							showTargetControls={false}
							onChange={(e) => this.onChange(e, "THANA")}>
						</PickList>
					</div>


					<div className="p-col-12 p-lg-5" style={{ marginLeft: "auto" }}>
						{this.state.actionMode === "ADD" && <Button label="Save" onClick={(e) => {
							this.setState({ saveBtnClick: true });
							this.save();
						}} className="p-button-raised" />}

						{this.state.actionMode === "VIEW" && <Button label="Back" onClick={(e) => {
							this.props.history.push({ "pathname": "/configure", "state": { "item": this.state.receivedRowData2, "entityDetail": this.state.entityDetail } });
						}} className="p-button-raised" />}

						{this.state.actionMode === "EDIT" && <Button label="Edit" onClick={(e) => {
							this.setState({ saveBtnClick: true });
							this.save();
						}} className="p-button-raised" />}

					</div>

				</div>

			</div>
		</div>
		return componentDesign;
	}

	render() {
		let componentDesign = this.getComponentDesign();

		return <MainComponent component={componentDesign} />;
	}

}

export default withRouter(ServiceAreaConfigureComponent);