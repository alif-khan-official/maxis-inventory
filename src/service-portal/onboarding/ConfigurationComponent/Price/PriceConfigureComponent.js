import React from 'react';
import { withRouter } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import AuthUtil from '../../../../auth/AuthUtil';
import '../../../../App.css';
class PriceConfigureComponent extends React.Component {

    constructor(props) {
        super(props);
        let receivedData = this.props.state.data;

        let meta = receivedData.configs.meta;

        let api = [];
        if (meta) {
            for (let i = 0; i < meta.length; i++) {
                api[meta[i].code] = { "api": meta[i].api, "type": meta[i].apiMethod };
            }
        }

        if (receivedData) {
            this.state = {
                apiList: api,
                receivedRowData2: receivedData.item2, //selected entity
                receivedRowData: receivedData.item,
                receivedConfigs: receivedData.configs,
                receivedMeta: receivedData.configs.meta,
                actionMode: receivedData.mode,
                entityDetail: receivedData.entityDetail,

                serviceType: receivedData.item ? receivedData.item.property5 : [],

                serviceArea: [],

                priceConfigPropertyValues: [],

                createdBy: AuthUtil.getUserId(),
                modifiedBy: '',
                saveBtnClick: false,
                saDetail: []
            }
        } else {
            this.state = {
                apiList: [],
                receivedRowData: {},
                receivedMeta: [],
                receivedConfigs: {},
                saName: '',

                serviceProperty: [],

                serviceType: [],
                serviceArea: [],
                serviceAreaValue: [],
                createdBy: AuthUtil.getUserId(),
                modifiedBy: '',
                saveBtnClick: false,
                saDetail: []
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



    componentDidMount() {
        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

        try {
            fetch(gwUrl + this.state.apiList['SERVICE-TYPE'].api.substring(1), {
                method: this.state.apiList['SERVICE-TYPE'].type,
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
                        this.setState({
                            'serviceType': result,
                        });
                    } catch (error) {
                        this.setState({
                            'serviceType': []
                        });
                    }
                })
        }
        catch (e) {
            console.log(e)
        }

        try {
            fetch(gwUrl + this.state.receivedConfigs.listAPI.substring(1), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken(),
                    'userid': AuthUtil.getUserId()
                },

                body: JSON.stringify({
                    "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
                    "property2": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newEnterpriseEntityId
                    "property3": 'SERVICE_TYPE_SERVICE_AREA_LOGISTIC_PARTNER', //ConfigurationType
                })
            })
                .then(res => res.json())
                .then(json => json)
                .then(result => {
                    try {
                        this.setState({
                            'serviceArea': result
                        });
                    } catch (error) {
                        this.setState({
                            'serviceArea': []
                        });
                    }
                })
        }
        catch (e) {
            console.log(e)
        }


        try {
            fetch(gwUrl + this.state.receivedConfigs.listAPI.substring(1), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken(),
                    'userid': AuthUtil.getUserId()
                },

                body: JSON.stringify({
                    "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
                    "property2": this.state.receivedRowData2.userId, //newEnterpriseEntityId
                    "property3": this.state.receivedConfigs.configurationType, //ConfigurationType
                })
            })
                .then(res => res.json())
                .then(json => json)
                .then(result => {
                    try {
                        this.setState({
                            'priceConfigPropertyValues': result
                        });
                        //console.log("priceConfigPropertyValues:==", this.state.priceConfigPropertyValues);
                    } catch (error) {
                        console.log(error);
                        this.setState({
                            'priceConfigPropertyValues': []
                        });
                    }
                })
        }
        catch (e) {
            console.log(e)
        }

    }


    async save(serviceArea) {
        console.log("PRICING-State:===", this.state);
        console.log("PRICING-serviceArea:===", serviceArea);
        let priceConfigPropertyValues = this.state.priceConfigPropertyValues;

        let payload = {};
        payload['list'] = [];


        for (let i = 0; i < serviceArea.length; i++) {
            let pro8 = serviceArea[i].property8;
            if (pro8) {
                for (let j = 0; j < pro8.length; j++) {
                    let listValue = {};
                    listValue['property1'] = serviceArea[i].property1;
                    listValue['property2'] = this.state.receivedRowData2.userId; //newEnterpriseEntityId //serviceArea[i].property2;
                    listValue['property3'] = this.state.receivedConfigs.configurationType; //ConfigurationType
                    listValue['property4'] = serviceArea[i];
                    listValue['property5'] = pro8[j];

                    listValue['property6'] = this.state[serviceArea[i].id + "-" + pro8[j].id] ? this.state[serviceArea[i].id + "-" + pro8[j].id] : '';
                    payload['list'].push(listValue);
                }
            }
        }

        payload['list'] = payload['list'].filter((val) => { return !val.property5.value })

        for (let i = 0; i < priceConfigPropertyValues.length; i++) {
            for (let j = 0; j < serviceArea.length; j++) {
                let pro8 = serviceArea[j].property8;
                if (pro8) {
                    for (let k = 0; k < pro8.length; k++) {
                        if (priceConfigPropertyValues[i].property4.id === serviceArea[j].id) {
                            if (priceConfigPropertyValues[i].property5.id === pro8[k].id) {

                                let listValue = {};
                                listValue['id'] = priceConfigPropertyValues[i].id;
                                listValue['property1'] = priceConfigPropertyValues[i].property1;
                                listValue['property2'] = this.state.receivedRowData2.userId; //newEnterpriseEntityId //priceConfigPropertyValues[i].property2;
                                listValue['property3'] = priceConfigPropertyValues[i].property3; //ConfigurationType
                                listValue['property4'] = priceConfigPropertyValues[i].property4;
                                listValue['property5'] = priceConfigPropertyValues[i].property5;
                                listValue['property6'] = this.state[serviceArea[j].id + "-" + pro8[k].id];

                                payload['list'].push(listValue);
                            }
                        }

                    }
                }
            }
        }





        console.log("After priceConfigPropertyValues:===", priceConfigPropertyValues);
        console.log("After payload['list']:===", payload['list']);
        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;
        //const gwUrl = 'http://192.168.0.27:8090/api/';
        try {
            let res = await fetch(gwUrl + "elog-service/endpoint/configuration/saveList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken(),
                    'userid': AuthUtil.getUserId()
                },
                body: JSON.stringify(payload)
            });

            let response = await res.json();

            if (response) {
                this.props.history.push({
                    "pathname": "/configure",
                    "state": {
                        "item": this.state.receivedRowData2,
                        "entityDetail": this.state.entityDetail
                    }
                });
            }
        } catch (e) {
            console.log(e);
        }

    }

    getComponentDesign() {

        let serviceType = this.state.serviceType;
        let serviceArea = this.state.serviceArea;
        let priceConfigPropertyValues = this.state.priceConfigPropertyValues;

        if (serviceArea && serviceType && priceConfigPropertyValues) {
            for (let i = 0; i < serviceArea.length; i++) {
                serviceArea[i].property8 = [];
                for (let j = 0; j < serviceType.length; j++) {
                    let propertyType = {};
                    propertyType['id'] = serviceType[j].id;
                    propertyType['code'] = serviceType[j].code;
                    propertyType['displayName'] = serviceType[j].displayName;
                    serviceArea[i].property8.push(propertyType);
                }
            }


            for (let i = 0; i < serviceArea.length; i++) {
                for (let j = 0; j < priceConfigPropertyValues.length; j++) {
                    if (serviceArea[i].id === priceConfigPropertyValues[j].property4.id) {
                        if (serviceArea[i].property8) {
                            for (let k = 0; k < serviceArea[i].property8.length; k++) {
                                if (serviceArea[i].property8[k].id === priceConfigPropertyValues[j].property5.id) {
                                    serviceArea[i].property8[k]['value'] = priceConfigPropertyValues[j].property6;
                                    if (this.state[serviceArea[i].id + "-" + serviceArea[i].property8[k].id]) {
                                        // eslint-disable-next-line
                                        this.state[serviceArea[i].id + "-" + serviceArea[i].property8[k].id] = this.state[serviceArea[i].id + "-" + serviceArea[i].property8[k].id];
                                    } else {
                                        // eslint-disable-next-line
                                        this.state[serviceArea[i].id + "-" + serviceArea[i].property8[k].id] = serviceArea[i].property8[k]['value'];
                                    }


                                }
                            }
                        }
                    }
                }
            }
        }


        let componentDesign = <div className="card">
            <div>
                <div className="p-grid">
                    <div className="p-col-5">
                        <br></br>
                        {serviceType && serviceType.map((st, index) => {
                            return <div key={index + 10}>
                                <div className="p-col-12">
                                    <label htmlFor="saName">{st.displayName}</label>
                                </div>
                                <br></br>
                            </div>
                        })}
                    </div>
                    <div className="p-col-7">

                        <div className="p-grid">
                            {serviceArea && serviceArea.map((fd, index) => {
                                // eslint-disable-next-line
                                {
                                    return <div key={index}>
                                        <div className="p-col-12" key={index + 100}>
                                            <label htmlFor="saName" key={index + 300}>{fd.property4}</label>
                                        </div>

                                        {fd.property8 && fd.property8.map((sap, index) => {

                                            return <div key={index + 500}>
                                                <div className="p-col-12" key={index + 1000}>
                                                    <InputText
                                                        key={index + 2000}
                                                        id={fd.id + "-" + sap.id}
                                                        value={this.state[fd.id + "-" + sap.id] ? this.state[fd.id + "-" + sap.id] : ''}
                                                        onChange={(e) => { this.setInputValue(fd.id + "-" + sap.id, e.target.value) }}
                                                        placeholder={sap.displayName + " Charge"}
                                                        type="text" />
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                }
                            })}
                        </div>
                    </div>
                </div>

                {<div className="p-col-12 p-lg-4">
                    <div className="p-col-12 p-lg-5">
                        {this.state.actionMode === "ADD" && <Button label="Save" onClick={(e) => {
                            this.setState({ saveBtnClick: true });
                            this.save(serviceArea);
                        }} className="p-button-raised" />}

                        {this.state.actionMode === "VIEW" && <Button label="Back" onClick={(e) => {
                            this.props.history.push({ "pathname": "/configure", "state": { "item": this.state.receivedRowData2, "entityDetail": this.state.entityDetail } });
                        }} className="p-button-raised" />}

                        {this.state.actionMode === "EDIT" && <Button label="Edit" onClick={(e) => {
                            this.setState({ saveBtnClick: true });
                            this.save();
                        }} className="p-button-raised" />}
                    </div>
                </div>}
            </div>
        </div >
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign()
        return componentDesign;
    }

}

export default withRouter(PriceConfigureComponent);