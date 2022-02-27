import React from "react";
import MainComponent from "../../common/MainComponent";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";
import Stock from "./Stock";
import StockIn from "./StockIn";
import StockOut from "./StockOut";
import StockLedger from "./StockLedger";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class InventoryManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
      products: [],
      variants: [],
      productId: [],
      inventoryId: "",
      tabs: [
        { name: "Stocks", color: "#24a0ed", isSelected: true },
        { name: "Stock Ins", color: "#107BCC", isSelected: false },
        { name: "Stock Outs", color: "#107BCC", isSelected: false },
        { name: "Stock Ledger", color: "#107BCC", isSelected: false },
      ],
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.list = {
      path: "maxisservice-inventory-service/endpoint/api/inventory-by-productId/",
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
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  async getAllProducts() {
    let productArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(gwUrl + this.getAllProductsAPI.path, {
        method: "GET",
        headers: this.getAllProductsAPI.headers,
      });
      let response = await res.json();
      for (let i = 0; i < response.length; i++) {
        productArray.push({
          name: response[i].label + " - " + response[i].brandName,
          value: JSON.stringify({
            id: bigInt(response[i].id),
            label: response[i].label + " - " + response[i].brandName,
          }),
          // value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("products", productArray);
  }

  async getVariantsByProductId(selectedProductValue) {
    let variantArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(
        gwUrl + this.list.path + selectedProductValue.toString(),
        {
          method: "GET",
          headers: this.list.headers,
        }
      );

      let response = await res.json();

      for (let i = 0; i < response.length; i++) {
        response[i].name = response[i].productVariantLabel;
        response[i].value = bigInt(response[i].id);
      }

      variantArray = response;
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", variantArray);
  }

  handleProductChange(selectedProductValue) {
    let p = JSON.parse(selectedProductValue);
    this.setState({
      productId: p,
      inventoryId: "",
    });

    this.getVariantsByProductId(p.id);
  }

  handleVariantChange(selectedVariantValue) {
    this.setInputValue("inventoryId", selectedVariantValue);
  }

  handleTabChange(index) {
    let tabs = this.state.tabs;
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabs[i].isSelected = true;
        tabs[i].color = "#24a0ed";
      } else {
        tabs[i].isSelected = false;
        tabs[i].color = "#107BCC";
      }
    }
    this.setState({
      tabs: tabs,
      productId: this.state.productId,
      inventoryId: this.state.inventoryId,
    });
  }

  async componentDidMount() {
    this.getAllProducts();
  }

  getComponentDesign() {
    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">Inventory Management</div>
          </div>
        </div>
        <hr />

        <div className="card-form-body">
          <div>
            <table className="width100">
              <tbody className="width100">
                <tr className="width100">
                  {this.state.tabs.map((value, index) => {
                    let tabs = (
                      <td
                        className="tabs"
                        style={{
                          backgroundColor: value.color,
                        }}
                        onClick={() => this.handleTabChange(index)}
                      >
                        {value.name}
                      </td>
                    );
                    return tabs;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr />
        <br />

        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}></div>
        {AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" && (
          <hr />
        )}
        <div className="card-form-body">
          <div style={{ textAlign: "center" }}>
            <table className="width100">
              <tbody className="width100">
                <tr className="width100">
                  <td className="width10">
                    <label className="form-input-label2">Product</label>
                  </td>
                  <td>
                    <SelectSearch
                      options={this.state.products}
                      search
                      onChange={this.handleProductChange}
                      filterOptions={fuzzySearch}
                      emptyMessage="Nothing Found"
                      placeholder="Choose Product"
                    />
                  </td>
                  <td className="width10">
                    <label className="form-input-label2">Variant</label>
                  </td>
                  <td>
                    <SelectSearch
                      disabled={this.state.tabs[0].isSelected && true}
                      options={this.state.variants}
                      search
                      value={this.state.inventoryId}
                      onChange={this.handleVariantChange}
                      filterOptions={fuzzySearch}
                      emptyMessage="Nothing Found"
                      placeholder="Choose Variant"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <hr />
        <br />

        {this.state.tabs[0].isSelected && (
          <Stock
            selectedProduct={this.state.productId}
            key={this.state.productId.id}
          />
        )}

        {this.state.tabs[1].isSelected && (
          <StockIn
            // product={this.state.product}
            selectedProduct={this.state.productId}
            selectedVariant={this.state.inventoryId}
            key={this.state.inventoryId}
          />
        )}

        {this.state.tabs[2].isSelected && (
          <StockOut
            selectedProduct={this.state.productId}
            selectedVariant={this.state.inventoryId}
            key={this.state.inventoryId}
          />
        )}

        {this.state.tabs[3].isSelected && (
          <StockLedger
            selectedProduct={this.state.productId}
            selectedVariant={this.state.inventoryId}
            key={this.state.inventoryId}
          />
        )}
      </div>
    );
    return componentDesign;
  }
  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(InventoryManagement);
