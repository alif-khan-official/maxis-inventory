import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import AuthUtil from "../../../../auth/AuthUtil";
import React from 'react';
import ColumnData from './ServiceAreaColumnData';
import { withRouter } from 'react-router-dom';
import '../../../../App.css';

class ServiceAreaListComponent extends React.Component {

    constructor(props) {
        super(props);
        let receivedConfigData = this.props.configs;
        let receivedItemData = this.props.item;
        let entityDetail = this.props.entityDetail;
        let routeBack = this.props.routeBack;
        console.log("receivedConfigData", receivedConfigData);
        console.log("receivedItemData------42342", receivedItemData);
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
            "maxCount": receivedConfigData.maxCount,
            "configName": receivedConfigData.configurationName,
            "configShortName": receivedConfigData.configurationShortName,
            "meta": receivedConfigData.meta,
            "configurationType": receivedConfigData.configurationType,
            "entityDetail": entityDetail,
            "routeBack": routeBack,
            "countCondition": false
        }

        this.onClick.bind(this);
        this.onChange.bind(this);
        this.addEntity.bind(this);
        this.viewEntity.bind(this);
        this.setInputValue.bind(this);
        this.getAllowedOnboardingRoles.bind(this);
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
        this.props.history.push({ "pathname": "/service-area-configure", "state": { "item": item, "item2": this.state.item, "configs": configs, "entityDetail": this.state.entityDetail, "mode": "VIEW", "routeBack": this.state.routeBack } });
        console.log("====item====");
        console.log(item);
    }

    addEntity(configs) {
        this.props.history.push({ "pathname": "/service-area-configure", "state": { "item": [], "item2": this.state.item, "configs": configs, "entityDetail": this.state.entityDetail, "mode": "ADD", "routeBack": this.state.routeBack } });
    }

    editEntity(item, configs) {
        this.props.history.push({ "pathname": "/service-area-configure", "state": { "item": item, "item2": this.state.item, "configs": configs, "entityDetail": this.state.entityDetail, "mode": "EDIT", "routeBack": this.state.routeBack } });
    }

    setInputValue(property, val) {
        this.setState({ [property]: val });
    }


    componentDidMount() {
        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

        let payLoad = {};
        if (this.state.configs.configurationType === "SERVICE_TYPE_SERVICE_AREA_LOGISTIC_PARTNER") {
            payLoad = {
                "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
                "property2": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newEnterpriseEntityId
                "property3": this.state.configs.configurationType, //ConfigurationType
            }
        } else {
            payLoad = {
                "property1": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId, //newLogisticPartnerEntityId
                "property2": this.state.item.userId, //newEnterpriseEntityId
                "property3": this.state.configs.configurationType, //ConfigurationType
            }
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
                    this.setInputValue("tableData", result);
                    console.log("this.state.maxCount ==", this.state.maxCount);
                    console.log("result.length ==", result.length);
                    if (this.state.maxCount === undefined || this.state.maxCount === null || this.state.maxCount === "") {
                        this.setInputValue("countCondition", true);
                    }
                    else if ((this.state.maxCount - result.length) > 0) {
                        this.setInputValue("countCondition", true);
                    } else {
                        this.setInputValue("countCondition", false);
                    }
                })
        }
        catch (e) {
            console.log(e)
        }
    }

    getAllowedOnboardingRoles() {
    }

    getComponentDesign() {
        let columnData = ColumnData;

        let tData = this.state.tableData;
        let actions = this.state.actions;

        let componentDesign = <div className="card">

            <Fieldset legend={this.state.configShortName} toggleable>
                <div className="p-grid p-fluid">
                    <div className="p-col-12 p-lg-3 p-order-md-1">
                        {this.state.addPermission && this.state.countCondition && <Button label="Add" onClick={() => this.onClick("ADD_ENTITY", "", this.state.configs)} className="p-button-raised p-button-info" />}
                    </div>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-col-12 p-lg-12">
                        <div className="datatable-filter-demo">
                            <DataTable value={tData} paginator rows={3} className="p-datatable-customers">
                                {columnData && columnData.map((value, index) => {
                                    return <Column key={index} field={value.selector} header={value.name} filter filterPlaceholder="Search here" filterMatchMode="contains" />
                                })}
                                {actions && <Column header="Action" body={(h) => <div className="p-d-flex">
                                    {actions.map((value, index) => {
                                        return <div className="p-col-2 p-lg-4" key={index}>
                                            {value.code === "EDIT_CONFIGURATION" && <Button label="Edit"
                                                onClick={() => {
                                                    this.onClick("EDIT_ENTITY", h, this.state.configs)
                                                }}
                                            />}
                                            {value.code === "VIEW_CONFIGURATION" && <Button label="View"
                                                onClick={() => {
                                                    this.onClick("VIEW_ENTITY", h, this.state.configs)
                                                }}
                                            />}
                                        </div>
                                    })}
                                </div>}
                                />}
                            </DataTable>
                        </div>
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
export default withRouter(ServiceAreaListComponent);