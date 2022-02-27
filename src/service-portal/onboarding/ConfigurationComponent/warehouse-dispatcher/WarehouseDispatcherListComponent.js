import { Fieldset } from 'primereact/fieldset';
import AuthUtil from "../../../../auth/AuthUtil";
import React from 'react';
import { withRouter } from 'react-router-dom';
import '../../../../App.css';
import WarehouseDispatcherConfigureComponent from './WarehouseDispatcherConfigureComponent';

class WarehouseDispatcherListComponent extends React.Component {

    constructor(props) {
        super(props);
        let receivedConfigData = this.props.configs;
        let receivedItemData = this.props.item;
        let entityDetail = this.props.entityDetail;
        console.log("receivedConfigData", receivedConfigData);
        console.log("receivedItemData", receivedItemData);
        this.state = {
            "tableData": [],
            "configs": receivedConfigData,
            "item": receivedItemData,
            "columnData": receivedConfigData.columns,
            "actions": receivedConfigData.actions,
            "configDesign": receivedConfigData.configDesign,
            "listApi": receivedConfigData.listAPI,
            "addApi": receivedConfigData.addApi,
            "saveApi": receivedConfigData.saveApi,
            "addPermission": receivedConfigData.addPermission,
            "configName": receivedConfigData.configurationName,
            "configShortName": receivedConfigData.configurationShortName,
            "meta": receivedConfigData.meta,
            "configurationType": receivedConfigData.configurationType,
            "entityDetail": entityDetail
        }

        this.onClick.bind(this);
        this.onChange.bind(this);
        this.addEntity.bind(this);
        this.viewEntity.bind(this);
        this.setInputValue.bind(this);
    }

    onChange(key, val) {
        this.setInputValue(key, val);
    }

    onClick(code, item, configs) {
        if (code === "MANAGE_ENTITY") {
            this.manageEntity();
        }
        else if (code === "ADD_ENTITY") {
            this.addEntity(configs);
        }
        else if (code === "VIEW_ENTITY") {
            this.viewEntity(item, configs);
        }
        else if (code === "EDIT_ENTITY") {
            this.editEntity(item, configs);
        }
        else if (code === "APPROVE_ENTITY") {
            this.updateUserState(item, "APPROVED");
        }
        else if (code === "REJECT_ENTITY") {
            this.updateUserState(item, "REJECTED");
        }
        else if (code === "CONFIG_ENTITY") {
            console.log("CONFIG_ENTITY");
        }
    }

    viewEntity(item, configs) {
        item.profileId = item.attemptId;
        this.props.history.push({ "pathname": "/pndc-configure", "state": { "item": item, "item2": this.state.item, "configs": configs, "entityDetail": this.state.entityDetail, "mode": "VIEW" } });
        console.log("====item====");
        console.log(item);
    }

    addEntity(configs) {
        this.props.history.push({ "pathname": "/pndc-configure", "state": { "item": [], "item2": this.state.item, "configs": configs, "entityDetail": this.state.entityDetail, "mode": "ADD" } });
    }

    editEntity(item, configs) {
        this.props.history.push({ "pathname": "/pndc-configure", "state": { "item": item, "item2": this.state.item, "configs": configs, "entityDetail": this.state.entityDetail, "mode": "EDIT" } });
    }

    setInputValue(property, val) {
        this.setState({ [property]: val });
    }


    componentDidMount() {
        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

        let payLoad = {
            "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
            "property2": this.state.item.userId, //newEnterpriseEntityId
            "property3": this.state.configs.configurationType, //ConfigurationType
        }

        try {
            fetch(gwUrl + this.state.listApi.substring(1), {
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
                    this.setInputValue("tableData", result)
                })
        }
        catch (e) {
            console.log(e)
        }
    }

    getComponentDesign() {

        let componentDesign = <div className="card">

            <Fieldset legend={this.state.configShortName} toggleable>
                <div className="p-grid p-fluid">
                    <div className="p-col-12 p-lg-12">
                        <WarehouseDispatcherConfigureComponent
                            state={{
                                "data": {
                                    "item": [],
                                    "item2": this.state.item,
                                    "configs": this.state.configs,
                                    "entityDetail": this.state.entityDetail,
                                    "mode": "ADD"
                                }
                            }}
                        />
                    </div>
                </div>
            </Fieldset>
        </div>

        return componentDesign;
    }
    render() {
        let componentDesign = this.getComponentDesign()
        return componentDesign;
    }
}
export default withRouter(WarehouseDispatcherListComponent);