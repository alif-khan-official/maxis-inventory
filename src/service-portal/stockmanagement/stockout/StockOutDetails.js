import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import "../../../App.css";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class StockOutDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    this.state = {
      grrNo: "",
      remarks: "",

      table: false,

      products: [],
      product: "",
      variants: [],
      variant: "",
      matchedUoms: [],
      unitOfMeasure: [],
      deliverInventoryListCommand: [],

      saveOperation: false,
      responseMessage: "",
      corelationId: 0,
      quantities: [],
      deliverMultipleVariantList: [],
      unitPrice: "",
      description: "",
      inventories: [],
      availableBaseUnitQuantity: 0,
      variantId: "",
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.saveStockOut = this.saveStockOut.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.calculateBaseQuantity = this.calculateBaseQuantity.bind(this);
    // this.convertTotalBaseQuantityToWord = this.convertTotalBaseQuantityToWord.bind(this);
    this.variantAlreadyAdded = this.variantAlreadyAdded.bind(this);
    this.viewInTable = this.viewInTable.bind(this);
    this.findProductName = this.findProductName.bind(this);
    this.findVariantName = this.findVariantName.bind(this);
    this.handleUnitQuantityChange = this.handleUnitQuantityChange.bind(this);
    this.getAvailableBaseUnitQuantity =
      this.getAvailableBaseUnitQuantity.bind(this);
    this.checkStockSufficiency = this.checkStockSufficiency.bind(this);

    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/inventory-multiple-deliver/",
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
    this.getVariantsAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product-variant-by-productid/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getUomsAPI = {
      path: "maxisservice-inventory-service/endpoint/api/unit-of-measureby-categoryid/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getInventoriesAPI = {
      path: "maxisservice-inventory-service/endpoint/api/inventory-by-productId/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
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
        response[i].value = JSON.stringify({
          id: bigInt(response[i].id),
          brandName: response[i].brandName,
        });
        response[i].id = bigInt(response[i].id);
        response[i].name = response[i].label + " - " + response[i].brandName;
      }
      productArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("products", productArray);
  }

  async getVariants(productId, brandName) {
    let variantArray = [];
    try {
      let res = await fetch(
        this.gwUrl + this.getVariantsAPI.path + productId.toString(),
        {
          method: "GET",
          headers: this.getVariantsAPI.headers,
        }
      );

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].value = JSON.stringify({
          id: bigInt(response[i].id),
          name: response[i].label,
          unitOfMeasureCategoryId: bigInt(response[i].unitOfMeasureCategoryId),
          brandName: brandName,
          transferMode: "Delivered",
        });
        response[i].id = bigInt(response[i].id);
        response[i].name = response[i].label;
      }
      variantArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", variantArray);
  }

  async getUoms(unitOfMeasureCategoryId) {
    let uomArray = [];
    try {
      let res = await fetch(
        this.gwUrl + this.getUomsAPI.path + unitOfMeasureCategoryId.toString(),
        {
          method: "GET",
          headers: this.getUomsAPI.headers,
        }
      );

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].id = bigInt(response[i].id);
        response[i].name = response[i].label;
        response[i].unitOfMeasureCategoryId = bigInt(
          response[i].unitOfMeasureCategoryId
        );
        response[i].parentUnitOfMeasureId = bigInt(
          response[i].parentUnitOfMeasureId
        );
        response[i].value = bigInt(response[i].id);
        response[i].quantity = 0;
      }

      uomArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("matchedUoms", uomArray);
  }
  async getInventories(productId) {
    let inventoriesArray = [];
    try {
      let res = await fetch(
        this.gwUrl + this.getInventoriesAPI.path + productId.toString(),
        {
          method: "GET",
          headers: this.getInventoriesAPI.headers,
        }
      );

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].productVariantId = bigInt(response[i].productVariantId);
      }
      inventoriesArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("inventories", inventoriesArray);
  }

  getAvailableBaseUnitQuantity(variantId, inventories) {
    for (let i = 0; i < inventories.length; i++) {
      if (inventories[i].productVariantId.toString() === variantId.toString()) {
        return inventories[i].availableBaseUnitQuantity;
      }
    }
  }

  handleProductChange(selectedProductValue) {
    let p = JSON.parse(selectedProductValue);

    this.setState({
      product: selectedProductValue,
      variant: "",
      matchedUoms: [],
      unitPrice: "",
    });
    this.getVariants(p.id, p.brandName);
    this.getInventories(p.id);
  }

  handleVariantChange(selectedVariantValue) {
    let p = JSON.parse(selectedVariantValue);

    let inventories = this.state.inventories;
    let availableBaseUnitQuantity = 0;

    availableBaseUnitQuantity = this.getAvailableBaseUnitQuantity(
      p.id,
      inventories
    );

    this.setState({
      variant: selectedVariantValue,
      variantId: p.id,
      unitPrice: "",
      // description: p.transferMode + " " + p.name + " to " + p.brandName,
      description: p.transferMode + " " + p.name,
      availableBaseUnitQuantity: availableBaseUnitQuantity,
    });
    this.getUoms(p.unitOfMeasureCategoryId);
  }

  handleQuantityChange(index, value) {
    let matchedUoms = this.state.matchedUoms;

    matchedUoms[index].quantity = Number(value);

    this.setInputValue("matchedUoms", matchedUoms);
  }

  handleUnitQuantityChange(index, i, value) {
    let deliverMultipleVariantList = this.state.deliverMultipleVariantList;

    deliverMultipleVariantList[index].deliverInventoryListCommand[
      i
    ].unitOfMeasure.quantity = Number(value);

    deliverMultipleVariantList[index].deliverInventoryListCommand[i].quantity =
      Number(value);
    let baseQuantity = this.calculateBaseQuantity(
      deliverMultipleVariantList[index].deliverInventoryListCommand
    );

    deliverMultipleVariantList[index].totalQuantity =
      baseQuantity.totalQuantity;

    deliverMultipleVariantList[index].totalPrice =
      deliverMultipleVariantList[index].deliverInventoryListCommand[i]
        .unitPrice * baseQuantity.totalQuantity;

    this.setInputValue(
      "deliverMultipleVariantList",
      deliverMultipleVariantList
    );
  }

  handleGrrNoChange(value) {
    this.setState({
      table: false,
      grrNo: value,
      deliverMultipleVariantList: [],
      deliverInventoryListCommand: [],
      product: "",
      // variants: [],
      variant: "",
      matchedUoms: [],
      unitPrice: "",
      description: "",
      remarks: "",
    });
  }

  handleRemarksChange(value) {
    this.setState({
      table: false,
      remarks: value,
      deliverMultipleVariantList: [],
      deliverInventoryListCommand: [],
      product: "",
      // variants: [],
      variant: "",
      matchedUoms: [],
      unitPrice: "",
    });
  }

  findProductName(productId) {
    let p = JSON.parse(productId);
    let products = this.state.products;

    return products[
      products.findIndex((element) => element.id.toString() === p.id.toString())
    ].name;
  }

  findVariantName(variantId) {
    let variants = this.state.variants;

    return variants[
      variants.findIndex(
        (element) => element.id.toString() === variantId.toString()
      )
    ].name;
  }

  calculateBaseQuantity(inventory) {
    let totalBaseQuantity = {
      totalQuantity: 0,
      baseUnit: "",
      totalPrice: 0,
    };
    for (let i = inventory.length - 1; i >= 0; i--) {
      if (inventory[i].unitOfMeasure.isBaseUnit === true) {
        totalBaseQuantity.totalQuantity =
          totalBaseQuantity.totalQuantity + inventory[i].quantity;
        totalBaseQuantity.baseUnit = inventory[i].unitOfMeasure.label;
        totalBaseQuantity.totalPrice =
          inventory[i].unitPrice * totalBaseQuantity.totalQuantity;
        return totalBaseQuantity;
      } else {
        for (let j = i; j > 0; j--) {
          if (j === i) {
            totalBaseQuantity.totalQuantity =
              totalBaseQuantity.totalQuantity +
              inventory[j].quantity *
                inventory[j].unitOfMeasure.ratioToParentUnitOfMeasure;
          } else {
            totalBaseQuantity.totalQuantity =
              totalBaseQuantity.totalQuantity *
              inventory[j].unitOfMeasure.ratioToParentUnitOfMeasure;
          }
        }
      }
    }
  }
  /*
  convertTotalBaseQuantityToWord(totalQuantity, ruleSet) {
    let quantity = 0;
    let newQuantity = totalQuantity;
    let unitQuantity = 0;
    let inWord = "";

    for (let i = 0; i < ruleSet.length; i++) {
      if (i === ruleSet.length - 1) {
        inWord = newQuantity + " " + ruleSet[i].label + " " + inWord;
      } else {
        quantity = Math.floor(
          newQuantity / ruleSet[i + 1].ratioToParentUnitOfMeasure
        );
        unitQuantity = newQuantity % ruleSet[i + 1].ratioToParentUnitOfMeasure;
        inWord = unitQuantity + " " + ruleSet[i].label + " " + inWord;

        newQuantity = quantity;
      }
    }

    return inWord;
  }
  */
  variantAlreadyAdded(deliverMultipleVariantList, variant) {
    for (let i = 0; i < deliverMultipleVariantList.length; i++) {
      if (variant === deliverMultipleVariantList[i].productVarientId) {
        this.setInputValue("responseMessage", "Variant already added");
        return true;
      }
    }
  }

  setDeliverMultipleVariantList(
    deliverMultipleVariantList,
    product,
    variant,
    baseQuantity,
    // inWord,
    deliverInventoryListCommand,
    totalPrice,
    description,
    unitPrice,
    availableBaseUnitQuantity
  ) {
    deliverMultipleVariantList.push({
      productId: product,
      productVarientId: variant,
      variantName: this.findVariantName(variant),
      totalQuantity: baseQuantity.totalQuantity,
      // inWord: inWord,
      deliverInventoryListCommand: deliverInventoryListCommand,
      totalPrice: totalPrice,
      description: description,
      unitPrice: unitPrice,
      availableBaseUnitQuantity: availableBaseUnitQuantity,
    });
  }

  checkStockSufficiency(deliverMultipleVariantList) {
    for (let i = 0; i < deliverMultipleVariantList.length; i++) {
      if (
        deliverMultipleVariantList[i].totalQuantity >
        deliverMultipleVariantList[i].availableBaseUnitQuantity
      ) {
        this.setInputValue(
          "responseMessage",
          "Insufficient Stocks to Deliver - " +
            deliverMultipleVariantList[i].variantName
        );
        return true;
      }
    }
  }

  viewInTable() {
    let grrNo = this.state.grrNo;
    let unitPrice = this.state.unitPrice;

    if (!grrNo) {
      this.setInputValue("responseMessage", "Enter GRR Number");
      return;
    } else if (!unitPrice) {
      this.setInputValue("responseMessage", "Enter Unit Price");
      return;
    } else {
      let deliverInventoryListCommand = [];
      let matchedUoms = this.state.matchedUoms;
      let availableBaseUnitQuantity = this.state.availableBaseUnitQuantity;
      let description = this.state.description;
      let product = this.state.product;
      // let variant = this.state.variant;
      let variant = this.state.variantId;

      let deliverMultipleVariantList = this.state.deliverMultipleVariantList;

      for (let i = 0; i < matchedUoms.length; i++) {
        deliverInventoryListCommand.push({
          quantity: matchedUoms[i].quantity,
          refernceNo: grrNo,
          totalPrice: 0,
          unitOfMeasure: matchedUoms[i],
          unitPrice: unitPrice,
        });
      }

      let baseQuantity = this.calculateBaseQuantity(
        deliverInventoryListCommand
      );
      /*
      let inWord = this.convertTotalBaseQuantityToWord(
        baseQuantity.totalQuantity,
        matchedUoms
      );
      */
      let variantAlreadyAdded = this.variantAlreadyAdded(
        deliverMultipleVariantList,
        variant
      );

      if (variantAlreadyAdded === true) {
        return;
      }

      if (baseQuantity.totalQuantity > availableBaseUnitQuantity) {
        this.setInputValue("responseMessage", "Insufficient Stocks to Deliver");
        return;
      }

      this.setState({ responseMessage: "", table: true });

      this.setDeliverMultipleVariantList(
        deliverMultipleVariantList,
        product,
        variant,
        baseQuantity,
        // inWord,
        deliverInventoryListCommand,
        baseQuantity.totalPrice,
        description,
        unitPrice,
        availableBaseUnitQuantity
      );

      this.setState({
        deliverMultipleVariantList: deliverMultipleVariantList,
        deliverInventoryListCommand: [],
      });
    }
  }

  deleteRow(e) {
    this.setInputValue("table", true);

    this.state.deliverMultipleVariantList.splice(e, 1);

    if (this.state.deliverMultipleVariantList.length === 0) {
      this.setInputValue("table", false);
    }
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }
  componentDidMount() {
    this.getAllProducts();
  }

  async saveStockOut() {
    let corelationId = this.state.corelationId;
    let remarks = this.state.remarks;
    let userId = AuthUtil.getUserId();
    let deliverMultipleVariantList = this.state.deliverMultipleVariantList;

    if (this.checkStockSufficiency(deliverMultipleVariantList) === true) {
      return;
    }

    console.log("saving");
    const payLoad = {
      corelationId: corelationId,
      remarks: remarks,
      requestedBy: userId,
      deliverMultipleVariantList: deliverMultipleVariantList,
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

  getComponentDesign() {
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Stock Out Details</b>
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
                    <b>Invoice No.</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="flex-row">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter Invoice Number"
                      value={
                        this.state.grrNo === undefined ? "" : this.state.grrNo
                      }
                      onChange={(e) => this.handleGrrNoChange(e.target.value)}
                      readOnly={false}
                      filter={false}
                    />
                  </div>
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    <b>Remarks</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="flex-row">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter Remarks"
                      value={
                        this.state.remarks === undefined
                          ? ""
                          : this.state.remarks
                      }
                      onChange={(e) => this.handleRemarksChange(e.target.value)}
                      readOnly={false}
                      filter={false}
                    />
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
                      value={this.state.product}
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
                    <b>Variant</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <SelectSearch
                      options={this.state.variants}
                      search
                      value={this.state.variant}
                      onChange={this.handleVariantChange}
                      filterOptions={fuzzySearch}
                      emptyMessage="Nothing Found"
                      placeholder="Choose a Variant"
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    <b>Unit Price</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="flex-row">
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      placeholder="Enter Unit Price of Variant"
                      value={
                        this.state.unitPrice === undefined
                          ? ""
                          : this.state.unitPrice
                      }
                      onChange={(e) => {
                        this.setInputValue("unitPrice", Number(e.target.value));
                      }}
                      readOnly={false}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25 alignOnTop">
                  <label className="form-input-label2">
                    <b>Measurement Unit - Quantity</b>
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
                              Unit
                            </label>
                          </td>
                          <td>
                            <label
                              style={{ fontWeight: "bold" }}
                              className="form-input-label2"
                            >
                              Quantity
                            </label>
                          </td>
                        </tr>
                        {this.state.matchedUoms &&
                          this.state.matchedUoms.length > 0 &&
                          this.state.matchedUoms.map((value, index) => {
                            let matchedUomsRow = (
                              <tr>
                                <td>{value.name}</td>
                                <td className="width75">
                                  <div className="d-flex">
                                    <input
                                      className="form-input"
                                      placeholder="Quantity"
                                      type="number"
                                      min="0"
                                      value={value.quantity}
                                      onChange={(e) => {
                                        this.handleQuantityChange(
                                          index,
                                          e.target.value
                                        );
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                            return matchedUomsRow;
                          })}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              {this.state.variant !== "" && (
                <tr className="width100">
                  <td className="width25"></td>
                  <td className="width75" style={{ textAlign: "right" }}>
                    <Button
                      label="Add"
                      onClick={() => {
                        this.viewInTable();
                      }}
                      className="p-button-raised p-button-secondary"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <hr />
        {this.state.table && (
          <div width="100%" style={{ textAlign: "center" }}>
            <h3>
              <b>Stocks</b>
            </h3>

            <table className="width100">
              <tbody>
                <tr>
                  <td>
                    <table className="width100">
                      <tbody>
                        <tr>
                          <td className="width5">
                            <b>{"#"}</b>
                          </td>
                          <td className="width30">
                            <b>{"Item & Description"}</b>
                          </td>
                          <td className="width10">
                            <b>{"Rate"}</b>
                          </td>
                          <td className="width35">
                            <b>{"Quantity"}</b>
                          </td>
                          <td className="width10">
                            <b>{"Amount"}</b>
                          </td>
                          <td className="width10">
                            <b>{"Action"}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="d-flex">
                      <table className="width100">
                        <tbody>
                          {this.state.deliverMultipleVariantList.map(
                            (row, index) => {
                              return (
                                <tr key={index}>
                                  <td className="width5">{index + 1}</td>
                                  <td className="width30">
                                    {this.findProductName(row.productId) +
                                      " - " +
                                      row.variantName}
                                  </td>
                                  {/*
                                  <td className="width15">{row.variantName}</td>
                                  */}
                                  <td className="width10">
                                    {row.unitPrice + " Taka"}
                                  </td>
                                  <td className="width35">
                                    <table
                                      style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                      }}
                                    >
                                      <tbody>
                                        <tr>
                                          {row.deliverInventoryListCommand.map(
                                            (v, i) => {
                                              let row = (
                                                <>
                                                  <td>
                                                    <input
                                                      style={{
                                                        width: "80px",
                                                      }}
                                                      className="form-input"
                                                      type="number"
                                                      min="0"
                                                      placeholder="Enter Value"
                                                      value={
                                                        v.unitOfMeasure.quantity
                                                      }
                                                      onChange={(v) => {
                                                        this.handleUnitQuantityChange(
                                                          index,
                                                          i,
                                                          v.target.value
                                                        );
                                                      }}
                                                    ></input>
                                                  </td>
                                                  <td>
                                                    {" " +
                                                      v.unitOfMeasure.label +
                                                      " "}
                                                  </td>
                                                </>
                                              );
                                              return row;
                                            }
                                          )}
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td className="width10">
                                    {row.totalPrice + " Taka"}
                                  </td>
                                  <td className="width10">
                                    <Button
                                      label="Delete"
                                      onClick={() => {
                                        this.deleteRow(index);
                                      }}
                                      className="p-button-raised p-button-danger"
                                    />
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
          </div>
        )}

        {this.state.table && (
          <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
            <div className="p-mb-2 p-mr-2">
              <Button
                label="Save"
                onClick={() => this.saveStockOut()}
                className="p-button-raised p-button-primary"
              />
            </div>
          </div>
        )}

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
                Stock Out Successful.
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
                Could not Stock Out.
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
export default withRouter(StockOutDetails);
