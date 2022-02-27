import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";
import LedgerDetails from "./LedgerDetails";
// import "primereact/resources/primereact.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";

// var bigInt = require("big-integer");

class StockLedger extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inventoryId: this.props.selectedVariant,
      variants: [],
      // tableData: [],
      actions: [{ actionCode: "VIEW" }],
      ledgerTable: true,
      ledgerDetailsTable: false,
      item: [],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    // this.viewEntity = this.viewEntity.bind(this);
    this.showDetails = this.showDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);

    this.list = {
      path:
        "maxisservice-inventory-service/endpoint/api/ledger-by-inventoryid/" +
        this.state.inventoryId.toString(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
  }

  /*
  dateTemplate(rowData, column) {
    console.log("column");
    console.log(column);

    let r = rowData["lastModifiedTimestamp"];

    return r.substring(0, 19);
  }
  
  dateTemplate(rowData, column) {
    console.log("column");
    console.log(column);

    let r = rowData["lastModifiedTimestamp"];

    let d = new Date(r);

    return d.toLocaleString("en-US");
  }
  */
  dateTemplate(rowData, column) {
    console.log("column");
    console.log(column);

    let r = rowData["lastModifiedTimestamp"];

    let d = new Date(r);

    let date = d.toLocaleDateString("pt-PT");
    let time = d.toLocaleTimeString();

    return time + ", " + date;

    // let d = new Date(r).toLocaleString("en-US");

    // return d;
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }
  /*  
  viewEntity(item) {
    this.props.history.push({
      pathname: "/stock-management-details",
      state: { item: item },
    });
    console.log("====item====");
    console.log(item);
  }
  */
  showDetails(item) {
    let ledgerTable = this.state.ledgerTable;
    let ledgerDetailsTable = this.state.ledgerDetailsTable;

    this.setState({
      ledgerTable: !ledgerTable,
      ledgerDetailsTable: !ledgerDetailsTable,
      item: item,
    });
  }

  hideDetails() {
    let ledgerTable = this.state.ledgerTable;
    let ledgerDetailsTable = this.state.ledgerDetailsTable;

    this.setState({
      ledgerTable: !ledgerTable,
      ledgerDetailsTable: !ledgerDetailsTable,
    });
  }

  async getLedger() {
    console.log("mounting");
    let variantArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(gwUrl + this.list.path, {
        method: "GET",
        headers: this.list.headers,
      });

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].transferMode === "RECEIVED"
          ? (response[i].received = response[i].baseUnitQuantity)
          : (response[i].delivered = response[i].baseUnitQuantity);
      }

      variantArray = response.reverse();
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", variantArray);
  }

  componentDidMount() {
    let inventoryId = this.state.inventoryId;

    if (inventoryId) {
      this.getLedger();
    }

    console.log("mounting");
    console.log("mounted");
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Date",
          selector: "lastModifiedTimestamp",
        },
        {
          name: "Description",
          selector: "description",
          // style: { width: "450px" },
        },
        {
          name: "Received",
          selector: "received",
        },
        {
          name: "Delivered",
          selector: "delivered",
        },
        {
          name: "Remaining",
          selector: "totalBaseUnitQuantity",
        },
        {
          name: "Remarks",
          selector: "remarks",
        },
      ];
    /*
    if (role === "Maxis-Services-LM-Administrator")
      columnData = [
        { name: "Id", selector: "id", style: { width: "250px" } },
        {
          name: "Created on",
          selector: "creationDate",
          style: { width: "250px" },
        },
        {
          name: "Branch",
          selector: "localMerchant.name",
          style: { width: "250px" },
        },
        { name: "Issuer", selector: "creator.name", style: { width: "250px" } },
        {
          name: "Customer",
          selector: "customer.name",
          style: { width: "250px" },
        },
        {
          name: "Phone",
          selector: "customer.phoneNumber",
          style: { width: "150px" },
        },
        {
          name: "Amount",
          selector: "schemeAmount",
          style: { width: "150px", textAlign: "right" },
        },
        {
          name: "Count",
          selector: "schemeInstallmentCount",
          style: { width: "150px", textAlign: "right" },
        },
        {
          name: "Paid",
          selector: "installPaidCount",
          style: { width: "100px", textAlign: "right" },
        },
        {
          name: "Status",
          selector: "completeStatus",
          style: { width: "100px" },
        },
      ];
    */
    let tableData = this.state.variants;
    let actions = this.state.actions;

    let componentDesign = (
      <div>
        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}></div>

        {/* <div className="p-grid fixedwidth512"> */}
        {/* <div className="datatable-filter-demo" style={{ overflowX: "auto" }}> */}
        <div>
          {this.state.ledgerTable && (
            <DataTable
              responsiveLayout="stack"
              breakpoint="640px"
              value={tableData}
              paginator
              rows={10}
              className="p-datatable-customers"
            >
              {columnData &&
                columnData.map((value, index) => {
                  if (index === 0)
                    return (
                      <Column
                        key={index}
                        field={value.selector}
                        header={value.name}
                        style={value.style}
                        sortable={true}
                        filter
                        // filterPlaceholder="Search here"
                        // filterMatchMode="contains"
                        body={this.dateTemplate}
                      />
                    );
                  else
                    return (
                      <Column
                        key={index}
                        field={value.selector}
                        header={value.name}
                        style={value.style}
                        sortable={true}
                        filter
                        // filterPlaceholder="Search here"
                        // filterMatchMode="contains"
                      />
                    );
                })}
              {actions && (
                <Column
                  header="Action"
                  style={{ width: "120px" }}
                  body={(h) => (
                    <div className="p-d-flex">
                      {actions.map((value, index) => {
                        return (
                          <div key={index}>
                            <Button
                              label="Details"
                              onClick={() => {
                                this.showDetails(h);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              )}

              {/*  
                {actions && (
                  <Column
                    header="Action"
                    style={{ width: "256px" }}
                    body={(h) => (
                      <div className="p-d-flex">
                        {actions.map((value, index) => {
                          return (
                            <div key={index}>
                              <Button
                                label="View"
                                onClick={() => {
                                  this.viewEntity(h);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                )}
                */}
            </DataTable>
          )}
          {this.state.ledgerDetailsTable && (
            <LedgerDetails item={this.state.item} key={this.state.item} />
          )}
        </div>
        <hr />
        {/*
          <br /> 
        */}
        {this.state.ledgerDetailsTable && (
          <Button
            style={{
              float: "right",
              marginRight: "10px",
            }}
            label="Back"
            onClick={() => {
              this.hideDetails();
            }}
          />
        )}
      </div>
    );
    return componentDesign;
  }
  render() {
    return this.getComponentDesign();
  }
}
export default withRouter(StockLedger);
