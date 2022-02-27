import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";

var bigInt = require("big-integer");

class ViewStockIn extends React.Component {
  constructor(props) {
    super(props);
    let data = this.props.location.state.item;

    this.state = {
      ledgerId: bigInt(data.batchId),
      variants: [],
      tableData: [],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);

    this.list = {
      path:
        "maxisservice-inventory-service/endpoint/api/ledgerdetails-by-batchId/" +
        this.state.ledgerId.toString(),
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

    let r = rowData["createdTime"];

    return r.substring(0, 19);
  }
  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  async componentDidMount() {
    console.log("mounting");
    let ledgerDetailsArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(gwUrl + this.list.path, {
        method: "GET",
        headers: this.list.headers,
      });

      let response = await res.json();
      let attributes = "";

      for (let i = 0; i < response.length; i++) {
        response[i].quantity =
          response[i].quantity + " " + response[i].unitOfMeasure;
        response[i].totalBaseUnitQuantity =
          response[i].totalBaseQuantity + " " + response[0].unitOfMeasure;

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

      ledgerDetailsArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", ledgerDetailsArray);
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Variant",
          selector: "productVariantLabel",
          // style: { width: "250px" },
        },
        /*
        {
          name: "Attributes",
          selector: "variantAttributes",
          style: { width: "150px" },
        },
        */
        {
          name: "Quantity",
          selector: "quantity",
          // style: { width: "150px" },
        },
        {
          name: "Total Quantity",
          selector: "totalBaseUnitQuantity",
          // style: { width: "150px" },
        },
        {
          name: "Created On",
          selector: "createdTime",
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
    // let stockIn = this.state.stockIn;

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">Stock Out Details</div>
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
                  if (index === 3)
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
export default withRouter(ViewStockIn);
