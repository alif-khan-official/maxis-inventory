import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../common/MainComponent";
import "../../App.css";

class ViewMeasurementUnits extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    let data = this.props.location.state.item;
    let uoms = this.props.location.state.uoms;
    // const stepDisplayStyleActive = { display: "block" };
    // const stepDisplayStyleInactive = { display: "none" };

    this.state = {
      tableData: uoms,
      unitOfMeasureCategoryId: data.id,

      // stepDisplayStyleActive: stepDisplayStyleActive,
      // stepDisplayStyleInactive: stepDisplayStyleInactive,

      filteredUoms: [],
      uomCategory: data.label,
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.pageTitle = "Unit of Measurement Management";
    // this.pageSubTitle = data.label;
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  async getFilteredUom() {
    for (let i = 0; i < this.state.tableData.length; i++) {
      this.state.tableData[i].uomCategory = this.state.uomCategory;
    }

    this.setInputValue(
      "filteredUoms",
      this.state.tableData.filter(
        (uom) =>
          uom.unitOfMeasureCategoryId === this.state.unitOfMeasureCategoryId
      )
    );
  }
  componentDidMount() {
    this.getFilteredUom();
    console.log("mounting");
    console.log("mounted");
  }

  getComponentDesign() {
    let columnData = [];

    columnData = [
      {
        name: "Parent Category",
        selector: "uomCategory",
        // style: { width: "250px" },
      },
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
      {
        name: "Ratio to Parent Unit",
        selector: "ratioToParentUnitOfMeasure",
        // style: { width: "250px" },
      },
    ];

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">{this.pageTitle}</div>
          </div>
        </div>

        <hr />
        {/*
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">
              {"Parent Category: " + this.pageSubTitle}
            </div>
          </div>
        </div>
        */}
        <div className="p-grid fixedwidth512">
          <div className="datatable-filter-demo">
            <DataTable
              value={this.state.filteredUoms}
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
export default withRouter(ViewMeasurementUnits);
