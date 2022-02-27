import React from 'react';
import { withRouter } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import AuthUtil from '../../../../auth/AuthUtil';
import ColumnData from './WarehouseDispathcerConfigColumnData';
import '../../../../App.css';
class WarehouseDispatcherConfigureComponent extends React.Component {

    constructor(props) {
        super(props);
        let receivedData = this.props.state.data;
        console.log("RECEIVED=======: ", receivedData);

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


                originalPndcList: [],
                pndcList: [],
                pndcListDropDown: [],
                selectedPndcFromDD: '',

                createdBy: AuthUtil.getUserId(),
                modifiedBy: '',
                saveBtnClick: false
            }
        } else {
            this.state = {
                apiList: [],
                receivedRowData: {},
                receivedMeta: [],


                originalPndcList: [],
                pndcList: [],
                pndcListDropDown: [],
                selectedPndcFromDD: '',

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



    componentDidMount() {
        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

        try {
            fetch(gwUrl + this.state.apiList['WAREHOUSE'].api.substring(1), {
                method: this.state.apiList['WAREHOUSE'].type,
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken(),
                    'userid': AuthUtil.getUserId()
                },
                body: JSON.stringify({
                    "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
                    "property2": this.state.receivedRowData2.userId, //newEnterpriseEntityId
                    "property3": this.state.receivedConfigs.configurationType, //ConfigurationType
                    "tanentId":AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId
                })
            })
                .then(res => res.json())
                .then(json => json)
                .then(result => {
                    try {
                        this.setState({
                            'pndcListDropDown': result,
                            'originalPndcList': result
                        });

                    } catch (error) {
                        console.log(error);
                        this.setState({
                            'pndcListDropDown': [],
                            'originalPndcList': []
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
                    "property4": ""
                })
            })
                .then(res => res.json())
                .then(json => json)
                .then(result => {
                    try {

                        this.setState({
                            'pndcList': result,
                        });

                    } catch (error) {
                        this.setState({
                            'pndcList': [],
                        });
                    }
                })
        }
        catch (e) {
            console.log(e)
        }


    }

    onClick(action, data) {
        if (data.recordId === undefined) return;

        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

        try {
            fetch(gwUrl + this.state.receivedConfigs.deleteAPI.substring(1), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': 'Bearer ' + AuthUtil.getIdToken(),
                    'userid': AuthUtil.getUserId()
                },

                body: JSON.stringify({
                    "id": data.recordId
                })
            })
                .then(result => {
                    console.log(result);
                    this.componentDidMount();
                })
        }
        catch (e) {
            console.log(e)
        }
    }
    async save() {

        let payload = {
            "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
            "property2": this.state.receivedRowData2.userId, //newEnterpriseEntityId
            "property3": this.state.receivedConfigs.configurationType, //ConfigurationType
            "property4": this.state.selectedPndcFromDD
        }

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

            if (response) {
                this.setState({ selectedPndcFromDD: '' });
                this.componentDidMount();
            }
        } catch (e) {
            console.log(e);
        }

    }


    getComponentDesign() {

        let pndcListDropDown = this.state.pndcListDropDown;
        let pndcList = this.state.pndcList;

        let modifiedPndcList = [];
        for (let i = 0; i < pndcList.length; i++) {
            if (pndcList[i].property4 !== "") {
                pndcList[i].property4['recordId'] = pndcList[i].id;
                modifiedPndcList.push(pndcList[i].property4);
            }
        }

        pndcListDropDown = pndcListDropDown.filter((val) => {
            return !modifiedPndcList.find(({ id }) => val.id === id)
        });

        console.log("pndcListDropDown", pndcListDropDown);
        console.log("modifiedPndcList", modifiedPndcList);

        let columnData = ColumnData;
        let actions = this.state.receivedConfigs.actions;

        let componentDesign = <div className="card">

            <div className="p-grid p-fluid">
                <div className="p-col-12 p-lg-5 p-order-md-1">
                    <Dropdown
                        inputId="userType"
                        value={this.state.selectedPndcFromDD ? this.state.selectedPndcFromDD : ''}
                        options={pndcListDropDown}
                        onChange={(e) => { this.setState({ selectedPndcFromDD: e.target.value, entity: e.target.value }) }}
                        placeholder="Select Warehouse"
                        optionLabel="name" />
                </div>
                <div className="p-col-6 p-lg-3 p-order-md-3">
                    <Button
                        label="Add"
                        onClick={() => { this.save() }}
                        disabled={this.state.selectedPndcFromDD ? false : true}
                        className="p-button-raised p-button-info" />
                </div>
            </div>

            <div className="p-fluid">
                <div className="p-col-12 p-lg-12">
                    <div className="datatable-filter-demo">
                        <DataTable value={modifiedPndcList} paginator rows={10} className="p-datatable-customers" key={100}>
                            {columnData && columnData.map((value, index) => {
                                return <Column
                                    field={value.selector}
                                    header={value.name}
                                    filter filterPlaceholder="Search here"
                                    filterMatchMode="contains"
                                    key={index + 101} />
                            })}
                            {actions && <Column header="Action" body={(h) => <div className="p-d-flex">
                                {actions.map((value, index) => {
                                    return <div className="p-col-12 p-lg-6" key={index + 301}>
                                        <Button label={value.code}
                                            onClick={() => {
                                                if (value.code === "DELETE_CONFIGURATION") { this.onClick("DELETE", h) }
                                            }} />
                                    </div>
                                })}
                            </div>} />}
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
        return componentDesign;
    }

    render() {
        let componentDesign = this.getComponentDesign()
        return componentDesign;
    }

}

export default withRouter(WarehouseDispatcherConfigureComponent);