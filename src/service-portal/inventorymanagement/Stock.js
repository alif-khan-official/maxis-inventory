import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { Button } from "primereact/button";
import React from "react";
import AuthUtil from "../../auth/AuthUtil";
import { withRouter } from "react-router-dom";
import "../../App.css";

var bigInt = require("big-integer");

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      actions: [{ actionCode: "VIEW" }],
      // products: [],
      variants: [],
      // productId: "",
    };

    console.log("constructed");
    this.setInputValue = this.setInputValue.bind(this);
    this.viewEntity = this.viewEntity.bind(this);
    // this.handleProductChange = this.handleProductChange.bind(this);
    this.list = {
      path: "maxisservice-inventory-service/endpoint/api/inventory-by-productId/",
      headers: {
        "Content-Type": "application/json",
        token: "Bearer " + AuthUtil.getIdToken(),
        userid: AuthUtil.getUserId(),
      },
    };
    /*
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
    */
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

  viewEntity(item) {
    this.props.history.push({
      pathname: "/edit-product-variant",
      state: { item: item },
    });
    console.log("====item====");
    console.log(item);
  }
  /*
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
          name: response[i].label,
          value: bigInt(response[i].id),
        });
      }
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("products", productArray);
  }
  */
  async getVariantsByProductId() {
    let variantArray = [];

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;

    try {
      let selectedProduct = this.props.selectedProduct;
      let res = await fetch(
        gwUrl + this.list.path + selectedProduct.id.toString(),
        {
          method: "GET",
          headers: this.list.headers,
        }
      );

      let response = await res.json();
      // let attributes = "";
      let total = "";

      for (let i = 0; i < response.length; i++) {
        response[i].productId = selectedProduct.id.toString();
        response[i].product = selectedProduct.label;
        response[i].id = bigInt(response[i].id);
        response[i].availableBaseUnitQuantity =
          response[i].availableBaseUnitQuantity +
          " " +
          response[i].baseUnitOfMeasure.label;
        /*  
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
        */
        for (
          let k = response[i].listQuantityBySpecificUnityOfMeasure.length - 1;
          k >= 0;
          k--
        ) {
          if (total === "") {
            total =
              response[i].listQuantityBySpecificUnityOfMeasure[k].quantity +
              " " +
              response[i].listQuantityBySpecificUnityOfMeasure[k].unitOfMeasure
                .label;
          } else {
            total =
              total +
              " " +
              response[i].listQuantityBySpecificUnityOfMeasure[k].quantity +
              " " +
              response[i].listQuantityBySpecificUnityOfMeasure[k].unitOfMeasure
                .label;
          }
        }
        // response[i].variantAttributes = attributes;
        response[i].availableBaseUnitQuantityInWord = total;
        // attributes = "";
        total = "";
      }

      variantArray = response.reverse();
    } catch (e) {
      console.log(e);
    }

    this.setInputValue("variants", variantArray);
  }
  /*
  handleProductChange(selectedProductValue) {
  
    this.setState({
      productId: selectedProductValue,
    });
    
    this.getVariantsByProductId(selectedProductValue);
  }
*/
  async componentDidMount() {
    // this.getAllProducts();
    this.getVariantsByProductId();
  }

  getComponentDesign() {
    let columnData = [];
    let role = AuthUtil.getRole(0).code;

    if (role === "Maxis-Services-MM-Administrator")
      columnData = [
        {
          name: "Variant",
          selector: "productVariantLabel",
        },

        {
          name: "Available Quantity",
          selector: "availableBaseUnitQuantity",
        },
        {
          name: "Quantity Details",
          selector: "availableBaseUnitQuantityInWord",
        },
      ];
    /*
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
      */
    let tableData = this.state.variants;
    // let actions = this.state.actions;

    let componentDesign = (
      <div>
        {/*
        {AuthUtil.getRole(0).code === "Maxis-Services-LM-Administrator" && (
          <hr />
        )}
        <div className="p-grid fixedwidth512">
        <div className="datatable-filter-demo" style={{ overflowX: "auto" }}> 
        */}
        <div>
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
                      // filterPlaceholder="Search here"
                      // filterMatchMode="contains"
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
                      // filterPlaceholder="Search here"
                      // filterMatchMode="contains"
                    />
                  );
              })}
            {/*
            actions && (
              <Column
                header="Action"
                style={{ width: "120px" }}
                body={(h) => (
                  <div className="p-d-flex">
                    {actions.map((value, index) => {
                      return (
                        <div key={index}>
                          <Button
                            label="Edit"
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
            )
            */}
          </DataTable>
        </div>

        <hr />
        <br />
      </div>
    );
    return componentDesign;
  }
  render() {
    // let componentDesign = this.getComponentDesign();
    return this.getComponentDesign();
    // return <MainComponent component={componentDesign} />;
  }
}
export default withRouter(Stock);
