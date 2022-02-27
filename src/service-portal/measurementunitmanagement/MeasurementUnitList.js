import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";

class MeasurementUnitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
      uoms: [],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.newMeasurementUnitCategory =
      this.newMeasurementUnitCategory.bind(this);
    this.viewEntity = this.viewEntity.bind(this);
    this.pageTitle = "Unit of Measurement Management";
    this.pageSubTitle = "Unit of Measurement Categories";
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    this.getCategoriesAPI = {
      path:
        "maxisservice-inventory-service/endpoint/api/unit-of-measure-category/" +
        AuthUtil.getTanentId(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getUomAPI = {
      path:
        "maxisservice-inventory-service/endpoint/api/unit-of-measure/" +
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
      pathname: "/measurement-unit-details",
      state: {},
    });
  }

  viewEntity(item) {
    this.props.history.push({
      pathname: "/view-measurement-unit",
      state: {
        item: item,
        uoms: this.state.uoms,
      },
    });
    console.log("====item====");
    console.log(item);
  }

  async getCategories() {
    console.log("mounting");
    const payLoad = {
      userId: AuthUtil.getUserId(),
    };
    console.log(payLoad);
    try {
      let response = await fetch(this.gwUrl + this.getCategoriesAPI.path, {
        method: "GET",
        headers: this.getCategoriesAPI.headers,
      });
      let result = await response.json();
      this.setInputValue("tableData", result);
    } catch (e) {
      console.log(e);
    }
    console.log("mounted");
  }

  async getUom() {
    let uomArray = [];
    try {
      let res = await fetch(this.gwUrl + this.getUomAPI.path, {
        method: "GET",
        headers: this.getUomAPI.headers,
      });
      let response = await res.json();

      uomArray = response;
    } catch (e) {
      console.log(e);
    }
    this.setInputValue("uoms", uomArray);
  }

  componentDidMount() {
    this.getCategories();
    this.getUom();
  }

  getComponentDesign() {
    let columnData = [];

    columnData = [
      {
        name: "Category Code",
        selector: "code",
        // style: { width: "150px" },
      },
      {
        name: "Category Name",
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
    let actions = this.state.actions;

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

        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">{this.pageSubTitle}</div>
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
export default withRouter(MeasurementUnitList);
