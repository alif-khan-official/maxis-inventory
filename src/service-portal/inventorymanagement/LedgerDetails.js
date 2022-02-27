import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";

var bigInt = require("big-integer");

class LedgerDetails extends React.Component {
  constructor(props) {
    super(props);
    let data = this.props.item;

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
          name: "Date",
          selector: "createdTime",
        },
        {
          name: "Description",
          selector: "description",
        },
        {
          name: "Quantity",
          selector: "quantity",
        },
        {
          name: "Total Quantity",
          selector: "totalBaseUnitQuantity",
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

    let componentDesign = (
      <DataTable
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
      </DataTable>
    );
    return componentDesign;
  }
  render() {
    return this.getComponentDesign();
  }
}
export default withRouter(LedgerDetails);
