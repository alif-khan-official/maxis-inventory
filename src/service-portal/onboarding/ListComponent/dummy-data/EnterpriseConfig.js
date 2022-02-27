const data = [
    {
        "LPName": "NAME",
        "EPId": "ID",
        "ECode": "CODE",
        "configs": [
            {
                "configType": "SA",
                "configDesign": "Static",
                "listApi": "/api/",
                "addApi": "/api/",
                "saveApi": "/api/",
                "addPermission": true,
                "configName": "Service Area",

                "columnJson": [
                    { name: "Warehouse Id", selector: "warehouseId", width: "200px", sortable: true },
                    { name: "User Id", selector: "userId", width: "200px", sortable: true },
                    { name: "Name", selector: "name", width: "200px", sortable: true }
                ],
                "actions": [
                    {
                        "actionKey": "VIEW",
                        "actionDisplayName": "View",
                        "actionAPI": "/onboard",
                        "actionType": "REDIRECT"
                    },
                    {
                        "actionKey": "EDIT",
                        "actionDisplayName": "Edit",
                        "actionAPI": "/service-area-edit",
                        "actionType": "REDIRECT"
                    }
                ],
                "meta": [
                    {
                        "code": "district",
                        "api": "/api/district"
                    },
                    {
                        "code": "thana",
                        "api": "/api/thana",
                    },
                    {
                        "code": "service-properties",
                        "api": "/api/service-properties",
                    }
                ]
            }
        ]
    },

    {
        "LPName": "NAME",
        "EPId": "ID",
        "ECode": "CODE",
        "configs": [
            {
                "configType": "SA",
                "configDesign": "Static",
                "listApi": "/api/",
                "addApi": "/api/",
                "saveApi": "/api/",
                "addPermission": true,
                "configName": "Service Area",

                "columnJson": [
                    { name: "Warehouse Id", selector: "warehouseId", width: "200px", sortable: true },
                    { name: "User Id", selector: "userId", width: "200px", sortable: true },
                    { name: "Name", selector: "name", width: "200px", sortable: true }
                ],
                "actions": [
                    {
                        "actionKey": "VIEW",
                        "actionDisplayName": "View",
                        "actionAPI": "/onboard",
                        "actionType": "REDIRECT"
                    },
                    {
                        "actionKey": "EDIT",
                        "actionDisplayName": "Edit",
                        "actionAPI": "/service-area-edit",
                        "actionType": "REDIRECT"
                    }
                ],
                "meta": [
                    {
                        "code": "district",
                        "api": "/api/district"
                    },
                    {
                        "code": "thana",
                        "api": "/api/thana",
                    },
                    {
                        "code": "service-properties",
                        "api": "/api/service-properties",
                    }
                ]
            }
        ]
    },

    {
        "LPName": "NAME",
        "EPId": "ID",
        "ECode": "CODE",
        "configs": [
            {
                "configType": "SA",
                "configDesign": "Static",
                "listApi": "/api/",
                "addApi": "/api/",
                "saveApi": "/api/",
                "addPermission": true,
                "configName": "Service Area",

                "columnJson": [
                    { name: "Warehouse Id", selector: "warehouseId", width: "200px", sortable: true },
                    { name: "User Id", selector: "userId", width: "200px", sortable: true },
                    { name: "Name", selector: "name", width: "200px", sortable: true }
                ],
                "actions": [
                    {
                        "actionKey": "VIEW",
                        "actionDisplayName": "View",
                        "actionAPI": "/onboard",
                        "actionType": "REDIRECT"
                    },
                    {
                        "actionKey": "EDIT",
                        "actionDisplayName": "Edit",
                        "actionAPI": "/service-area-edit",
                        "actionType": "REDIRECT"
                    }
                ],
                "meta": [
                    {
                        "code": "district",
                        "api": "/api/district"
                    },
                    {
                        "code": "thana",
                        "api": "/api/thana",
                    },
                    {
                        "code": "service-properties",
                        "api": "/api/service-properties",
                    }
                ]
            }
        ]
    }
]

export default data