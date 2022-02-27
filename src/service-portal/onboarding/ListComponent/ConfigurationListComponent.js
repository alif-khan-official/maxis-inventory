import MainComponent from '../../../common/MainComponent';
import AuthUtil from "../../../auth/AuthUtil";
import React from 'react';
//import EnterpriseConfig from './dummy-data/EnterpriseConfig';
import ServiceAreaListComponent from '../ConfigurationComponent/ServiceArea/ServiceAreaListComponent';
import PriceListComponent from '../ConfigurationComponent/Price/PriceListComponent';
import PndcListComponent from '../ConfigurationComponent/Pndc/PndcListComponent';
import { withRouter } from 'react-router-dom';
import '../../../App.css';
import WarehouseDispatcherListComponent from '../ConfigurationComponent/warehouse-dispatcher/WarehouseDispatcherListComponent';

class ConfigurationListComponent extends React.Component {

    constructor(props) {
        super(props);
        let receivedData = this.props.location.state;
        console.log("CONFIG_LIST_receivedData:", receivedData);
        this.state = {
            "item": receivedData.item,
            "configs": [],
            "entityDetail": receivedData.entityDetail,
            "pageTitle": "Configuration"
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

    onClick(code, item) {
        if (code === "MANAGE_ENTITY") {
            this.manageEntity();
        }
        else if (code === "ADD_ENTITY") {
            this.addEntity();
        }
        else if (code === "VIEW_ENTITY") {
            console.log("item: ", item);
            this.viewEntity(item);
        }
        else if (code === "EDIT_ENTITY") {
            this.editEntity(item);
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

    viewEntity(item) {
        item.profileId = item.attemptId;
        this.props.history.push({ "pathname": "/view", "state": item });
        console.log("====item====");
        console.log(item);
    }

    addEntity() {
        this.props.history.push({ "pathname": "/configure" });
    }

    editEntity(item) {
        this.props.history.push({ "pathname": "/edit", "state": item });
    }

    setInputValue(property, val) {
        this.setState({ [property]: val });
    }

    async componentDidMount() {
        const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

        let payLoad = {
            "configurationManagerUserRoleCode": AuthUtil.getUserDetails().role[0].name,
            "configurationManagerEntityRoleCode": this.state.entityDetail.permittedRole.name
        }

        let configurationResponse = await fetch(gwUrl + "elog-service/endpoint/configurationmanagement/get",
            {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken(),
                    "userid": AuthUtil.getUserId()
                },
                "body": JSON.stringify(payLoad)
            }
        );

        configurationResponse = await configurationResponse.json();
        let configResponse = configurationResponse;
        this.setInputValue("configs", configResponse);
    }

    getAllowedOnboardingRoles() {
    }

    getComponentDesign() {
        let config = this.state.configs;
        console.log("configs: ", config);
        let componentDesign = <div className="card">
            <div className="p-d-flex border">
                <div className="p-col-12 p-lg-12">
                    <div className="table-header">{this.state.pageTitle}</div>
                </div>
            </div>

            {config.length > 0 && config.map((config, index) => {
                return <div key={index}>
                    {config && config.configurationType === "SERVICE_TYPE_SERVICE_AREA_LOGISTIC_PARTNER" &&
                        <ServiceAreaListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </ServiceAreaListComponent>}

                    {config && config.configurationType === "SERVICE_TYPE_SERVICE_AREA_ENTERPRISE" &&
                        <ServiceAreaListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </ServiceAreaListComponent>}

                    {config && config.configurationType === "SERVICE_TYPE_PRICE_ENTERPRISE" &&
                        <PriceListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </PriceListComponent>}

                    {config && config.configurationType === "SERVICE_TYPE_PNDC_ENTERPRISE" &&
                        <PndcListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </PndcListComponent>}

                    {config && config.configurationType === "SERVICE_TYPE_WAREHOUSE_DISPATCHER" &&
                        <WarehouseDispatcherListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </WarehouseDispatcherListComponent>}

                    {config && config.configurationType === "SERVICE_TYPE_SERVICE_AREA_WAREHOUSE" &&
                        <ServiceAreaListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </ServiceAreaListComponent>}

                    {config && config.configurationType === "SERVICE_TYPE_SERVICE_AREA_PNDC" &&
                        <ServiceAreaListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </ServiceAreaListComponent>}



                    {config && config.configurationType === "SERVICE_TYPE_SERVICE_AREA_RIDER" &&
                        <ServiceAreaListComponent
                            configs={config}
                            item={this.state.item}
                            entityDetail={this.state.entityDetail}
                        >
                        </ServiceAreaListComponent>}
                </div>

            })}
        </div>

        return componentDesign;
    }
    render() {
        let componentDesign = this.getComponentDesign()

        return <MainComponent component={componentDesign} />;
    }
}
export default withRouter(ConfigurationListComponent);