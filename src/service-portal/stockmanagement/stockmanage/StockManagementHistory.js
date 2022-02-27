import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";

class StockManagementHistory extends React.Component {
  constructor(props) {
    super(props);
    let data = this.props.location.state.item;

    this.state = {
      inventoryId: data.id,
      product: data.product,
      variants: [],
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.viewEntity = this.viewEntity.bind(this);
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
  dateTemplate(rowData, column) {
    console.log("column");
    console.log(column);

    // let r = rowData["creationDate"];

    let r = rowData["lastModifiedTimestamp"];

    return r.substring(0, 19);
  }
  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  viewEntity(item) {
    this.props.history.push({
      pathname: "/stock-management-details",
      state: { item: item },
    });
    console.log("====item====");
    console.log(item);
  }

  async componentDidMount() {
    console.log("mounting");
    let ledgerArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(gwUrl + this.list.path, {
        method: "GET",
        headers: this.list.headers,
      });

      let response = await res.json();
      let attributes = "";

      for (let i = 0; i < response.length; i++) {
        // response[i].inventoryId = bigInt(response[i].inventoryId);
        response[i].product = this.state.product;
        response[i].baseUnitQuantity =
          response[i].baseUnitQuantity +
          " " +
          response[i].baseUnitOfMeasure.label;

        response[i].totalBaseUnitQuantity =
          response[i].totalBaseUnitQuantity +
          " " +
          response[i].baseUnitOfMeasure.label;

        for (let j = 0; j < response[i].variantAttributes.length; j++) {
          if (attributes === "") {
            attributes = response[i].variantAttributes[j].attributeValueLabel;
          } else {
            attributes =
              attributes +
              ", " +
              response[i].variantAttributes[j].attributeValueLabel;
          }
        }
        response[i].variantAttributes = attributes;
        attributes = "";
      }

      ledgerArray = response.reverse();
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", ledgerArray);
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Product",
          selector: "product",
          // style: { width: "150px" },
        },
        {
          name: "Variant",
          selector: "productVariantLabel",
          // style: { width: "250px" },
        },
        /*
        {
          name: "Created On",
          selector: "createdon",
          style: { width: "250px" },
        },
        */
        /*
        {
          name: "Attributes",
          selector: "variantAttributes",
          // style: { width: "150px" },
        },
        */
        {
          name: "Quantity",
          selector: "baseUnitQuantity",
          // style: { width: "150px" },
        },
        {
          name: "Total Quantity",
          selector: "totalBaseUnitQuantity",
          // style: { width: "150px" },
        },

        {
          name: "Transfer Mode",
          selector: "transferMode",
          // style: { width: "150px" },
        },

        {
          name: "Last Modified",
          selector: "lastModifiedTimestamp",
          // style: { width: "150px" },
        },
        {
          name: "Last Modified by",
          selector: "lastModifiedBy",
          // style: { width: "150px" },
        },
      ];
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
    let tableData = this.state.variants;
    let actions = this.state.actions;

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">Stock Management History</div>
          </div>
        </div>

        <hr />

        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}></div>

        {AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" && (
          <hr />
        )}

        <div className="p-grid fixedwidth512">
          <div className="datatable-filter-demo">
            <DataTable
              value={tableData}
              paginator
              rows={10}
              className="p-datatable-customers"
            >
              {columnData &&
                columnData.map((value, index) => {
                  if (index === 5)
                    return (
                      <Column
                        key={index}
                        field={value.selector}
                        header={value.name}
                        style={value.style}
                        sortable={true}
                        filter
                        filterPlaceholder="Search here"
                        filterMatchMode="contains"
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
                        filterPlaceholder="Search here"
                        filterMatchMode="contains"
                      />
                    );
                })}
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
            </DataTable>
          </div>
        </div>
        <hr />
        <br />
      </div>
    );
    return componentDesign;
  }
  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(StockManagementHistory);
