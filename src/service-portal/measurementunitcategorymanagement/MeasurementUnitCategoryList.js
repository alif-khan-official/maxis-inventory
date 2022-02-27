import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";

class MeasurementUnitCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.newMeasurementUnitCategory =
      this.newMeasurementUnitCategory.bind(this);
    this.pageTitle = "Unit of Measurement Category Management";
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.list = {
      path:
        "maxisservice-inventory-service/endpoint/api/unit-of-measure-category/" +
        AuthUtil.getTanentId(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getAllProductsAPI = {
      path:
        "maxisservice-inventory-service/endpoint/api/product-by-tenantid/" +
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

  newMeasurementUnitCategory() {
    this.props.history.push({
      pathname: "/measurement-unit-category-details",
      state: {},
    });
  }

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
      this.setInputValue("tableData", result);
    } catch (e) {
      console.log(e);
    }
    console.log("mounted");
  }

  getComponentDesign() {
    let columnData = [];

    columnData = [
      {
        name: "Code",
        selector: "code",
        // style: { width: "150px" },
      },
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

        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>
          <div className="p-col-6 p-lg-3 p-order-md-3">
            <Button
              label="New"
              onClick={() => this.newMeasurementUnitCategory()}
              className="p-button-raised p-button-info"
            />
          </div>
        </div>

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
export default withRouter(MeasurementUnitCategoryList);
