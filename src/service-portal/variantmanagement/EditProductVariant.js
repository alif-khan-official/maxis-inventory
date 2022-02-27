import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";

var bigInt = require("big-integer");

class EditProductVariant extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    let data = this.props.location.state.item;

    this.state = {
      saveOperation: false,
      responseMessage: "",
      tenantId: AuthUtil.getTanentId(),

      selectedVariant: {},

      matchedUoms: [],
      newUoms: [],
      productId: data.productId,
      productName: data.product,
      variantId: data.productVariantId,
      data: data,
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

    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.setInputValue = this.setInputValue.bind(this);
    this.handleAddUom = this.handleAddUom.bind(this);
    this.handleUomChange = this.handleUomChange.bind(this);
    this.handleRatioChange = this.handleRatioChange.bind(this);
    this.handleRemoveUom = this.handleRemoveUom.bind(this);
    this.checkUom = this.checkUom.bind(this);
    this.addNewUoms = this.addNewUoms.bind(this);
    this.getNewUoms = this.getNewUoms.bind(this);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  checkUom(matchedUoms) {
    for (let i = 0; i < matchedUoms.length; i++) {
      if (
        matchedUoms[i].label === "" ||
        matchedUoms[i].ratioToParentUnitOfMeasure === ""
      ) {
        this.setInputValue("responseMessage", "Fill Unit of Measure Fields");
        return true;
      }
    }
  }

  handleRemoveUom(i) {
    let matchedUoms = this.state.matchedUoms;

    if (
      matchedUoms[i + 1] !== undefined &&
      matchedUoms[i].parentUnitOfMeasureId !== undefined
    ) {
      matchedUoms[i + 1].parentUnitOfMeasureId =
        matchedUoms[i].parentUnitOfMeasureId;
    }

    matchedUoms.splice(i, 1);

    this.setInputValue("matchedUoms", matchedUoms);
  }

  handleRatioChange(value, i) {
    let matchedUoms = this.state.matchedUoms;

    matchedUoms[i].ratioToParentUnitOfMeasure = value;

    this.setInputValue("matchedUoms", matchedUoms);
  }

  handleUomChange(value, i) {
    let matchedUoms = this.state.matchedUoms;

    matchedUoms[i].label = value;
    matchedUoms[i].code = value.toUpperCase().replace(/\s/g, "");

    this.setInputValue("matchedUoms", matchedUoms);
  }

  addNewUoms(matchedUoms) {
    if (matchedUoms[matchedUoms.length - 1].id !== undefined) {
      matchedUoms.push({
        // id: null,
        code: "",
        label: "",
        unitOfMeasureCategoryId:
          matchedUoms[matchedUoms.length - 1].unitOfMeasureCategoryId,
        parentUnitOfMeasureId: matchedUoms[matchedUoms.length - 1].id,
        ratioToParentUnitOfMeasure: "",
        tenantId: AuthUtil.getTanentId(),
        active: true,
        baseUnit: false,
        readOnly: false,
      });
    } else {
      matchedUoms.push({
        code: "",
        label: "",
        unitOfMeasureCategoryId:
          matchedUoms[matchedUoms.length - 1].unitOfMeasureCategoryId,
        ratioToParentUnitOfMeasure: "",
        tenantId: AuthUtil.getTanentId(),
        active: true,
        baseUnit: false,
        readOnly: false,
      });
    }
  }

  handleAddUom() {
    let matchedUoms = this.state.matchedUoms;

    if (this.checkUom(matchedUoms) === true) {
      return;
    }

    this.addNewUoms(matchedUoms);

    this.setInputValue("matchedUoms", matchedUoms);
  }

  async getVariants() {
    let variantId = bigInt(this.state.variantId);
    let productId = this.state.productId;
    let variant = {};

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
        if (bigInt(response[i].id).toString() === variantId.toString()) {
          variant = response[i];
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }

    let unitOfMeasureCategoryId = bigInt(
      variant.baseUnitOfMeasure.unitOfMeasureCategoryId
    );

    this.setInputValue("selectedVariant", variant);

    this.getUoms(unitOfMeasureCategoryId);
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
        response[i].readOnly = true;
      }

      uomArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("matchedUoms", uomArray);
  }

  getNewUoms(matchedUoms) {
    return matchedUoms.filter((uom) => uom.id === undefined);
  }

  componentDidMount() {
    this.getVariants();
    console.log("mounting");
    console.log("mounted");
  }

  async updateProductVariant() {
    let matchedUoms = this.state.matchedUoms;

    if (this.checkUom(matchedUoms) === true) {
      return;
    } else {
      let newUoms = this.state.newUoms;

      this.setInputValue("responseMessage", "");

      newUoms = this.getNewUoms(matchedUoms);

      console.log("saving");
      const payLoad = {
        newUoms,
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
            <b>Edit Product Variant</b>
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
                    <input
                      className="form-input"
                      type="text"
                      value={
                        this.state.productName === undefined
                          ? ""
                          : this.state.productName
                      }
                      readOnly={true}
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
                    <input
                      className="form-input"
                      type="text"
                      value={
                        this.state.selectedVariant.label === undefined
                          ? ""
                          : this.state.selectedVariant.label
                      }
                      readOnly={true}
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
                        {this.state.selectedVariant &&
                          this.state.selectedVariant.variantAttributes &&
                          this.state.selectedVariant.variantAttributes.length >
                            0 &&
                          this.state.selectedVariant.variantAttributes.map(
                            (value, index) => {
                              let avRow = (
                                <tr>
                                  <td>{value.attributeLabel}</td>
                                  <td>{value.attributeValueLabel}</td>
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

        {this.state.selectedVariant && this.state.selectedVariant.basicSKUUnit && (
          <div>
            <div width="100%" style={{ marginLeft: "3px" }}>
              <h3>
                <b>{"SKU"}</b>
              </h3>
            </div>
            <hr />
            <div>
              <table className="width100">
                <tbody>
                  <tr>
                    <td className="width25">
                      <label className="form-input-label2">
                        <b>Basic SKU</b>
                      </label>
                    </td>

                    <td className="width25">
                      <div className="d-flex">
                        <input
                          className="form-input"
                          type="text"
                          placeholder="Gross Weight (in KG)"
                          value={
                            this.state.selectedVariant.basicSKUUnit.value +
                            " " +
                            this.state.selectedVariant.basicSKUUnit.name
                          }
                          readOnly={true}
                        />
                      </div>
                    </td>
                    <td className="width25"></td>
                    <td className="width25"></td>
                  </tr>
                  <tr>
                    <td className="width25 alignOnTop">
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

                            {this.state.matchedUoms &&
                              this.state.matchedUoms &&
                              this.state.matchedUoms.length > 0 &&
                              this.state.matchedUoms.map((v, i) => {
                                let avRow = (
                                  <tr>
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
                                                      v.label === undefined
                                                        ? ""
                                                        : v.label
                                                    }
                                                    onChange={(e) =>
                                                      this.handleUomChange(
                                                        e.target.value,
                                                        i
                                                      )
                                                    }
                                                    readOnly={v.readOnly}
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

                            {this.state.matchedUoms &&
                              this.state.matchedUoms &&
                              this.state.matchedUoms.length > 0 &&
                              this.state.matchedUoms.map((v, i) => {
                                let avRow = (
                                  <tr>
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
                                                        e.target.value,
                                                        i
                                                      )
                                                    }
                                                    readOnly={v.readOnly}
                                                  />
                                                </div>
                                              </td>
                                              {i === 0 ? (
                                                <td className="width50"></td>
                                              ) : (
                                                <td className="width50">
                                                  {"(" +
                                                    this.state.matchedUoms[
                                                      i - 1
                                                    ].label +
                                                    ")"}
                                                </td>
                                              )}
                                              {i !== 0 && v.id === undefined ? (
                                                <td>
                                                  <Button
                                                    label="-"
                                                    onClick={() =>
                                                      this.handleRemoveUom(i)
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
                                              this.state.matchedUoms.length -
                                                1 ? (
                                                <td>
                                                  <Button
                                                    label="+"
                                                    onClick={() =>
                                                      this.handleAddUom()
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
                            this.state.selectedVariant.unitPrice === undefined
                              ? ""
                              : this.state.selectedVariant.unitPrice
                          }
                          readOnly={true}
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
                                    this.state.selectedVariant.dimension
                                      .height === undefined
                                      ? ""
                                      : this.state.selectedVariant.dimension
                                          .height
                                  }
                                  readOnly={true}
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
                                    this.state.selectedVariant.dimension
                                      .width === undefined
                                      ? ""
                                      : this.state.selectedVariant.dimension
                                          .width
                                  }
                                  readOnly={true}
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
                                    this.state.selectedVariant.dimension
                                      .length === undefined
                                      ? ""
                                      : this.state.selectedVariant.dimension
                                          .length
                                  }
                                  readOnly={true}
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
                          placeholder="Gross Weight (in Basic SKU)"
                          value={
                            this.state.selectedVariant.grossWeight === undefined
                              ? ""
                              : this.state.selectedVariant.grossWeight
                          }
                          readOnly={true}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
              <div className="p-mb-2 p-mr-2">
                <Button
                  label="Update"
                  onClick={() => this.updateProductVariant()}
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
                Product Variant is updated.
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
                Product Variant is not updated.
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
export default withRouter(EditProductVariant);
