import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";

class ProductCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.newProductcategory = this.newProductcategory.bind(this);
    this.viewEntity = this.viewEntity.bind(this);
    this.findCategoryName = this.findCategoryName.bind(this);
    this.pageTitle = "Product Type Management";
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.list = {
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

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  newProductcategory() {
    this.props.history.push({
      pathname: "/product-category-details",
      state: {},
    });
  }

  viewEntity(item) {
    this.props.history.push({
      pathname: "/view-product-category",
      state: {
        item: item,
        types: this.state.tableData,
      },
    });
    console.log("====item====");
    console.log(item);
  }

  async getTypes() {
    let c = [];

    try {
      let response = await fetch(this.gwUrl + this.list.path, {
        method: "GET",
        headers: this.list.headers,
      });
      let result = await response.json();

      c = this.findCategoryName(result);
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("tableData", c);
  }

  findCategoryName(categories) {
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (categories[i].parentId === categories[j].id) {
          categories[i].parentLabel = categories[j].label;
        }
      }
    }
    return categories;
  }

  async componentDidMount() {
    /*
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
      this.setInputValue("tableData", result);
    } catch (e) {
      console.log(e);
    }
    console.log("mounted");
    */
    this.getTypes();
    // this.findCategoryName(this.state.tableData);
  }

  getComponentDesign() {
    let columnData = [
      // { name: "Id", selector: "id", style: { width: "250px" } },
      /*
      {
        name: "Code",
        selector: "code",
        // style: { width: "150px" },
      },
      */
      {
        name: "Name",
        selector: "label",
        // style: { width: "250px" }
      },
      {
        name: "Description",
        selector: "description",
        // style: { width: "250px" },
      },
      /*
      {
        name: "Active",
        selector: "active",
        style: { width: "150px" },
      },
      
      {
        name: "Parent Type",
        selector: "parentId",
        style: { width: "150px" },
      },
      
      {
        name: "Tenant",
        selector: "tanentId",
        style: { width: "250px", textAlign: "right" },
      },
      */
      {
        name: "Parent Type",
        selector: "parentLabel",
        // style: { width: "250px" }
      },
    ];
    let tableData = this.state.tableData;
    // let actions = this.state.actions;

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">{this.pageTitle}</div>
          </div>
        </div>
        <hr />

        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>
          <div className="p-col-6 p-lg-3 p-order-md-3">
            <Button
              label="New"
              onClick={() => this.newProductcategory()}
              className="p-button-raised p-button-info"
            />
          </div>
        </div>

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
            actions && (
              <Column
                header="Action"
                // style={{ width: "256px" }}
                style={{ width: "120px" }}
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
            )
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
export default withRouter(ProductCategoryList);
