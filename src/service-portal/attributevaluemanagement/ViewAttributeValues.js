import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";

var bigInt = require("big-integer");

class ViewAttributeValues extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    let data = this.props.location.state.item;
    /*
    const stepDisplayStyleActive = { display: "block" };
    const stepDisplayStyleInactive = { display: "none" };
    */
    this.state = {
      tableData: [],
      id: bigInt(data.id),
      inventoryItem: data.product,
      quantityf: data.quantity,
      varianttype: data.variant,
      creator: data.creator,
      status: data.status,
      fields: [],
      designName: "Form",
      fieldvalues: [],
      activeStep: 0,
      lastStep: 0,
      steps: [],
      /*
      stepDisplayStyleActive: stepDisplayStyleActive,
      stepDisplayStyleInactive: stepDisplayStyleInactive,
      */
      resultPresent: false,
      resultPresentProcessing: false,
      resultPresentFailure: false,
      resultPresentSuccess: false,

      meta: [],
      dropdowns: [],
      customerId: "",
      customerPhoneNumber: "",
      customerName: "",
      customerList: [],
      customerDropDownList: [],
      attemptIdScheme: data.attemptIdScheme,
      dropDownsDependencies: [],
      dropDownValues: [],

      // product: "",
      quantity: "",
      table: false,

      fullTable: [],
      products: [],
      product: "",
      variants: [],
      variant: "",
      matchedVariants: [],
      attribute: data.label,
    };
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.list = {
      path:
        "maxisservice-inventory-service/endpoint/api/attribute-value/" +
        this.state.id.toString(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };

    this.setInputValue = this.setInputValue.bind(this);
    // this.setFieldValue = this.setFieldValue.bind(this);
    this.pageTitle = "Attribute Value Management";
    // this.pageSubTitle = data.label;
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }
  /*
  setFieldValue(property, val) {
    let fields = this.state.fields;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.code === property) {
        console.log("====property====");
        console.log(property);
        fields[i].value = val;
        fields[i].key = field.code;
        break;
      }
    }
    this.setInputValue("fields", fields);
  }
*/
  async componentDidMount() {
    console.log("mounting");
    const payLoad = {
      userId: AuthUtil.getUserId(),
    };
    console.log(payLoad);
    try {
      let response = await fetch(this.gwUrl + this.list.path, {
        method: "GET",
        headers: this.list.headers,
      });
      let result = await response.json();

      for (let i = 0; i < result.length; i++) {
        result[i].attribute = this.state.attribute;
      }

      this.setInputValue("tableData", result);
    } catch (e) {
      console.log(e);
    }
    console.log("mounted");
  }

  getComponentDesign() {
    let columnData = [];

    columnData = [
      // { name: "Id", selector: "id", style: { width: "250px" } },
      /*
      {
        name: "Code",
        selector: "code",
        // style: { width: "150px" },
      },
      */
      {
        name: "Label",
        selector: "label",
        // style: { width: "250px" }
      },
      {
        name: "Description",
        selector: "description",
        // style: { width: "250px" },
      },
      /*{
        name: "Active",
        selector: "active",
        style: { width: "150px" },
      },
      {
        name: "Tenant",
        selector: "tanentId",
        style: { width: "250px", textAlign: "right" },
      },*/
      {
        name: "Attribute",
        selector: "attribute",
        // style: { width: "250px" },
      },
    ];
    let tableData = this.state.tableData;

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">{this.pageTitle}</div>
          </div>
        </div>

        <hr />

        {/*}
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">
              {"Attribute: " + this.pageSubTitle}
            </div>
          </div>
        </div>
*/}
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
                  /*
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
                        body={this.booleanTemplate}
                      />
                    );
                  else
                  */
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
export default withRouter(ViewAttributeValues);
