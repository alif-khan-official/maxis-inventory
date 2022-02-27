import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import InputFieldComponentv2 from "../onboarding/FormComponent/InputFieldComponentv2";
import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class ProductAdd extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    let data = this.props.location.state.item;

    this.state = {
      productName: data.label,
      attributeListV: data.attributeList,
      avlba: [],
      productCode: data.code,
      description: "",

      saveOperation: false,
      responseMessage: "",

      table: false,

      product: "",
      uomCategoriesid: "",
      variants: [],
      variant: "",
      matchedVariants: [],
      variantName: "",
      variantCode: "",
      baseUnitOfMeasureId: bigInt(data.baseUnitOfMeasure.id),
      productId: bigInt(data.id),
      tenantId: AuthUtil.getTanentId(),
      savedAttributeValueValue: [],
    };

    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.setInputValue = this.setInputValue.bind(this);
    this.handleAttributeValueChange =
      this.handleAttributeValueChange.bind(this);
    this.handleVariantName = this.handleVariantName.bind(this);

    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product-variant",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
  }

  async saveProductVariant() {
    if (!this.state.variantName) {
      this.setInputValue("responseMessage", "Variant Name is empty");
      return;
    } else if (!this.state.variantCode) {
      this.setInputValue("responseMessage", "Variant Code is empty");
      return;
    } else {
      for (let i = 0; i < this.state.savedAttributeValueValue.length; i++) {
        if (
          this.state.savedAttributeValueValue[i].attributeValueId ===
            undefined ||
          !this.state.savedAttributeValueValue[i].attributeValueId
        ) {
          this.setInputValue(
            "responseMessage",
            "Choose Attribute Values for all Attributes"
          );
          return;
        }
      }
      this.setInputValue("responseMessage", "");

      console.log("saving");
      const payLoad = {
        baseUnitOfMeasureId: this.state.baseUnitOfMeasureId,
        code: this.state.variantCode,
        label: this.state.variantName,
        productId: this.state.productId,
        tenantId: this.state.tenantId,
        variantAttributes: this.state.savedAttributeValueValue,
        description: this.state.description,
      };
      console.log(payLoad);
      try {
        let response = await fetch(this.gwUrl + this.addAPI.path, {
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
    }
  }

  async getAllAttributeValue() {
    this.avlba = [];
    let avlba = this.state.attributeListV;
    // let savedAttributeValueValue = [];
    for (let i = 0; i < this.state.attributeListV.length; i++) {
      try {
        let res = await fetch(
          this.gwUrl +
            "maxisservice-inventory-service/endpoint/api/attribute-value/" +
            bigInt(this.state.attributeListV[i].id).toString(),
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

        let initValue = {
          attributeId: this.state.attributeListV[i].id,
          attributeLabel: this.state.attributeListV[i].label,
          attributeValueId: 0,
          attributeValueLabel: "",
        };

        this.state.savedAttributeValueValue.push(initValue);

        for (let j = 0; j < response.length; j++) {
          response[j].value = JSON.stringify({
            id: bigInt(response[j].id),
            label: response[j].label,
          });
          response[j].name = response[j].label;
        }
        //this.setInputValue("pCategories", response);
        avlba[i].valueList = response;
      } catch (e) {
        console.log(e);
      }
    }
    this.avlba = avlba;
    this.setInputValue("attributeListV", avlba);
    this.setInputValue(
      "savedAttributeValueValue",
      this.state.savedAttributeValueValue
    );
    // console.warn("existed the for loop");
  }

  handleAttributeValueChange(id, name, value) {
    //this.setState({});

    // console.log(id, name, value);
    console.log(id);
    console.log(name);
    let av = JSON.parse(value);
    console.log(av);

    let savedAttributeValueValue = this.state.savedAttributeValueValue;

    for (let i = 0; i < savedAttributeValueValue.length; i++) {
      if (id === savedAttributeValueValue[i].attributeId) {
        savedAttributeValueValue[i].attributeValueId = av.id;
        savedAttributeValueValue[i].attributeValueLabel = av.label;
      }
    }
    this.setInputValue("savedAttributeValueValue", savedAttributeValueValue);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  componentDidMount() {
    this.getAllAttributeValue();
  }

  getComponentDesign() {
    /*  
    let dubugValue =
      this.state.attributeListV && this.state.attributeListV.length > 0
        ? this.state.attributeListV[0]
        : {};
    */
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Add New Variant</b>
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
                      readOnly={true}
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
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Variant Name</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Variant Name"
                      id="variantName"
                      value={
                        this.state.variantName === undefined
                          ? ""
                          : this.state.variantName
                      }
                      onChange={(val) => this.setInputValue("variantName", val)}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Variant Code</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Variant Code"
                      id="variantCode"
                      value={
                        this.state.variantCode === undefined
                          ? ""
                          : this.state.variantCode
                      }
                      onChange={(val) => this.setInputValue("variantCode", val)}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Variant Description
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <textarea
                      style={{ fontFamily: "Helvetica" }}
                      className="form-input"
                      type="text"
                      placeholder="Type Description"
                      // value={this.state.description}
                      onChange={(e) =>
                        this.setInputValue("description", e.target.value)
                      }
                    ></textarea>
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Attributes</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <table className="width100">
                      <tbody className="width100">
                        <tr>
                          <td className="width25">
                            <label
                              style={{ fontWeight: "bold" }}
                              className="form-input-label2"
                            >
                              Attribute Name
                            </label>
                          </td>
                          <td>
                            <label
                              style={{ fontWeight: "bold" }}
                              className="form-input-label2"
                            >
                              Attribute Value
                            </label>
                          </td>
                        </tr>
                        {this.state.attributeListV &&
                          this.state.attributeListV.length > 0 &&
                          this.state.attributeListV.map((value, index) => {
                            let avRow = (
                              <tr>
                                <td>{value.label}</td>
                                <td>
                                  {/*
                                  JSON.stringify(value.valueList)
                                    */}
                                  <SelectSearch
                                    options={value.valueList}
                                    search
                                    //value={uomm}
                                    onChange={(v) => {
                                      this.handleAttributeValueChange(
                                        value.id,
                                        value.label,
                                        v
                                      );
                                    }}
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Nothing Found"
                                    placeholder="Choose attribute value"
                                    displayValue=""
                                  />
                                </td>
                              </tr>
                            );
                            return avRow;
                          })}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
          <div className="p-mb-2 p-mr-2">
            <Button
              label="Add"
              onClick={() => this.saveProductVariant()}
              className="p-button-raised p-button-secondary"
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
                Product Variant is saved.
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
                Product Variant is not saved.
              </h5>
            </div>
            <hr />
          </div>
        )}
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
