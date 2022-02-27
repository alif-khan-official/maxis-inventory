import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import AuthUtil from "../../../auth/AuthUtil";
import React from 'react';
import { withRouter } from 'react-router-dom';
import '../../../App.css';

class GenericListComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "roles": [],
            "list": [],
            "defaultValue": "",
            "entityDetails": {},
            "entity": "",
            "showData": false,
            "renderPage": false,
            "data": [],
            "columns": [],
            "actions": []
        }

        this.onClick =this.onClick.bind(this);
        this.onChange =this.onChange.bind(this);
        this.addEntity =this.addEntity.bind(this);
        this.viewEntity =this.viewEntity.bind(this);
        this.manageEntity =this.manageEntity.bind(this);
        this.setInputValue =this.setInputValue.bind(this);
        this.settingsEntity =this.settingsEntity.bind(this);
        this.ledgerEntity =this.ledgerEntity.bind(this);
        this.configureEntity =this.configureEntity.bind(this);
        this.getComponentList =this.getComponentList.bind(this);
        this.getAllowedOnboardingRoles =this.getAllowedOnboardingRoles.bind(this);
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
        else if (code === "CONFIGURE_ENTITY") {
            this.configureEntity(item);
        }
        else if (code === "NEW_SCHEME") {
            this.newScheme(item);
        }
        else if (code === "SETTINGS") {
            this.settingsEntity(item);
        }
        else if (code === "LEDGER") {
            this.ledgerEntity(item);
        }
    }

    newScheme(item) {
        this.props.history.push({ "pathname": "/new-scheme", "state": item});
    }

    viewEntity(item) {
        item.profileId = item.attemptId;
        this.props.history.push({ "pathname": "/view", "state": item });
    }

    addEntity() {
        this.props.history.push({ "pathname": "/add", "state": { "profileId": this.state.entityDetails.designId } });
    }

    settingsEntity(item) {
        this.props.history.push({ "pathname": "/credit-partner-settings-details", "state": item });
    }

    ledgerEntity(item) {
        this.props.history.push({ "pathname": "/credit-partner-ledger-details", "state": item });
    }

    editEntity(item) {
        this.props.history.push({ "pathname": "/edit", "state": item });
    }

    configureEntity(item) {
        this.props.history.push({ "pathname": "/configure", "state": { "item": item, "entityDetail": this.state.entityDetails } });
    }

    manageEntity() {
        this.setInputValue("showData", false);
        this.setInputValue("columns", []);
        this.setInputValue("data", []);

        if (this.state.entity === "" || this.state.entity === undefined)
            return;

        let list = this.state.list;
        let manageEntity = {};

        this.setInputValue("entityDetails", {});
        for (let i = 0; i < list.length; i++) {
            let permission = list[i];

            if (this.state.entity === permission.permittedRole.id)
                manageEntity = this.state.list[i];
        }

        this.setInputValue("entityDetails", manageEntity);
        this.getComponentList(manageEntity);
    }

    setInputValue(property, val) {
        this.setState({ [property]: val });
    }

    async getComponentList(manageEntity) {
        const gwUrl = process.env.REACT_APP_ONBOARD_API_GW_HOST;

        let payLoad = {
            "userId": AuthUtil.getUserId(),
            "accountId": AuthUtil.getUserId(),
            "role": manageEntity.permittedRole.name,
            "onBoardingStatus": manageEntity.onBoardingStatus
        };
        let dataResponse = await fetch(gwUrl + manageEntity.listAPI,
            {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                },
                "body": JSON.stringify(payLoad)
            }
        );

        let columns = JSON.parse(manageEntity.menuJSON);
        let dataJSON = await dataResponse.json();
        let data = dataJSON.result ? dataJSON.result.response : [];

        if (this.state.entityDetails.actions !== undefined && this.state.entityDetails.actions.length === 0) {
        }
        else {

            let buttonEdit = false;
            let buttonView = false;
            let buttonApprove = false;
            let buttonReject = false;
			let buttonSettings = false;
			let buttonNewScheme = false;
			let buttonLedger = false;

            for (let actionIndex = 0; actionIndex < this.state.entityDetails.actions.length; actionIndex++) {
                let action = this.state.entityDetails.actions[actionIndex];

                if (action.actionKey === "VIEW") buttonView = true;
                else if (action.actionKey === "EDIT") buttonEdit = true;
                else if (action.actionKey === "REJECT") buttonReject = true;
                else if (action.actionKey === "APPROVE") buttonApprove = true;
                else if (action.actionKey === "SETTINGS") buttonSettings = true;
                else if (action.actionKey === "NEW_SCHEME") buttonNewScheme = true;
                else if (action.actionKey === "LEDGER") buttonLedger = true;
            }

            console.log(buttonEdit, buttonView, buttonApprove, buttonReject, buttonNewScheme, buttonSettings, buttonLedger);
        }

        this.setInputValue("data", data);
        this.setInputValue("showData", true);
        this.setInputValue("columns", columns);
    }

    async componentDidMount() {
        const gwUrl = process.env.REACT_APP_ONBOARD_API_GW_HOST;

        let payLoad = { "userId": AuthUtil.getUserId() };

        let roleManagementResponse = await fetch(gwUrl + "authorization-service/endpoint/role/get-role-managements",
            {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "token": "Bearer " + AuthUtil.getIdToken()
                }
                ,
                "body": JSON.stringify(payLoad)
            }
        );

        let roleManagementJSON = await roleManagementResponse.json();
        let list = roleManagementJSON.result.response;
        let roles = this.state.roles;
        let actions = this.state.actions;

        for (let i = 0; i < list.length; i++) {
            let permission = list[i];
            roles.push({ "key": permission.permittedRole.name, "value": permission.permittedRole.id, "displayName": permission.permittedRole.displayName, "disabled": false, "selected": false });
            actions = permission.actions;
        }

        this.setInputValue("actions", actions);
        this.setInputValue("roles", roles);
        this.setInputValue("list", list);
        this.setInputValue("renderPage", true);
    }

    getAllowedOnboardingRoles() {
    }

    getComponentDesign() {

        let renderPage = this.state.renderPage;

        let designEmpty = <div className="card"></div>;

        if (!renderPage)
            return designEmpty;

        let columnData = this.state.columns;

        let entityDetail = this.state.entityDetails;

        console.log("entityDetail;=", entityDetail);
        let actions = entityDetail.actions;

        let componentDesign = <div className="card">

            <div className="p-d-flex border">
                <div className="p-col-12 p-lg-12">
                    <div className="table-header">{this.props.pageTitle}</div>
                </div>
            </div>

            <div className="p-grid p-fluid" style={{ "marginRight": "0rem" }}>
                <div className="p-col-12 p-lg-5 p-order-md-1">
                    <Dropdown
                        inputId="userType"
                        value={this.state.defaultValue ? this.state.defaultValue : []}
                        options={this.state.roles ? this.state.roles.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1) : []}
                        onChange={(e) => { this.setState({ "defaultValue": e.target.value, "entity": e.target.value }) }}
                        placeholder="Select User Type"
                        optionLabel="displayName" />
                </div>
                <div className="p-col-6 p-lg-3 p-order-md-3">
                    <Button label="Manage" onClick={() => this.onClick("MANAGE_ENTITY", "")} className="p-button-raised p-button-info" />
                </div>
            </div>

            <hr/>
			{
	            <div className="p-fluid">
                	<div className="p-col-12 p-lg-3 p-order-md-1">
                    	{(this.state.showData) && (this.state.entityDetails.addPermission) && <Button label="Add" onClick={() => this.onClick("ADD_ENTITY", "")} className="p-button-raised p-button-info" />}
                	</div>
            	</div>
			}
            <div className="p-fluid">
                <div className="p-col-12 p-lg-12">
                    <div className="datatable-filter-demo">
                        <DataTable value={this.state.data} paginator rows={10} className="p-datatable-customers" key={100}>
                            {columnData && columnData.map((value, index) => {
                                return <Column field={value.selector} header={value.name} filter filterPlaceholder="Search here" filterMatchMode="contains" key={index + 101} />
                            })}
                            {actions && <Column header="Action" body={(h) => <div className="p-d-flex">
                                {actions.map((value, index) => {
                                    return (	(value.actionKey === "LEDGER" || value.actionKey === "VIEW" || value.actionKey === "CONFIGURE" || value.actionKey === "EDIT" || value.actionKey === "NEW_SCHEME" || value.actionKey === "SETTINGS") && 
                                    			<div className="p-col-4 p-lg-4" key={index + 301}>
			                                        <Button label={value.actionDisplayName}
			                                            onClick={() => {
			                                                if (value.actionKey === "VIEW") { this.onClick("VIEW_ENTITY", h) }
			                                                if (value.actionKey === "EDIT") { this.onClick("EDIT_ENTITY", h) }
			                                                if (value.actionKey === "CONFIGURE") { this.onClick("CONFIGURE_ENTITY", h) }
			                                                if (value.actionKey === "NEW_SCHEME") { this.onClick("NEW_SCHEME", h) }
			                                                if (value.actionKey === "SETTINGS") { this.onClick("SETTINGS", h) }
			                                                if (value.actionKey === "LEDGER") { this.onClick("LEDGER", h) }
			                                            }} 
			                                         />
                                    			</div>
                                    		)
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
export default withRouter(GenericListComponent);