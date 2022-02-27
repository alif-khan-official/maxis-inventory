class GeneralConstants {

    CRUD_ACTION_VIEW="VIEW";
    CRUD_ACTION_EDIT="EDIT";
    
    ROLE_NAME_ADMIN = "admin";
    ROLE_NAME_LOGISTIC_PARTNER = "logistic-partner"
    ROLE_NAME_MERCHANT = "merchant"
    ROLE_NAME_WAREHOUSE_MANAGER = "warehouse-manager"
    ROLE_NAME_DISPATCHER = "dispatcher"
    ROLE_NAME_RIDER = "rider"
    ROLE_NAME_SYSTEM = "system"
    ROLE_NAME_ACCOUNT = "accounts"


    WF_ROLE_SYSTEM_ID = 1
    WF_ROLE_LOGISTIC_ID = 2
    WF_ROLE_MERCHANT_ID = 3
    WF_ROLE_WAREHOUSE_ID = 4
    WF_ROLE_DISPATCHER_ID = 5
    WF_ROLE_RIDER_ID = 6
    WF_ROLE_ACCOUNT_ID = 7

    WF_STATE_START_ID = 1
    WF_CLASSTYPE_JOB_ID = 1
}

export default new GeneralConstants();