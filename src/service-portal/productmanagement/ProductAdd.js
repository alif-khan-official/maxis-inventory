import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
// import InputFieldComponentv2 from "../onboarding/FormComponent/InputFieldComponentv2";
import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";
// import Multiselect from "multiselect-react-dropdown";

import SelectSearch, { fuzzySearch } from "react-select-search";

import ProductAttributes from "./ProductAttributes";

var bigInt = require("big-integer");

class ProductAdd extends React.Component {
  constructor(props) {
    /*
    let val = new Date();
    let year = val.getFullYear();
    let month = val.getMonth() + 1;
    let day = val.getDate();
    let date = year + "-";

    date = date + (month < 10 ? "0" : "") + month + "-";
    date = date + (day < 10 ? "0" : "") + day;
    */
    console.log("========data attempt========");
    super(props);
    console.log(this.props);
    /*
    let roleList = AuthUtil.getRoleList();
    console.log(roleList);
    let roleId = "";

    for (let index = 0; index < roleList.length; index++) {
      if (roleList[index].name === "admin") {
        roleId = roleList[index].code;
        break;
      } else {
        roleId = roleList[index].code;
        break;
      }
    }
    */
    this.state = {
      options: [],
      selectedValue: [],
      pCategoryArray: [],
      pCategories: [],
      productCategoryId: 0,
      // fields: [],
      designName: "Form",
      // fieldvalues: [],
      activeStep: 0,
      lastStep: 0,
      steps: [],
      blankArray: [],
      productName: "",
      productCode: "",
      description: "",
      brand: "",
      // roleName: roleId,
      resultPresent: false,
      resultPresentProcessing: false,
      resultPresentFailure: false,
      resultPresentSuccess: false,
      saveOperation: false,
      responseMessage: "",

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
      variants: [],
      variant: "",
      matchedVariants: [],
      key: false,
    };

    this.setInputValue = this.setInputValue.bind(this);
    // this.setFieldValue = this.setFieldValue.bind(this);
    this.handleProductCategoryChange =
      this.handleProductCategoryChange.bind(this);
    this.handleProductName = this.handleProductName.bind(this);

    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
  }

  handleProductName(value) {
    let productName = value;
    let productCode = value.toUpperCase().replace(/\s/g, "");
    let description = value.toUpperCase().replace(/\s/g, "");

    this.setInputValue("productName", productName);
    this.setInputValue("productCode", productCode);
    this.setInputValue("description", description);
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

  async saveProduct() {
    let productName = this.state.productName;
    let productCategoryId = this.state.productCategoryId;
    let productCode = this.state.productCode;
    let tanentId = AuthUtil.getTanentId();
    let description = this.state.description;
    let brandName = this.state.brand;

    if (!productCategoryId) {
      this.setInputValue("responseMessage", "Choose Product Category");
      return;
    } else if (!productName) {
      this.setInputValue("responseMessage", "Enter Product Name");
      return;
    } else if (!brandName) {
      this.setInputValue("responseMessage", "Enter Brand Name");
      return;
    } else {
      this.setInputValue("responseMessage", "");

      console.log("saving");
      const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

      const payLoad = {
        code: productCode,
        label: productName,
        productCategoryId: productCategoryId,
        tanentId: tanentId,
        description: description,
        brandName: brandName,
      };
      console.log(payLoad);
      try {
        let response = await fetch(gwUrl + this.addAPI.path, {
          method: "POST",
          headers: this.addAPI.headers,
          body: JSON.stringify(payLoad),
        });

        let result = await response.json();
        this.setInputValue("saveOperation", result);
      } catch (e) {
        console.log(e);
      }
      console.log("save operation finished");

      this.setInputValue("key", !this.state.key);
    }
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  componentDidMount() {
    this.getAllProductsCategory();
  }

  getComponentDesign() {
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Product Details</b>
          </h3>
        </div>
        <hr />
        <div>
          <table className="width100">
            <tbody className="width100">
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2"></label>
                </td>
                <td className="width75">
                  <div className="p-d-flex">
                    {this.state.responseMessage && (
                      <div style={{ fontSize: "15px", color: "red" }}>
                        {this.state.responseMessage}
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    <b>Product Category</b>
                  </label>
                </td>
                <td>
                  <SelectSearch
                    options={this.state.pCategories}
                    search
                    // value={this.state.product}
                    onChange={this.handleProductCategoryChange}
                    filterOptions={fuzzySearch}
                    emptyMessage="Nothing Found"
                    placeholder="Choose Product Category"
                  />
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    <b>Name</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter Name"
                      value={
                        this.state.productName === undefined
                          ? ""
                          : this.state.productName
                      }
                      onChange={(v) => this.handleProductName(v.target.value)}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    <b>Brand</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter Brand Name"
                      value={
                        this.state.brand === undefined ? "" : this.state.brand
                      }
                      onChange={(e) =>
                        this.setInputValue("brand", e.target.value)
                      }
                    ></input>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
          <div className="p-mb-2 p-mr-2">
            <Button
              label="Save"
              onClick={() => this.saveProduct()}
              className="p-button-raised p-button-primary"
            />
          </div>
        </div>

        {this.state.saveOperation === true && (
          <div className="divsuccess">
            <div
              width="100%"
              style={{
                textAlign: "left",
                backgroundColor: "#22cc22",
                color: "#ffffff",
              }}
            >
              <h5>
                <span role="img" aria-labelledby="panda1">
                  ✅
                </span>
                Product is saved.
              </h5>
            </div>
            <hr />
          </div>
        )}

        {this.state.saveOperation && !(this.state.saveOperation === true) && (
          <div className="divfailure">
            <div
              width="100%"
              style={{
                textAlign: "left",
                backgroundColor: "#ff7777",
                color: "#ffffff",
              }}
            >
              <h5>
                <span role="img" aria-labelledby="panda1">
                  ❌
                </span>
                Product is not saved.
              </h5>
            </div>
            <hr />
          </div>
        )}

        <ProductAttributes key={this.state.key} />
      </div>
    );
    return design;
  }

  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(ProductAdd);
