import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import "../../App.css";
import AuthUtil from "../../auth/AuthUtil";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class MeasurementUnitDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    this.state = {
      code: "",
      label: "",
      isActive: true,
      isBaseUnit: true,
      tanentId: AuthUtil.getTanentId(),
      saveOperation: false,
      categories: [],
      unitOfMeasureCategoryId: "",
      parentUnitOfMeasureId: 0,
      ratioToParentUnitOfMeasure: 1,
      uoms: [],
      matchedUoms: [],
      isParent: true,
      description: "",
      responseMessage: "",
    };
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/unit-of-measure/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    this.getAllCategoriesAPI = {
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

    this.setInputValue = this.setInputValue.bind(this);
    // this.setFieldValue = this.setFieldValue.bind(this);
    this.saveMeasurementUnit = this.saveMeasurementUnit.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleUomChange = this.handleUomChange.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }
  /*
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
*/
  async getAllCategories() {
    let categoryArray = [];
    try {
      let res = await fetch(this.gwUrl + this.getAllCategoriesAPI.path, {
        method: "GET",
        headers: this.getAllCategoriesAPI.headers,
      });

      let response = await res.json();
      for (let i = 0; i < response.length; i++) {
        categoryArray.push({
          name: response[i].label,
          value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("categories", categoryArray);
  }

  async getUom() {
    let uomArray = [];
    try {
      let res = await fetch(this.gwUrl + this.getUomAPI.path, {
        method: "GET",
        headers: this.getUomAPI.headers,
      });
      let response = await res.json();
      for (let i = 0; i < response.length; i++) {
        uomArray.push({
          name: response[i].label,
          categoryValue: bigInt(response[i].unitOfMeasureCategoryId),
          value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("uoms", uomArray);
  }

  componentDidMount() {
    this.getAllCategories();
    this.getUom();
    console.log("mounting");
    console.log("mounted");
  }

  handleCategoryChange(selectedCategoryValue) {
    this.setState({
      unitOfMeasureCategoryId: selectedCategoryValue,
      matchedUoms: this.state.uoms.filter(
        (uom) =>
          uom.categoryValue.toString() === selectedCategoryValue.toString()
      ),
    });
  }

  handleUomChange(selectedUomValue) {
    this.setInputValue("parentUnitOfMeasureId", selectedUomValue);
  }

  handleCheckBox() {
    this.setState({
      isParent: !this.state.isParent,
      isBaseUnit: !this.state.isBaseUnit,
      parentUnitOfMeasureId: 0,
      ratioToParentUnitOfMeasure: 1,
    });
  }

  async saveMeasurementUnit() {
    if (!this.state.code) {
      this.setInputValue("responseMessage", "Unit of Measure Code is empty");
      return;
    } else if (!this.state.label) {
      this.setInputValue("responseMessage", "Unit of Measure Label is empty");
      return;
    } else if (!this.state.unitOfMeasureCategoryId) {
      this.setInputValue(
        "responseMessage",
        "Unit of Measure Category is empty"
      );
      return;
    } else if (!this.state.isParent && !this.state.parentUnitOfMeasureId) {
      this.setInputValue("responseMessage", "Parent Unit of Measure is empty");
      return;
    } else if (!this.state.isParent && !this.state.ratioToParentUnitOfMeasure) {
      this.setInputValue(
        "responseMessage",
        "Ratio to Parent Unit of Measure is empty"
      );
      return;
    } else {
      console.log("saving");
      const payLoad = {
        isActive: this.state.isActive,
        isBaseUnit: this.state.isBaseUnit,
        code: this.state.code,
        label: this.state.label,
        parentUnitOfMeasureId: this.state.parentUnitOfMeasureId,
        ratioToParentUnitOfMeasure: this.state.ratioToParentUnitOfMeasure,
        tanentId: this.state.tanentId,
        unitOfMeasureCategoryId: this.state.unitOfMeasureCategoryId,
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

  getComponentDesign() {
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Unit of Measurement Details</b>
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
                    Unit of Measurement Code
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Type Code"
                      // value={this.state.code}
                      // id={this.state.id + "-code"}
                      onChange={(e) =>
                        this.setInputValue("code", e.target.value)
                      }
                    ></input>
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Unit of Measurement Label
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Type Label"
                      // value={this.state.label}
                      // id={this.state.id + "-label"}
                      onChange={(e) =>
                        this.setInputValue("label", e.target.value)
                      }
                    ></input>
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Unit of Measure Description
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
                  <label className="form-input-label2"></label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <label>
                      <input
                        className="checkbox-input"
                        type="checkbox"
                        checked={this.state.isParent}
                        onChange={this.handleCheckBox}
                      ></input>
                      Parent Unit
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Unit of Measurement Category
                  </label>
                </td>
                <td>
                  <SelectSearch
                    options={this.state.categories}
                    search
                    onChange={this.handleCategoryChange}
                    filterOptions={fuzzySearch}
                    emptyMessage="Nothing Found"
                    placeholder="Choose Category"
                  />
                </td>
              </tr>
              {!this.state.isParent && (
                <>
                  <tr className="width100">
                    <td className="width25">
                      <label className="form-input-label2">
                        Parent Unit of Measurement
                      </label>
                    </td>
                    <td>
                      <SelectSearch
                        options={this.state.matchedUoms}
                        search
                        onChange={this.handleUomChange}
                        filterOptions={fuzzySearch}
                        emptyMessage="Nothing Found"
                        placeholder="Choose Parent Unit of Measurement"
                      />
                    </td>
                  </tr>
                  <tr className="width100">
                    <td className="width25">
                      <label className="form-input-label2">
                        Ratio to Parent
                      </label>
                    </td>
                    <td className="width75">
                      <div className="d-flex">
                        <input
                          className="form-input"
                          type="number"
                          placeholder="Type Ratio"
                          // value={this.state.ratioToParentUnitOfMeasure}
                          // id={this.state.id + "-label"}
                          onChange={(e) =>
                            this.setInputValue(
                              "ratioToParentUnitOfMeasure",
                              e.target.value
                            )
                          }
                        ></input>
                      </div>
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <td>
                  <Button
                    label="Save"
                    onClick={() => this.saveMeasurementUnit()}
                    className="p-button-raised p-button-info"
                  />
                </td>
              </tr>
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
                Measurement unit is saved.
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
                Measurement unit is not saved.
              </h5>
            </div>
            <hr />
          </div>
        )}
        <hr />
      </div>
    );
    return design;
  }

  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(MeasurementUnitDetails);
