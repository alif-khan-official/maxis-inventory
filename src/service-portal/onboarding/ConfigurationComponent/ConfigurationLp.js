import MainComponent from '../../../common/MainComponent';
import AuthUtil from "../../../auth/AuthUtil";
import React from 'react';
//import EnterpriseConfig from './dummy-data/EnterpriseConfig';
import ServiceAreaListComponent from './ServiceArea/ServiceAreaListComponent';
import { withRouter } from 'react-router-dom';
import '../../../App.css';

class ConfigurationLp extends React.Component {

    constructor(props) {
        super(props);
        let receivedData = this.props.location.state;
        console.log("CONFIG_LIST_receivedData:", receivedData);
        let entityDetail = {
            "permittedRole": {
                "name": "MAXISELLP"
            }
        }
        this.state = {
            "item": '',
            "configs": [],
            "entityDetail": entityDetail,
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
        const gwUrl = process.env.REACT_APP_ELOGISTIC_API_GW_HOST;

        try {
            fetch(gwUrl + "elog-service/endpoint/maxisellp/get",
                {
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "token": "Bearer " + AuthUtil.getIdToken(),
                        "userid": AuthUtil.getUserId()
                    },
                    "body": JSON.stringify({
                        "code": AuthUtil.getUserDetails().taggedMerchantIds[0].merchantId,
                    })
                })
                .then(res => res.json())
                .then(json => json)
                .then(result => {
                    try {
                        this.setState({
                            'item': result
                        });
                    } catch (error) {
                        console.log(error);
                        this.setState({
                            'item': []
                        });
                    }
                })
        } catch (e) {
            this.setInputValue("item", []);
        }

        try {
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
        } catch (e) {
            this.setInputValue("configs", []);
        }
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
                            routeBack="service-area-lp"
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
export default withRouter(ConfigurationLp);