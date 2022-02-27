import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import "../../App.css";
import AuthUtil from "../../auth/AuthUtil";
import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class AttributeDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    this.state = {
      tenantId: AuthUtil.getTanentId(),
      saveOperation: false,
      responseMessage: "",
      products: [],
      product: "",
      attributesWithValues: {
        tenantId: null,
        productId: 0,
        attributeList: [],
      },
    };
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product-attribute-value/",
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

    this.setInputValue = this.setInputValue.bind(this);
    this.saveAttribute = this.saveAttribute.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleAddAttribute = this.handleAddAttribute.bind(this);
    this.handleAddAttributeValue = this.handleAddAttributeValue.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.handleAttributeValueChange =
      this.handleAttributeValueChange.bind(this);
    this.convertAttributeIdsToBigInt =
      this.convertAttributeIdsToBigInt.bind(this);
    this.checkAttributeNameAndValues =
      this.checkAttributeNameAndValues.bind(this);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
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
      }
    }
    return response;
  }

  checkAttributeNameAndValues(attributesWithValues) {
    for (let i = 0; i < attributesWithValues.attributeList.length; i++) {
      for (
        let j = 0;
        j < attributesWithValues.attributeList[i].attributeValueList.length;
        j++
      ) {
        if (
          attributesWithValues.attributeList[i].label.trim() === "" ||
          attributesWithValues.attributeList[i].attributeValueList[
            j
          ].label.trim() === ""
        ) {
          this.setInputValue(
            "responseMessage",
            "Fill All Attribute Name and Value Fields"
          );
          return true;
        }
      }
    }
  }

  handleProductChange(selectedProductValue) {
    this.setState({
      product: selectedProductValue,
    });

    this.getAllAttributes(selectedProductValue);
  }
  handleAddAttribute() {
    let attributesWithValues = this.state.attributesWithValues;

    if (attributesWithValues.attributeList.length > 0) {
      if (this.checkAttributeNameAndValues(attributesWithValues) === true) {
        return;
      }
    }

    attributesWithValues.attributeList.push({
      code: "",
      label: "",
      isActive: true,
      description: "",
      readOnly: false,
      attributeValueList: [
        {
          code: "",
          label: "",
          isActive: true,
          description: "",
          readOnly: false,
        },
      ],
    });

    this.setInputValue("attributesWithValues", attributesWithValues);
  }
  handleAddAttributeValue(index) {
    let attributesWithValues = this.state.attributesWithValues;

    if (
      attributesWithValues.attributeList.length > 0 &&
      this.checkAttributeNameAndValues(attributesWithValues) === true
    ) {
      return;
    }

    attributesWithValues.attributeList[index].attributeValueList.push({
      code: "",
      label: "",
      isActive: true,
      description: "",
      readOnly: false,
    });

    this.setInputValue("attributesWithValues", attributesWithValues);
  }

  handleRemove(index, i) {
    let attributesWithValues = this.state.attributesWithValues;

    if (
      attributesWithValues.attributeList[index].attributeValueList.length === 1
    ) {
      attributesWithValues.attributeList.splice(index, 1);
    } else if (
      attributesWithValues.attributeList[index].attributeValueList.length > 1 &&
      i !== 0
    ) {
      attributesWithValues.attributeList[index].attributeValueList.splice(i, 1);
    }
    this.setInputValue("attributesWithValues", attributesWithValues);
  }

  handleAttributeChange(value, index) {
    let attributesWithValues = this.state.attributesWithValues;

    attributesWithValues.attributeList[index].label = value;
    attributesWithValues.attributeList[index].code = value
      .toUpperCase()
      .replace(/\s/g, "");
    attributesWithValues.attributeList[index].description = value;

    this.setInputValue("attributesWithValues", attributesWithValues);
  }
  handleAttributeValueChange(value, index, i) {
    let attributesWithValues = this.state.attributesWithValues;

    attributesWithValues.attributeList[index].attributeValueList[i].label =
      value;
    attributesWithValues.attributeList[index].attributeValueList[i].code = value
      .toUpperCase()
      .replace(/\s/g, "");
    attributesWithValues.attributeList[index].attributeValueList[
      i
    ].description = value;

    this.setInputValue("attributesWithValues", attributesWithValues);
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

  componentDidMount() {
    this.getAllProducts();
    console.log("mounting");
    console.log("mounted");
  }

  async saveAttribute() {
    let tenantId = this.state.tenantId;
    let productId = this.state.product;

    let attributesWithValues = this.state.attributesWithValues;

    if (attributesWithValues.attributeList.length > 0) {
      if (this.checkAttributeNameAndValues(attributesWithValues) === true) {
        return;
      }

      this.setInputValue("responseMessage", "");

      console.log("saving");
      const payLoad = {
        tenantId: tenantId,
        productId: productId,
        attributeList: attributesWithValues.attributeList,
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
      this.getAllAttributes(productId);
    }
  }

  getComponentDesign() {
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Attribute Details</b>
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
            </tbody>
          </table>
        </div>

        <div width="100%" style={{ marginLeft: "3px" }}>
          <h3>
            <Button
              label="+"
              onClick={() => this.handleAddAttribute()}
              className="p-button-raised p-button-info"
            />
            <b>{"  Add Attribute"}</b>
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
              {this.state.attributesWithValues &&
                this.state.attributesWithValues.attributeList &&
                this.state.attributesWithValues.attributeList.length > 0 && (
                  <>
                    <tr>
                      <td className="width25">
                        <label className="form-input-label2">
                          <b>Name</b>
                        </label>
                      </td>
                      <td className="width25">
                        <label className="form-input-label2">
                          <b>Value</b>
                        </label>
                      </td>
                      <td className="width25"></td>
                      <td className="width50"></td>
                    </tr>

                    {this.state.attributesWithValues.attributeList.map(
                      (value, index) => {
                        let aRow = (
                          <tr>
                            <td className="alignOnTop">
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="width25">
                                      <div className="d-flex">
                                        <input
                                          className="form-input"
                                          type="text"
                                          placeholder="Enter Name"
                                          value={value.label}
                                          readOnly={value.readOnly}
                                          onChange={(v) => {
                                            this.handleAttributeChange(
                                              v.target.value,
                                              index
                                            );
                                          }}
                                        ></input>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td>
                              {value.attributeValueList &&
                                value.attributeValueList.length > 0 &&
                                value.attributeValueList.map((v, i) => {
                                  let avRow = (
                                    <table>
                                      <tbody>
                                        <tr>
                                          <td className="width100">
                                            <div className="d-flex">
                                              <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Enter Value"
                                                value={v.label}
                                                readOnly={v.readOnly}
                                                onChange={(v) => {
                                                  this.handleAttributeValueChange(
                                                    v.target.value,
                                                    index,
                                                    i
                                                  );
                                                }}
                                              ></input>
                                            </div>
                                          </td>
                                          {v.id === undefined ? (
                                            <td>
                                              <Button
                                                label="-"
                                                onClick={() =>
                                                  this.handleRemove(index, i)
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
                                          value.attributeValueList.length -
                                            1 ? (
                                            <td>
                                              <Button
                                                label="+"
                                                onClick={() =>
                                                  this.handleAddAttributeValue(
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
                                  );
                                  return avRow;
                                })}
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        );
                        return aRow;
                      }
                    )}

                    <tr>
                      <td></td>
                      <td style={{ textAlign: "right" }}>
                        <Button
                          label="Save"
                          onClick={() => this.saveAttribute()}
                          className="p-button-raised p-button-primary"
                        />
                      </td>
                    </tr>
                  </>
                )}
            </tbody>
          </table>
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
                Attribute is saved.
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
                Attribute is not saved.
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
export default withRouter(AttributeDetails);
