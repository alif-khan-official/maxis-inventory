import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";

var bigInt = require("big-integer");

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
      categories: [],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.newProduct = this.newProduct.bind(this);
    this.viewEntity = this.viewEntity.bind(this);
    this.findCategoryName = this.findCategoryName.bind(this);
    this.list = {
      path:
        "maxisservice-inventory-service/endpoint/api/product-by-tenantid/" +
        AuthUtil.getTanentId(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getCategoriesAPI = {
      path:
        "maxisservice-inventory-service/endpoint/api/product-category/" +
        AuthUtil.getTanentId(),
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

    let r = rowData["creationDate"];

    return r.substring(0, 10);
  }
  */
  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  newProduct() {
    this.props.history.push({ pathname: "/new-product", state: {} });
  }

  viewEntity(item) {
    this.props.history.push({
      pathname: "/product-edit",
      state: { item: item },
    });
    console.log("====item====");
    console.log(item);
  }

  async getAllProducts() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let response = await fetch(gwUrl + this.list.path, {
        method: "GET",
        headers: this.list.headers,
      });
      let result = await response.json();

      for (let i = 0; i < result.length; i++) {
        result[i].label = result[i].label + " - " + result[i].brandName;
        result[i].category = this.findCategoryName(
          bigInt(result[i].productCategoryId)
        );
      }

      this.setInputValue("tableData", result);

      // alert(JSON.stringify(result));
    } catch (e) {
      console.log(e);
    }
  }

  async getAllCategories() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let response = await fetch(gwUrl + this.getCategoriesAPI.path, {
        method: "GET",
        headers: this.getCategoriesAPI.headers,
      });
      let result = await response.json();

      for (let i = 0; i < result.length; i++) {
        result[i].id = bigInt(result[i].id);
      }

      this.setInputValue("categories", result);
    } catch (e) {
      console.log(e);
    }

    this.getAllProducts();
  }

  findCategoryName(categoryId) {
    let categories = this.state.categories;

    return categories[
      categories.findIndex(
        (element) => element.id.toString() === categoryId.toString()
      )
    ].label;
  }

  async componentDidMount() {
    this.getAllCategories();
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Name",
          selector: "label",
          // style: { width: "250px" },
        },
        /*
        {
          name: "Code",
          selector: "code",
          // style: { width: "250px" },
        },
        */
        {
          name: "Brand",
          selector: "brandName",
          // style: { width: "250px" },
        },
        /*
        {
          name: "Description",
          selector: "description",
          // style: { width: "250px" },
        },
        */
        {
          name: "Category",
          selector: "category",
          // style: { width: "250px" },
        },
      ];
    /*  
    if (role === "Maxis-Services-LM-Administrator")
      columnData = [
        { name: "Id", selector: "id", style: { width: "250px" } },
        {
          name: "Created on",
          selector: "creationDate",
          style: { width: "150px" },
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
    let tableData = this.state.tableData;
    // let actions = this.state.actions;

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">Product Management</div>
          </div>
        </div>

        <hr />

        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>
          <div className="p-col-6 p-lg-3 p-order-md-3">
            <Button
              label="New"
              onClick={() => this.newProduct()}
              className="p-button-raised p-button-info"
            />
          </div>
        </div>

        {AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" && (
          <hr />
        )}

        {/* <div className="p-grid fixedwidth512"> */}
        {/* <div className="datatable-filter-demo" style={{ overflowX: "auto" }}> */}
        <div>
          <DataTable
            value={tableData}
            paginator
            rows={10}
            className="p-datatable-customers"
          >
            {columnData &&
              columnData.map((value, index) => {
                if (index === 1)
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
                              label="EDIT"
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
export default withRouter(ProductList);
