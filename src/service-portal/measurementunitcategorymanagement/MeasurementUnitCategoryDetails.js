import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import "../../App.css";
import AuthUtil from "../../auth/AuthUtil";

class MeasureUnitCategoryDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    /*
    let data = this.props.location.state.item;
    if (!data)
      data = {
        // id: "",
        isActive: true,
        // parentId: 0,
        tanentId: AuthUtil.getTanentId(),
      };
*/
    this.state = {
      // id: data.id,
      // code: data.code,
      code: "",
      // label: data.label,
      label: "",
      // isActive: data.isActive,
      isActive: true,
      // parentId: data.parentId,
      // tanentId: data.tanentId,
      tanentId: AuthUtil.getTanentId(),
      description: "",
      saveOperation: false,
      responseMessage: "",
    };

    this.gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    this.addAPI = {
      path: "maxisservice-inventory-service/endpoint/api/unit-of-measure-category/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };

    this.setInputValue = this.setInputValue.bind(this);
    this.saveMeasureUnitCategory = this.saveMeasureUnitCategory.bind(this);
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  componentDidMount() {
    console.log("mounting");
    console.log("mounted");
  }

  async saveMeasureUnitCategory() {
    if (!this.state.code) {
      this.setInputValue(
        "responseMessage",
        "Unit of Measure Category Code is empty"
      );
      return;
    } else if (!this.state.label) {
      this.setInputValue(
        "responseMessage",
        "Unit of Measure Category Label is empty"
      );
      return;
    } else {
      this.setInputValue("responseMessage", "");

      console.log("saving");
      const payLoad = this.state;
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
            <b>Unit of Measurement Category Details</b>
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
                  <label className="form-input-label2">Category Code</label>
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
                  <label className="form-input-label2">Category Label</label>
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
                    Category Description
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
                      // id={this.state.id + "-label"}
                      onChange={(e) =>
                        this.setInputValue("description", e.target.value)
                      }
                    ></textarea>
                  </div>
                </td>
              </tr>

              <tr>
                <td>
                  <Button
                    label="Save"
                    onClick={() => this.saveMeasureUnitCategory()}
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
                Measurement unit category is saved.
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
                Measurement unit category is not saved.
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
export default withRouter(MeasureUnitCategoryDetails);
