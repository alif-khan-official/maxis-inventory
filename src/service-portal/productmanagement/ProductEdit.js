import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import InputFieldComponentv2 from "../onboarding/FormComponent/InputFieldComponentv2";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";
import Multiselect from "multiselect-react-dropdown";

import SelectSearch, { fuzzySearch } from "react-select-search";
// import "../../style.css";

let response;
var bigInt = require("big-integer");

class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    let data = this.props.location.state.item;

    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],

      options: [],
      attributePost: [],

      pCategoryArray: [],
      pCategories: [],

      uomCategoryArray: [],
      uomCategories: [],

      // attributeList: [],
      // productCategoryId: 0,

      uom: [],

      fields: [],
      designName: "Form",
      fieldvalues: [],
      activeStep: 0,
      lastStep: 0,
      steps: [],
      blankArray: [],
      productId: bigInt(data.id),
      productName: data.label,
      productCode: data.code,
      description: data.description,
      productCategoryId: data.productCategoryId,
      unitOfMeasureCategoryId: data.unitOfMeasureCategoryId,
      baseUnitOfMeasure: data.baseUnitOfMeasure.label,
      selectedValue: data.attributeList,
      attributeList: data.attributeList,

      resultPresent: false,
      resultPresentProcessing: false,
      resultPresentFailure: false,
      resultPresentSuccess: false,
      saveOperation: false,

      meta: [],
      dropdowns: [],
      customerId: "",
      customerPhoneNumber: "",
      customerName: "",
      customerList: [],
      customerDropDownList: [],
      dropDownsDependencies: [],
      dropDownValues: [],

      quantity: "",
      table: false,

      fullTable: [],
      products: [],
      product: "",
      uomCategoriesid: "",
      variants: [],
      variant: "",
      matchedVariants: [],
      items: data,
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);

    this.handleProductCategoryChange =
      this.handleProductCategoryChange.bind(this);
    this.handleProductChangeUom = this.handleProductChangeUom.bind(this);

    this.onSelect = this.onSelect.bind(this);
    this.newVariant = this.newVariant.bind(this);

    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getAllProductVariantsAPI = {
      path:
        "maxisservice-inventory-service/endpoint/api/product-variant-by-productid/" +
        this.state.productId.toString(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
  }

  handleProductChangeUom(selectedProductValue) {
    this.setState(
      {
        uomCategoriesid: selectedProductValue,
      },
      this.getAllUnitOfMeasure
    );
  }

  async getAllUomCategories() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    try {
      let res = await fetch(
        gwUrl +
          "maxisservice-inventory-service/endpoint/api/unit-of-measure-category/" +
          AuthUtil.getTanentId(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer " + AuthUtil.getIdToken(),
            userid: AuthUtil.getUserId(),
          },
        }
      );
      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        this.state.uomCategoryArray.push({
          name: response[i].label,
          value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setState({
      uomCategories: this.state.uomCategoryArray,
    });
  }

  handleProductCategoryChange(selectedProductValue) {
    this.setState({
      productCategoryId: selectedProductValue,
    });
  }

  async getAllProductsCategory() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(
        gwUrl +
          "maxisservice-inventory-service/endpoint/api/product-category/" +
          AuthUtil.getTanentId(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer " + AuthUtil.getIdToken(),
            userid: AuthUtil.getUserId(),
          },
        }
      );
      let response = await res.json();
      for (let i = 0; i < response.length; i++) {
        this.state.pCategoryArray.push({
          name: response[i].label,
          value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setState({
      pCategories: this.state.pCategoryArray,
    });
  }

  async getAllAttributeList() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      fetch(
        gwUrl +
          "maxisservice-inventory-service/endpoint/api/attribute/" +
          AuthUtil.getTanentId(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer " + AuthUtil.getIdToken(),
            userid: AuthUtil.getUserId(),
          },
        }
      )
        .then((res) => res.json())
        .then((json) => json)
        .then((result) => {
          this.setInputValue("options", result);
        });
    } catch (e) {
      //console.log(e);
    }
  }

  async getAllUnitOfMeasure() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    let id = bigInt(this.state.uomCategoriesid);

    try {
      let res = await fetch(
        gwUrl +
          "maxisservice-inventory-service/endpoint/api/base-unit-of-measure-by-uom-categoryid/" +
          id.toString(),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer " + AuthUtil.getIdToken(),
            userid: AuthUtil.getUserId(),
          },
        }
      );
      response = await res.json();
      this.setState({ uom: response });
    } catch (e) {
      console.log(e);
    }
  }

  onSelect(selectedList, selectedItem) {
    this.setInputValue("attributePost", selectedList);
  }

  handleProductChange(selectedProductValue) {
    this.setState({
      product: selectedProductValue,
      matchedVariants: this.state.variants.filter(
        (variant) => variant.productValue === selectedProductValue
      ),
    });
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  newVariant() {
    this.props.history.push({
      pathname: "/new-product-variant",
      state: { item: this.state.items },
    });
  }

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

  async getAllProductVariants() {
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(gwUrl + this.getAllProductVariantsAPI.path, {
        method: "GET",
        headers: this.getAllProductVariantsAPI.headers,
      });
      let response = await res.json();
      this.setInputValue("tableData", response);
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.getAllProductsCategory();
    this.getAllAttributeList();
    this.getAllUomCategories();
    this.getAllProductVariants();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.uomCategoriesid !== this.state.uomCategoriesid) {
      // this.getAllUnitOfMeasure();
      // uomm=this.state.uom.label;
      this.setState({ uom: this.state.blankArray });
    }
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;
    let tableData = this.state.tableData;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Name",
          selector: "label",
          // style: { width: "250px" },
        },

        {
          name: "Code",
          selector: "code",
          // style: { width: "250px" },
        },

        {
          name: "Description",
          selector: "description",
          // style: { width: "250px" },
        },
      ];
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

    let actions = this.state.actions;
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Edit Product</b>
          </h3>
        </div>
        <hr />
        <div>
          <table className="width100">
            <tbody className="width100">
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Product Name</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Product Name"
                      id="productName"
                      value={
                        this.state.productName === undefined
                          ? ""
                          : this.state.productName
                      }
                      onChange={(val) => this.setInputValue("productName", val)}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Product Code</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Product Code"
                      id="productCode"
                      value={
                        this.state.productCode === undefined
                          ? ""
                          : this.state.productCode
                      }
                      onChange={(val) => this.setInputValue("productCode", val)}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Description</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Description"
                      id="description"
                      value={
                        this.state.description === undefined
                          ? ""
                          : this.state.description
                      }
                      onChange={(val) => this.setInputValue("description", val)}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Product Category</label>
                </td>
                <td>
                  <SelectSearch
                    options={this.state.pCategories}
                    search
                    value={this.state.productCategoryId}
                    onChange={this.handleProductCategoryChange}
                    filterOptions={fuzzySearch}
                    emptyMessage="Nothing Found"
                    placeholder="Product Category"
                  />
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Attributes</label>
                </td>
                <td className="width75">
                  <Multiselect
                    className="form-input-label2"
                    options={this.state.attributeList} // Options to display in the dropdown
                    placeholder="Choose Attributes"
                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                    onSelect={this.onSelect} // Function will trigger on select event
                    // onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue="label" // Property name to display in the dropdown options
                  />
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Unit Of measurement Category
                  </label>
                </td>
                <td>
                  <SelectSearch
                    options={this.state.uomCategories}
                    search
                    value={this.state.unitOfMeasureCategoryId}
                    onChange={this.handleProductChangeUom}
                    filterOptions={fuzzySearch}
                    emptyMessage="Nothing Found"
                    placeholder="Choose measurement category"
                  />
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Base Unit Of measurement
                  </label>
                </td>
                <td className="width25">
                  <InputFieldComponentv2
                    className="form-input-label2"
                    type="text"
                    placeholder="Base UOM"
                    id="uom"
                    value={this.state.baseUnitOfMeasure}
                    onChange={(val) => this.setInputValue("uom", val)}
                    readOnly={true}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
          <div className="p-mb-2 p-mr-2">
            <Button
              label="Update"
              // onClick={() => this.saveProduct()}
              className="p-button-raised p-button-secondary"
            />
          </div>
        </div>

        <hr />

        <div className="card">
          <div className="p-d-flex border">
            <div className="p-col-12 p-lg-12">
              <div className="table-header">Product Variants</div>
            </div>
          </div>

          <hr />

          <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}>
            <div className="p-col-6 p-lg-3 p-order-md-3">
              <Button
                label="New"
                onClick={() => this.newVariant()}
                className="p-button-raised p-button-info"
              />
            </div>
          </div>

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
                    if (index === 1)
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
                          //body={this.dateTemplate}
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
                              <Button label="EDIT" onClick={() => {}} />
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
      </div>
    );
    return design;
  }

  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(ProductEdit);
