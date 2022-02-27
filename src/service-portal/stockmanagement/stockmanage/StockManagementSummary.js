import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import React from "react";
import MainComponent from "../../../common/MainComponent";
import AuthUtil from "../../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../../App.css";

import SelectSearch, { fuzzySearch } from "react-select-search";

var bigInt = require("big-integer");

class StockManagementSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
      products: [],
      variants: [],
      // productId: "",
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.viewEntity = this.viewEntity.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
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

  viewEntity(item) {
    this.props.history.push({
      pathname: "/stock-management-history",
      state: { item: item },
    });
    console.log("====item====");
    console.log(item);
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

  async getVariantsByProductId(selectedProduct) {
    let variantArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let res = await fetch(
        gwUrl + this.list.path + selectedProduct.id.toString(),
        {
          method: "GET",
          headers: this.list.headers,
        }
      );

      let response = await res.json();
      let attributes = "";

      for (let i = 0; i < response.length; i++) {
        response[i].product = selectedProduct.label;
        response[i].id = bigInt(response[i].id);
        response[i].availableBaseUnitQuantity =
          response[i].availableBaseUnitQuantity +
          " " +
          response[i].baseUnitOfMeasure.label;
        for (let j = 0; j < response[i].variantAttributes.length; j++) {
          if (attributes === "") {
            attributes = response[i].variantAttributes[j].attributeValueLabel;
          } else {
            attributes =
              attributes +
              ", " +
              response[i].variantAttributes[j].attributeValueLabel;
          }
        }
        response[i].variantAttributes = attributes;
        attributes = "";
      }

      variantArray = response.reverse();
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", variantArray);
  }

  handleProductChange(selectedProduct) {
    /*
    this.setState({
      productId: selectedProductValue,
    });
    */
    let p = JSON.parse(selectedProduct);
    this.getVariantsByProductId(p);
  }

  async componentDidMount() {
    this.getAllProducts();
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Variant",
          selector: "productVariantLabel",
          // style: { width: "150px" },
        },
        /*
        {
          name: "Attributes",
          selector: "variantAttributes",
          // style: { width: "250px" },
        },
        */
        {
          name: "Available Quantity",
          selector: "availableBaseUnitQuantity",
          // style: { width: "150px" },
        },
        {
          name: "Quantity Details",
          selector: "availableBaseUnitQuantityInWord",
          // style: { width: "250px" },
        },
      ];
    if (role === "Maxis-Services-LM-Administrator")
      columnData = [
        { name: "Id", selector: "id", style: { width: "250px" } },
        {
          name: "Created on",
          selector: "creationDate",
          style: { width: "150px" },
        },
        {
          name: "Branch",
          selector: "localMerchant.name",
          style: { width: "250px" },
        },
        { name: "Issuer", selector: "creator.name", style: { width: "250px" } },
        {
          name: "Customer",
          selector: "customer.name",
          style: { width: "250px" },
        },
        {
          name: "Phone",
          selector: "customer.phoneNumber",
          style: { width: "150px" },
        },
        {
          name: "Amount",
          selector: "schemeAmount",
          style: { width: "150px", textAlign: "right" },
        },
        {
          name: "Count",
          selector: "schemeInstallmentCount",
          style: { width: "150px", textAlign: "right" },
        },
        {
          name: "Paid",
          selector: "installPaidCount",
          style: { width: "100px", textAlign: "right" },
        },
        {
          name: "Status",
          selector: "completeStatus",
          style: { width: "100px" },
        },
      ];
    let tableData = this.state.variants;
    let actions = this.state.actions;

    let componentDesign = (
      <div className="card">
        <div className="p-d-flex border">
          <div className="p-col-12 p-lg-12">
            <div className="table-header">Stock Management Summary</div>
          </div>
        </div>

        <hr />

        <div className="p-grid p-fluid" style={{ marginRight: "0rem" }}></div>

        {AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" && (
          <hr />
        )}

        <div className="card-form-body">
          <div>
            <table className="width100">
              <tbody className="width100">
                <tr className="width100">
                  {/*
                  <td className="width25">
                    <label className="form-input-label2">Product</label>
                  </td>
                  */}
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-grid fixedwidth512">
          <div className="datatable-filter-demo">
            <DataTable
              value={tableData}
              paginator
              rows={10}
              className="p-datatable-customers"
            >
              {columnData &&
                columnData.map((value, index) => {
                  if (index === 1)
                    return (
                      <Column
                        key={index}
                        field={value.selector}
                        header={value.name}
                        style={value.style}
                        sortable={true}
                        filter
                        filterPlaceholder="Search here"
                        filterMatchMode="contains"
                        //body={this.dateTemplate}
                      />
                    );
                  else
                    return (
                      <Column
                        key={index}
                        field={value.selector}
                        header={value.name}
                        style={value.style}
                        sortable={true}
                        filter
                        filterPlaceholder="Search here"
                        filterMatchMode="contains"
                      />
                    );
                })}
              {actions && (
                <Column
                  header="Action"
                  style={{ width: "256px" }}
                  body={(h) => (
                    <div className="p-d-flex">
                      {actions.map((value, index) => {
                        return (
                          <div key={index}>
                            <Button
                              label="View"
                              onClick={() => {
                                this.viewEntity(h);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              )}
            </DataTable>
          </div>
        </div>
        <hr />
        <br />
      </div>
    );
    return componentDesign;
  }
  render() {
    let componentDesign = this.getComponentDesign();
    return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(StockManagementSummary);
