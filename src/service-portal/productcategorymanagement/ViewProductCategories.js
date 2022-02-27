import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../common/MainComponent";
import "../../App.css";

class ViewProductCategories extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    let data = this.props.location.state.item;
    let productTypes = this.props.location.state.types;
    // const stepDisplayStyleActive = { display: "block" };
    // const stepDisplayStyleInactive = { display: "none" };

    this.state = {
      productTypes: productTypes,
      parentId: data.id,

      // stepDisplayStyleActive: stepDisplayStyleActive,
      // stepDisplayStyleInactive: stepDisplayStyleInactive,

      table: false,

      typeArray: [],
      types: [],
      filteredTypes: [],
      parentType: data.label,
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.pageTitle = "Product Type Management";
    // this.pageSubTitle = data.label;
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  async getFilteredType() {
    for (let i = 0; i < this.state.productTypes.length; i++) {
      this.state.productTypes[i].praentType = this.state.parentType;
    }

    this.setInputValue(
      " filteredTypes",
      this.state.productTypes.filter(
        (type) => type.parentId === this.state.parentId
      )
    );
  }
  componentDidMount() {
    this.getFilteredType();
    console.log("mounting");
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
      {
        name: "Parent Type",
        selector: "praentType",
        // style: { width: "250px" },
      },
    ];
    let tableData = this.state.filteredTypes;

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
              {"Parent Type: " + this.pageSubTitle}
            </div>
          </div>
        </div>
    */}
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
export default withRouter(ViewProductCategories);
