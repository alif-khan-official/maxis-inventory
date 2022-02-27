import React from "react";
import { withRouter } from "react-router-dom";
import MainComponent from "../../common/MainComponent";
import InputFieldComponentv2 from "../onboarding/FormComponent/InputFieldComponentv2";
import "../../App.css";

class ProductView extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    let data = this.props.location.state.item;
    if (!data) data = { customer: {}, localMerchant: {}, creator: {} };
    const stepDisplayStyleActive = { display: "block" };
    const stepDisplayStyleInactive = { display: "none" };

    this.state = {
      stepDisplayStyleActive: stepDisplayStyleActive,
      stepDisplayStyleInactive: stepDisplayStyleInactive,

      id: data.id,
      // createdOn: data.createdOn,
      name: data.label,
      type: data.productCategoryId,
    };
  }

  componentDidMount() {}

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
                  <label className="form-input-label2">ID</label>
                </td>
                <td className="width75">
                  <div className="flex-row">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      // placeholder="References Id"
                      id="referencesId"
                      value={this.state.id}
                      onChange={(val) =>
                        this.setInputValue("referencesId", val)
                      }
                      readOnly={true}
                      filter={false}
                    />
                  </div>
                </td>
              </tr>
              {/* 
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Created On</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      // placeholder="Inventory Item"
                      id="inventoryItem"
                      value={this.state.createdOn}
                      onChange={(val) =>
                        this.setInputValue("inventoryItem", val)
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              */}

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Name</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      // placeholder="Inventory filed1"
                      id="inventoryfiled1"
                      value={this.state.name}
                      onChange={(val) =>
                        this.setInputValue("inventoryfiled1", val)
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Type</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      // placeholder="Inventory field2"
                      id="inventoryfield2"
                      value={this.state.type}
                      onChange={(val) =>
                        this.setInputValue("inventoryfield2", val)
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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
export default withRouter(ProductView);
