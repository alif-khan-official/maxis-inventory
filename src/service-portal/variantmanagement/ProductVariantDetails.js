import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class ProductVariantDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    this.state = {
      description: "",
      saveOperation: false,
      responseMessage: "",
      variantName: "",
      variantCode: "",
      productId: "",
      tenantId: AuthUtil.getTanentId(),

      products: [],
      attributesWithValues: {
        tenantId: null,
        productId: 0,
        attributeList: [],
      },
      variantAttributes: [],

      skuWithVariants: [
        {
          basicSKUUnit: {
            id: "",
            name: "",
            value: "",
          },
          unitOfMeasures: [
            {
              // id: null,
              code: "",
              label: "",
              unitOfMeasureCategoryId: 0,
              parentUnitOfMeasureId: 0,
              ratioToParentUnitOfMeasure: 1,
              tenantId: AuthUtil.getTanentId(),
              active: true,
              baseUnit: true,
              readOnly: true,
            },
          ],
          unitPrice: "",
          dimension: {
            height: "",
            length: "",
            width: "",
          },
          grossWeight: "",
        },
      ],
      units: [],
    };

    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product-variant-batch",
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
    this.getAllAttributesAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product-attribute-value/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getAllUnitsAPI = {
      path: "maxisservice-inventory-service/endpoint/api/basicunit/system/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };

    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.setInputValue = this.setInputValue.bind(this);
    this.handleVariantName = this.handleVariantName.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleAttributeValueChange =
      this.handleAttributeValueChange.bind(this);
    this.handleUnitChange = this.handleUnitChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.convertAttributeIdsToBigInt =
      this.convertAttributeIdsToBigInt.bind(this);
    this.checkAttributeNameAndValues =
      this.checkAttributeNameAndValues.bind(this);
    this.handleAddSKU = this.handleAddSKU.bind(this);
    this.handleAddUom = this.handleAddUom.bind(this);
    this.handleUomChange = this.handleUomChange.bind(this);
    this.handleRatioChange = this.handleRatioChange.bind(this);
    this.handleRemoveUom = this.handleRemoveUom.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleDimensionChange = this.handleDimensionChange.bind(this);
    this.checkSKU = this.checkSKU.bind(this);
    this.checkUom = this.checkUom.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  handlePriceChange(value, index) {
    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].unitPrice = value;

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  checkSKU(skuWithVariants) {
    for (let i = 0; i < skuWithVariants.length; i++) {
      if (
        skuWithVariants[i].basicSKUUnit.id === "" ||
        skuWithVariants[i].basicSKUUnit.value === ""
      ) {
        this.setInputValue("responseMessage", "Fill Basic SKU Fields");
        return true;
      } else if (skuWithVariants[i].unitPrice === "") {
        this.setInputValue("responseMessage", "Enter Unit Price");
        return true;
      } else if (
        /*
      else if (this.checkUom(skuWithVariants, skuWithVariants[i]) === true) {
        return true;
      }
      */
        skuWithVariants[i].dimension.height === "" ||
        skuWithVariants[i].dimension.width === "" ||
        skuWithVariants[i].dimension.length === ""
      ) {
        this.setInputValue("responseMessage", "Fill Dimension Fields");
        return true;
      } else if (skuWithVariants[i].grossWeight === "") {
        this.setInputValue("responseMessage", "Enter Gross Weight");
        return true;
      }
    }
    return this.checkUom(skuWithVariants);
  }

  checkUom(skuWithVariants) {
    for (let i = 0; i < skuWithVariants.length; i++) {
      for (let j = 0; j < skuWithVariants[i].unitOfMeasures.length; j++) {
        if (
          skuWithVariants[i].unitOfMeasures[j].label === "" ||
          skuWithVariants[i].unitOfMeasures[j].ratioToParentUnitOfMeasure === ""
        ) {
          this.setInputValue("responseMessage", "Fill Unit of Measure Fields");
          return true;
        }
      }
    }
  }

  handleDimensionChange(value, index, property) {
    let skuWithVariants = this.state.skuWithVariants;

    if (property === "height") {
      skuWithVariants[index].dimension.height = value;
    } else if (property === "width") {
      skuWithVariants[index].dimension.width = value;
    } else if (property === "length") {
      skuWithVariants[index].dimension.length = value;
    }

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleWeightChange(value, index) {
    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].grossWeight = value;

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleRemoveUom(index, i) {
    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].unitOfMeasures.splice(i, 1);

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleRatioChange(value, index, i) {
    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].unitOfMeasures[i].ratioToParentUnitOfMeasure = value;

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleUomChange(value, index, i) {
    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].unitOfMeasures[i].label = value;
    skuWithVariants[index].unitOfMeasures[i].code = value
      .toUpperCase()
      .replace(/\s/g, "");

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleAddSKU() {
    let skuWithVariants = this.state.skuWithVariants;

    // if (this.state.skuWithVariants.length > 0) {
    if (this.checkSKU(this.state.skuWithVariants) === true) {
      return;
    }
    //  }

    skuWithVariants.push({
      basicSKUUnit: {
        id: "",
        name: "",
        value: "",
      },

      unitOfMeasures: [
        {
          // id: null,
          code: "",
          label: "",
          unitOfMeasureCategoryId: 0,
          parentUnitOfMeasureId: 0,
          ratioToParentUnitOfMeasure: 1,
          tenantId: AuthUtil.getTanentId(),
          active: true,
          baseUnit: true,
          readOnly: true,
        },
      ],
      unitPrice: "",
      dimension: {
        height: "",
        length: "",
        width: "",
      },
      grossWeight: "",
    });

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleAddUom(index) {
    let skuWithVariants = this.state.skuWithVariants;
    if (this.checkUom(skuWithVariants) === true) {
      return;
    }

    skuWithVariants[index].unitOfMeasures.push({
      // id: null,
      code: "",
      label: "",
      unitOfMeasureCategoryId: 0,
      // parentUnitOfMeasureId: 0,
      ratioToParentUnitOfMeasure: "",
      tenantId: AuthUtil.getTanentId(),
      active: true,
      baseUnit: false,
      readOnly: false,
    });

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleAttributeValueChange(id, value) {
    let av = JSON.parse(value);
    console.log(av);

    let variantAttributes = this.state.variantAttributes;

    for (let i = 0; i < variantAttributes.length; i++) {
      if (id === variantAttributes[i].attributeId) {
        variantAttributes[i].attributeValueId = av.id;
        variantAttributes[i].attributeValueLabel = av.label;
      }
    }
    this.setInputValue("variantAttributes", variantAttributes);
  }

  handleUnitChange(value, index) {
    let v = JSON.parse(value);
    console.log(v);

    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].basicSKUUnit.id = v.id;
    skuWithVariants[index].basicSKUUnit.name = v.label;
    /*
    basicSKUUnit.id = v.id;
    basicSKUUnit.name = v.label;
    */
    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  handleValueChange(value, index) {
    let skuWithVariants = this.state.skuWithVariants;

    skuWithVariants[index].basicSKUUnit.value = value;
    // basicSKUUnit.value = value;

    this.setInputValue("skuWithVariants", skuWithVariants);
  }

  convertAttributeIdsToBigInt(response) {
    response.productId = bigInt(response.productId);
    for (let i = 0; i < response.attributeList.length; i++) {
      response.attributeList[i].id = bigInt(response.attributeList[i].id);
      response.attributeList[i].productId = bigInt(
        response.attributeList[i].productId
      );
      response.attributeList[i].readOnly = true;
      for (
        let j = 0;
        j < response.attributeList[i].attributeValueList.length;
        j++
      ) {
        response.attributeList[i].attributeValueList[j].id = bigInt(
          response.attributeList[i].attributeValueList[j].id
        );
        response.attributeList[i].attributeValueList[j].attributeId = bigInt(
          response.attributeList[i].attributeValueList[j].attributeId
        );
        response.attributeList[i].attributeValueList[j].readOnly = true;

        response.attributeList[i].attributeValueList[j].name =
          response.attributeList[i].attributeValueList[j].label;

        response.attributeList[i].attributeValueList[j].value = JSON.stringify({
          id: bigInt(response.attributeList[i].attributeValueList[j].id),
          label: response.attributeList[i].attributeValueList[j].label,
        });
      }

      let initValue = {
        attributeId: bigInt(response.attributeList[i].id),
        attributeLabel: response.attributeList[i].label,
        attributeValueId: 0,
        attributeValueLabel: "",
      };

      this.state.variantAttributes.push(initValue);
    }
    return response;
  }

  handleVariantName(value) {
    let variantName = value;
    let variantCode = value.toUpperCase().replace(/\s/g, "");
    let description = value.toUpperCase().replace(/\s/g, "");

    this.setInputValue("variantName", variantName);
    this.setInputValue("variantCode", variantCode);
    this.setInputValue("description", description);
  }

  handleProductChange(selectedProductValue) {
    this.setInputValue("variantAttributes", []);

    this.setState({
      productId: selectedProductValue,
    });

    this.getAllAttributes(selectedProductValue);
  }

  checkAttributeNameAndValues(variantAttributes) {
    for (let i = 0; i < variantAttributes.length; i++) {
      if (
        variantAttributes[i].attributeValueId === 0 ||
        variantAttributes[i].attributeValueLabel === ""
      ) {
        this.setInputValue(
          "responseMessage",
          "Fill All Attribute Value Fields"
        );
        return true;
      }
    }
  }

  async getAllProducts() {
    let productArray = [];
    try {
      let res = await fetch(this.gwUrl + this.getAllProductsAPI.path, {
        method: "GET",
        headers: this.getAllProductsAPI.headers,
      });

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].value = bigInt(response[i].id);
        response[i].name = response[i].label + " - " + response[i].brandName;
      }

      productArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("products", productArray);
  }

  async getAllAttributes(productId) {
    let attributeArray = [];
    try {
      let res = await fetch(
        this.gwUrl + this.getAllAttributesAPI.path + productId.toString(),
        {
          method: "GET",
          headers: this.getAllAttributesAPI.headers,
        }
      );

      let response = await res.json();

      if (response.attributeList.length > 0) {
        attributeArray = this.convertAttributeIdsToBigInt(response);
      } else {
        attributeArray = response;
      }
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("attributesWithValues", attributeArray);
  }

  async getAllUnits() {
    let unitArray = [];
    try {
      let res = await fetch(this.gwUrl + this.getAllUnitsAPI.path, {
        method: "GET",
        headers: this.getAllUnitsAPI.headers,
      });

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].name = response[i].label;
        response[i].value = JSON.stringify({
          id: bigInt(response[i].id),
          label: response[i].label,
        });
      }

      unitArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("units", unitArray);
  }

  componentDidMount() {
    this.getAllProducts();
    this.getAllUnits();
    console.log("mounting");
    console.log("mounted");
  }

  async saveProductVariant() {
    let variantName = this.state.variantName;
    let productId = this.state.productId;
    let tenantId = this.state.tenantId;
    let variantAttributes = this.state.variantAttributes;
    let skuWithVariants = this.state.skuWithVariants;

    if (!variantName) {
      this.setInputValue("responseMessage", "Enter Variant Name");
      return;
    } else if (
      variantAttributes.length > 0 &&
      this.checkAttributeNameAndValues(variantAttributes) === true
    ) {
      return;
    } else if (this.checkSKU(skuWithVariants) === true) {
      return;
    } else {
      this.setInputValue("responseMessage", "");

      console.log("saving");
      const payLoad = {
        productId: productId,
        tenantId: tenantId,
        name: variantName,
        variantAttributes: variantAttributes,
        skuWithVariants: skuWithVariants,
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

  getComponentDesign() {
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Product Variant Details</b>
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
                    <b>Product</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <SelectSearch
                      options={this.state.products}
                      search
                      onChange={this.handleProductChange}
                      filterOptions={fuzzySearch}
                      emptyMessage="Nothing Found"
                      placeholder="Choose a Product"
                    />
                  </div>
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
                        this.state.variantName === undefined
                          ? ""
                          : this.state.variantName
                      }
                      onChange={(e) => this.handleVariantName(e.target.value)}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25 alignOnTop">
                  <label className="form-input-label2">
                    <b>Attribute List</b>
                  </label>
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
                              Name
                            </label>
                          </td>
                          <td>
                            <label
                              style={{ fontWeight: "bold" }}
                              className="form-input-label2"
                            >
                              Value
                            </label>
                          </td>
                        </tr>
                        {this.state.attributesWithValues &&
                          this.state.attributesWithValues.attributeList &&
                          this.state.attributesWithValues.attributeList.length >
                            0 &&
                          this.state.attributesWithValues.attributeList.map(
                            (value, index) => {
                              let avRow = (
                                <tr key={index}>
                                  <td>{value.label}</td>
                                  <td>
                                    <SelectSearch
                                      options={value.attributeValueList}
                                      search
                                      onChange={(v) => {
                                        this.handleAttributeValueChange(
                                          value.id,
                                          v
                                        );
                                      }}
                                      filterOptions={fuzzySearch}
                                      emptyMessage="Nothing Found"
                                      placeholder="Choose attribute value"
                                    />
                                  </td>
                                </tr>
                              );
                              return avRow;
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {this.state.productId !== "" &&
          this.state.attributesWithValues.attributeList.length > 0 && (
            <div>
              <div width="100%" style={{ marginLeft: "3px" }}>
                <h3>
                  <Button
                    label="+"
                    onClick={() => this.handleAddSKU()}
                    className="p-button-raised p-button-info"
                  />
                  <b>{"  SKU"}</b>
                </h3>
              </div>

              <hr />

              <div>
                <table
                  className="width100"
                  /*
                  style={{ borderCollapse: "collapse" }}
                  */
                >
                  <tbody>
                    {this.state.skuWithVariants &&
                      this.state.skuWithVariants &&
                      this.state.skuWithVariants.length > 0 &&
                      this.state.skuWithVariants.map((value, index) => {
                        let aRow = (
                          <>
                            <tr key={index}>
                              <td className="width25">
                                <label className="form-input-label2">
                                  <b>Basic SKU</b>
                                </label>
                              </td>
                              <td className="width25">
                                <div className="d-flex">
                                  <SelectSearch
                                    options={this.state.units}
                                    // value={}
                                    search
                                    onChange={(v) => {
                                      this.handleUnitChange(v, index);
                                    }}
                                    filterOptions={fuzzySearch}
                                    emptyMessage="Nothing Found"
                                    placeholder="Choose Unit"
                                  />
                                </div>
                              </td>
                              <td className="width25">
                                <div className="d-flex">
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    placeholder="Enter Value"
                                    value={
                                      value.basicSKUUnit.value === undefined
                                        ? ""
                                        : value.basicSKUUnit.value
                                    }
                                    onChange={(e) =>
                                      this.handleValueChange(
                                        e.target.value,
                                        index
                                      )
                                    }
                                    readOnly={false}
                                  />
                                </div>
                              </td>
                              <td className="width25"></td>
                            </tr>

                            <tr>
                              <td className="width25">
                                <label className="form-input-label2">
                                  <b>Unit of Measure</b>
                                </label>
                              </td>
                              <td>
                                <div className="d-flex">
                                  <table className="width100">
                                    <tbody className="width100">
                                      <tr>
                                        <td className="width25">
                                          <label
                                            style={{ fontWeight: "bold" }}
                                            className="form-input-label2"
                                          >
                                            Unit
                                          </label>
                                        </td>
                                      </tr>

                                      {value.unitOfMeasures &&
                                        value.unitOfMeasures &&
                                        value.unitOfMeasures.length > 0 &&
                                        value.unitOfMeasures.map((v, i) => {
                                          let avRow = (
                                            <tr key={i}>
                                              <td className="width25">
                                                <div className="d-flex">
                                                  <table className="width100">
                                                    <tbody className="width100">
                                                      <tr>
                                                        <td className="width25">
                                                          <div className="d-flex">
                                                            <input
                                                              className="form-input"
                                                              type="text"
                                                              placeholder="Unit"
                                                              value={
                                                                v.label ===
                                                                undefined
                                                                  ? ""
                                                                  : v.label
                                                              }
                                                              onChange={(e) =>
                                                                this.handleUomChange(
                                                                  e.target
                                                                    .value,
                                                                  index,
                                                                  i
                                                                )
                                                              }
                                                              readOnly={false}
                                                            />
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </td>
                                            </tr>
                                          );
                                          return avRow;
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex">
                                  <table className="width100">
                                    <tbody className="width100">
                                      <tr>
                                        <td>
                                          <label
                                            style={{ fontWeight: "bold" }}
                                            className="form-input-label2"
                                          >
                                            Ratio to Parent Unit
                                          </label>
                                        </td>
                                      </tr>

                                      {value.unitOfMeasures &&
                                        value.unitOfMeasures &&
                                        value.unitOfMeasures.length > 0 &&
                                        value.unitOfMeasures.map((v, i) => {
                                          let avRow = (
                                            <tr key={i}>
                                              <td className="width25">
                                                <div className="d-flex">
                                                  <table className="width100">
                                                    <tbody className="width100">
                                                      <tr>
                                                        <td className="width50">
                                                          <div className="d-flex">
                                                            <input
                                                              className="form-input"
                                                              type="number"
                                                              min="0"
                                                              placeholder="Ratio"
                                                              value={
                                                                v.ratioToParentUnitOfMeasure ===
                                                                undefined
                                                                  ? ""
                                                                  : v.ratioToParentUnitOfMeasure
                                                              }
                                                              onChange={(e) =>
                                                                this.handleRatioChange(
                                                                  e.target
                                                                    .value,
                                                                  index,
                                                                  i
                                                                )
                                                              }
                                                              readOnly={
                                                                v.readOnly
                                                              }
                                                            />
                                                          </div>
                                                        </td>
                                                        {i === 0 ? (
                                                          <td className="width50"></td>
                                                        ) : (
                                                          <td className="width50">
                                                            {"(" +
                                                              value
                                                                .unitOfMeasures[
                                                                i - 1
                                                              ].label +
                                                              ")"}
                                                          </td>
                                                        )}
                                                        {i !== 0 &&
                                                        v.id === undefined ? (
                                                          <td>
                                                            <Button
                                                              label="-"
                                                              onClick={() =>
                                                                this.handleRemoveUom(
                                                                  index,
                                                                  i
                                                                )
                                                              }
                                                              className="p-button-raised p-button-danger"
                                                            />
                                                          </td>
                                                        ) : (
                                                          <td>
                                                            <div
                                                              style={{
                                                                width: "43.5px",
                                                              }}
                                                            ></div>
                                                          </td>
                                                        )}

                                                        {i ===
                                                        value.unitOfMeasures
                                                          .length -
                                                          1 ? (
                                                          <td>
                                                            <Button
                                                              label="+"
                                                              onClick={() =>
                                                                this.handleAddUom(
                                                                  index
                                                                )
                                                              }
                                                              className="p-button-raised p-button-info"
                                                            />
                                                          </td>
                                                        ) : (
                                                          <td>
                                                            <div
                                                              style={{
                                                                width: "43.5px",
                                                              }}
                                                            ></div>
                                                          </td>
                                                        )}
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </div>
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

                            <tr>
                              <td className="width25">
                                <label className="form-input-label2">
                                  <b>Unit Price</b>
                                </label>
                              </td>
                              <td className="width25">
                                <div className="d-flex">
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    placeholder="Price (in Taka)"
                                    value={
                                      value.unitPrice === undefined
                                        ? ""
                                        : value.unitPrice
                                    }
                                    onChange={(e) =>
                                      this.handlePriceChange(
                                        e.target.value,
                                        index
                                      )
                                    }
                                    readOnly={false}
                                  />
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td className="width25">
                                <label className="form-input-label2">
                                  <b>Dimension</b>
                                </label>
                              </td>
                              <td className="width25">
                                <table className="width100">
                                  <tbody className="width100">
                                    <tr>
                                      <td>
                                        <div className="d-flex">
                                          <input
                                            className="form-input"
                                            type="number"
                                            min="0"
                                            placeholder="Height"
                                            value={
                                              value.dimension.height ===
                                              undefined
                                                ? ""
                                                : value.dimension.height
                                            }
                                            onChange={(e) =>
                                              this.handleDimensionChange(
                                                e.target.value,
                                                index,
                                                "height"
                                              )
                                            }
                                            readOnly={false}
                                          />
                                        </div>
                                      </td>
                                      <td>{"x"}</td>
                                      <td>
                                        <div className="d-flex">
                                          <input
                                            className="form-input"
                                            type="number"
                                            min="0"
                                            placeholder="Width"
                                            value={
                                              value.dimension.width ===
                                              undefined
                                                ? ""
                                                : value.dimension.width
                                            }
                                            onChange={(e) =>
                                              this.handleDimensionChange(
                                                e.target.value,
                                                index,
                                                "width"
                                              )
                                            }
                                            readOnly={false}
                                          />
                                        </div>
                                      </td>
                                      <td>{"x"}</td>
                                      <td>
                                        <div className="d-flex">
                                          <input
                                            className="form-input"
                                            type="number"
                                            min="0"
                                            placeholder="Length"
                                            value={
                                              value.dimension.length ===
                                              undefined
                                                ? ""
                                                : value.dimension.length
                                            }
                                            onChange={(e) =>
                                              this.handleDimensionChange(
                                                e.target.value,
                                                index,
                                                "length"
                                              )
                                            }
                                            readOnly={false}
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td className="width25">
                                <label className="form-input-label2">
                                  <b>Gross Weight</b>
                                </label>
                              </td>
                              <td className="width25">
                                <div className="d-flex">
                                  <input
                                    className="form-input"
                                    type="number"
                                    min="0"
                                    placeholder="Gross Weight (in KG)"
                                    value={
                                      value.grossWeight === undefined
                                        ? ""
                                        : value.grossWeight
                                    }
                                    onChange={(e) =>
                                      this.handleWeightChange(
                                        e.target.value,
                                        index
                                      )
                                    }
                                    readOnly={false}
                                  />
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                        return aRow;
                      })}
                  </tbody>
                </table>
              </div>

              <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
                <div className="p-mb-2 p-mr-2">
                  <Button
                    label="Save"
                    onClick={() => this.saveProductVariant()}
                    className="p-button-raised p-button-primary"
                  />
                </div>
              </div>
            </div>
          )}

        {this.state.saveOperation && this.state.saveOperation === true && (
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
export default withRouter(ProductVariantDetails);
