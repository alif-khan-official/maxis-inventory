import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import "../../App.css";
import AuthUtil from "../../auth/AuthUtil";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      code: "",
      label: "",
      isActive: true,
      parentId: 0,
      saveOperation: false,
      types: [],
      isParent: true,
      description: "",
      responseMessage: "",
    };
    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/product-category/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };

    this.getAllTypesAPI = {
      path:
        "maxisservice-inventory-service/endpoint/api/product-category/" +
        AuthUtil.getTanentId(),
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.saveProductCategory = this.saveProductCategory.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
    this.handleLabel = this.handleLabel.bind(this);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }
  async getAllTypes() {
    let typeArray = [];
    try {
      let res = await fetch(this.gwUrl + this.getAllTypesAPI.path, {
        method: "GET",
        headers: this.getAllTypesAPI.headers,
      });

      let response = await res.json();
      for (let i = 0; i < response.length; i++) {
        typeArray.push({
          name: response[i].label,
          value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("types", typeArray);
  }

  componentDidMount() {
    this.getAllTypes();
    console.log("mounting");
    console.log("mounted");
  }

  handleTypeChange(selectedTypeValue) {
    this.setInputValue("parentId", selectedTypeValue);
  }

  handleCheckBox() {
    this.setState({
      isParent: !this.state.isParent,
      parentId: 0,
    });
  }

  handleLabel(e) {
    // this.setInputValue("label", e.target.value);
    let label = e.target.value;
    let code = e.target.value.toUpperCase().replace(/\s/g, "");
    this.setState({
      label: label,
      code: code,
    });
  }

  async saveProductCategory() {
    let name = this.state.label;
    let isParentUnit = this.state.isParent;
    let parentUom = this.state.parentId;
    let isActive = this.state.isActive;
    let code = this.state.code;
    let description = this.state.description;
    let tanentId = AuthUtil.getTanentId();

    if (!name) {
      this.setInputValue("responseMessage", "Enter Name");
      return;
    } else if (!isParentUnit && !parentUom) {
      this.setInputValue(
        "responseMessage",
        "Choose Parent Unit of Measurement"
      );
      return;
    } else {
      this.setInputValue("responseMessage", "");

      console.log("saving");
      const payLoad = {
        isActive: isActive,
        code: code,
        label: name,
        parentId: parentUom,
        tanentId: tanentId,
        description: description,
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
            <b>Product Type Details</b>
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
                    <b>Name</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Enter Name"
                      value={this.state.label}
                      onChange={this.handleLabel}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    <b>Description</b>
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <textarea
                      style={{ fontFamily: "Helvetica" }}
                      className="form-input"
                      type="text"
                      placeholder="Enter Description"
                      value={this.state.description}
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
                      Parent Type
                    </label>
                  </div>
                </td>
              </tr>
              {!this.state.isParent && (
                <>
                  <tr className="width100">
                    <td className="width25">
                      <label className="form-input-label2">
                        <b>Parent Product Type</b>
                      </label>
                    </td>
                    <td>
                      <SelectSearch
                        options={this.state.types}
                        search
                        onChange={this.handleTypeChange}
                        filterOptions={fuzzySearch}
                        emptyMessage="Nothing Found"
                        placeholder="Choose Type"
                      />
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-d-flex p-flex-column p-flex-md-row p-col-12 p-md-12 p-jc-md-end">
          <div className="p-mb-2 p-mr-2">
            <Button
              label="Save"
              onClick={() => this.saveProductCategory()}
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
                Product category is saved.
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
                Product category is not saved.
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
export default withRouter(ProductDetails);
