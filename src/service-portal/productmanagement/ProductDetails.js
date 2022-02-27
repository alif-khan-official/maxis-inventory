import React from "react";
import { withRouter } from "react-router-dom";
import { Button } from "primereact/button";
import MainComponent from "../../common/MainComponent";
import InputFieldComponentv2 from "../onboarding/FormComponent/InputFieldComponentv2";
import DateTimeComponentScheme from "../scheme/SchemeForm/DateTimeComponentScheme";
import AuthUtil from "../../auth/AuthUtil";
import "../../App.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

class ProductDetails extends React.Component {
  constructor(props) {
    let val = new Date();
    let year = val.getFullYear();
    let month = val.getMonth() + 1;
    let day = val.getDate();
    let date = year + "-";
    date = date + (month < 10 ? "0" : "") + month + "-";
    date = date + (day < 10 ? "0" : "") + day;

    console.log("========data attempt========");
    super(props);
    console.log(this.props);
    let data = this.props.location.state.item;
    if (!data) data = { customer: {}, localMerchant: {}, creator: {} };
    const stepDisplayStyleActive = { display: "block" };
    const stepDisplayStyleInactive = { display: "none" };

    let roleList = AuthUtil.getRoleList();
    console.log(roleList);
    let roleId = "";

    for (let index = 0; index < roleList.length; index++) {
      if (roleList[index].name === "admin") {
        roleId = roleList[index].code;
        break;
      } else {
        roleId = roleList[index].code;
        break;
      }
    }

    this.state = {
      attemptId: data.attemptIdScheme,
      propCustomerId: data.userId,
      profileId: data.profileId,
      fields: [],
      designName: "Form",
      fieldvalues: [],
      activeStep: 0,
      lastStep: 0,
      steps: [],
      roleName: roleId,

      stepDisplayStyleActive: stepDisplayStyleActive,
      stepDisplayStyleInactive: stepDisplayStyleInactive,

      resultPresent: false,
      resultPresentProcessing: false,
      resultPresentFailure: false,
      resultPresentSuccess: false,

      meta: [],
      dropdowns: [],
      customerId: "",
      customerPhoneNumber: "",
      customerName: "",
      customerList: [],
      customerDropDownList: [],
      attemptIdScheme: data.attemptIdScheme,
      dropDownsDependencies: [],
      dropDownValues: [],

      installmentYYYYMMDD: date,
      installmentDuration: "MONTHLY",
      installmentAmount: "",
      installmentCount: "",
      installmentDetails: "",
      installmentSchedule: [],
      data: data,
      installmentData: [],
      notificationData: [],
      actions: [
        { actionCode: "NOTIFY", actionLabel: "Notify" },
        { actionCode: "MARK", actionLabel: "Mark Paid" },
      ],
      installResultPresent: { serial: "", status: "ABSENT" },
      notifyResultPresent: { serial: "", status: "ABSENT" },
      notificationContent:
        "Amount [[AMOUNT]] for installment number [[#]] of [[SCHEME]] is due to [[MERCHANT]] on [[DATE]] at [[SHOWROOM]].",
    };

    this.saveDropDownDependencies = this.saveDropDownDependencies.bind(this);
    this.saveDropDownValues = this.saveDropDownValues.bind(this);
    this.handleInstallment = this.handleInstallment.bind(this);
    this.setInputValue = this.setInputValue.bind(this);
    this.setFieldValue = this.setFieldValue.bind(this);
  }

  handleInstallment(action, installment) {
    console.log(action);
    console.log(installment);

    this.setInputValue("installResultPresent", {
      serial: "",
      status: "ABSENT",
    });
    this.setInputValue("notifyResultPresent", { serial: "", status: "ABSENT" });

    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    if (action === "MARK") {
      let payLoad = { installmentId: installment.id };
      try {
        fetch(gwUrl + "maxisservice-service/endpoint/scheme/pay-installment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "Bearer " + AuthUtil.getIdToken(),
            userid: AuthUtil.getUserId(),
          },
          body: JSON.stringify(payLoad),
        })
          .then((res) => res.json())
          .then((json) => json)
          .then((result) => {
            if (
              result.paymentStatus !== undefined &&
              result.paymentStatus !== null &&
              result.paymentStatus !== ""
            ) {
              this.setInputValue("installResultPresent", {
                serial: result.installmentSerial,
                status: "SUCCESS",
              });
              this.loadInstallments();
            } else {
              this.setInputValue("installResultPresent", {
                serial: result.installmentSerial,
                status: "FAILURE",
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    } else if (action === "NOTIFY") {
      let payLoad = {
        installmentId: installment.id,
        senderId: AuthUtil.getUserId(),
      };
      try {
        fetch(
          gwUrl + "maxisservice-service/endpoint/scheme/notify-installment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              token: "Bearer " + AuthUtil.getIdToken(),
              userid: AuthUtil.getUserId(),
            },
            body: JSON.stringify(payLoad),
          }
        )
          .then((res) => res.json())
          .then((json) => json)
          .then((result) => {
            if (
              result.id !== undefined &&
              result.paymentStatus !== null &&
              result.id !== ""
            ) {
              this.setInputValue("notifyResultPresent", {
                serial: result.installmentSerial,
                status: "SUCCESS",
              });
              this.loadNotifications();
            } else {
              this.setInputValue("notifyResultPresent", {
                serial: result.installmentSerial,
                status: "FAILURE",
              });
            }
          });
      } catch (e) {
        console.log(e);
      }
    }
    console.log("mounted");
  }

  GetSortOrder(prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
      return 0;
    };
  }

  saveDropDownDependencies(key, element) {
    console.log("saveDropDownDependencies");
    console.log(key);
    console.log(element);
    let dropDownsDependencies = this.state.dropDownsDependencies;

    if (dropDownsDependencies[key] === undefined)
      dropDownsDependencies[key] = [];
    dropDownsDependencies[key].push(element);
    this.setInputValue("dropDownsDependencies", dropDownsDependencies);
    console.log("this.state.dropDownsDependencies");
    console.log(this.state.dropDownsDependencies);
  }

  saveDropDownValues(key, value) {
    console.log("saveDropDownValues");
    console.log(key);
    console.log(value);
    let currentDropDownValues = this.state.dropDownValues;
    currentDropDownValues[key] = value;
    this.setInputValue("dropDownValues", currentDropDownValues);
    console.log("this.state.dropDownValues");
    console.log(this.state.dropDownValues);

    let depList = this.state.dropDownsDependencies[key];
    for (let i = 0; depList !== undefined && i < depList.length; i++) {
      let dd = depList[i];
      dd.resetOptions(value);
    }
  }

  setInputValue(property, val) {
    this.setState({ [property]: val });
  }

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

  resetForm() {}

  async loadInstallments() {
    console.log("Installments loading");
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    const payLoad = { schemeId: this.state.data.id };
    try {
      fetch(gwUrl + "maxisservice-service/endpoint/scheme/get-installment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "Bearer " + AuthUtil.getIdToken(),
          userid: AuthUtil.getUserId(),
        },
        body: JSON.stringify(payLoad),
      })
        .then((res) => res.json())
        .then((json) => json)
        .then((result) => {
          this.setInputValue("installmentData", result);
        });
    } catch (e) {
      console.log(e);
    }
    console.log("Installments loaded");
  }

  async loadNotifications() {
    console.log("Notifications loading");
    const gwUrl = process.env.REACT_APP_SERVICE_API_GW_HOST;
    const payLoad = { schemeId: this.state.data.id };
    try {
      fetch(gwUrl + "maxisservice-service/endpoint/scheme/get-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "Bearer " + AuthUtil.getIdToken(),
          userid: AuthUtil.getUserId(),
        },
        body: JSON.stringify(payLoad),
      })
        .then((res) => res.json())
        .then((json) => json)
        .then((result) => {
          this.setInputValue("notificationData", result);
        });
    } catch (e) {
      console.log(e);
    }
    console.log("Notifications loaded");
  }

  componentDidMount() {
    console.log("mounting");
    this.loadInstallments();
    this.loadNotifications();
    console.log("mounted");
  }

  newScheme() {
    this.props.history.push({
      pathname: "/new-scheme",
      state: { attemptIdScheme: this.state.attemptIdScheme },
    });
  }

  getComponentDesign() {
    let columnInstallmentData = [
      {
        name: "Serial",
        selector: "installmentSerial",
        style: { width: "100px", textAlign: "right" },
      },
      {
        name: "Date",
        selector: "installmentDate",
        style: { width: "100px", textAlign: "right" },
      },
      {
        name: "Paid",
        selector: "installmentSubmissionDate",
        style: { width: "150px", textAlign: "right" },
      },
    ];
    let columnNotificationData = [
      {
        name: "Installment",
        selector: "installmentSerial",
        style: { width: "100px", textAlign: "right" },
      },
      {
        name: "Date",
        selector: "notificationDateString",
        style: { width: "100px", textAlign: "right" },
      },
      {
        name: "Content",
        selector: "notificationContent",
        style: { width: "250px", textAlign: "left" },
      },
    ];
    let installmentData = this.state.installmentData;
    let notificationData = this.state.notificationData;
    let actions = this.state.actions;
    let design = (
      <div className="card-form-body">
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Details</b>
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
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="ID"
                      id="id"
                      value={
                        this.state.data.id === undefined
                          ? ""
                          : this.state.data.id
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Customer Id</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Customer Id"
                      id="customerId"
                      value={
                        this.state.data.customer.userId === undefined
                          ? ""
                          : this.state.data.customer.userId
                      }
                      readOnly={true}
                      filter={false}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Customer Name</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Customer Name"
                      id="customerName"
                      value={
                        this.state.data.customer.name === undefined
                          ? ""
                          : this.state.data.customer.name
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Customer Phone</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Customer Phone"
                      id="customerPhoneNumber"
                      value={
                        this.state.data.customer.phoneNumber === undefined
                          ? ""
                          : this.state.data.customer.phoneNumber
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <hr />
                </td>
                <td>
                  <hr />
                </td>
              </tr>
              {AuthUtil.getRole(0).code ===
                "Maxis-Services-MM-Administrator" && (
                <tr className="width100">
                  <td className="width25">
                    <label className="form-input-label2">Branch</label>
                  </td>
                  <td className="width75">
                    <div className="d-flex">
                      <InputFieldComponentv2
                        className="form-input"
                        type="text"
                        placeholder="Branch"
                        id="branchName"
                        value={
                          this.state.data.localMerchant.name === undefined
                            ? ""
                            : this.state.data.localMerchant.name
                        }
                        readOnly={true}
                      />
                    </div>
                  </td>
                </tr>
              )}
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Issuer</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Issuer"
                      id="issuerName"
                      value={
                        this.state.data.creator.name === undefined
                          ? ""
                          : this.state.data.creator.name
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Issued on</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Issued on"
                      id="issuedOn"
                      value={
                        this.state.data.creationDate === undefined
                          ? ""
                          : this.state.data.creationDate.substring(0, 10)
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <hr />
                </td>
                <td>
                  <hr />
                </td>
              </tr>

              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Installment Period
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Installment Period"
                      id="installmentDuration"
                      value="MONTHLY"
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Installment Details
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Installment Details"
                      id="installmentDetails"
                      readOnly={true}
                      value={
                        this.state.data.schemeDetails === undefined
                          ? ""
                          : this.state.data.schemeDetails
                      }
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    Installment Amount
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Installment Amount"
                      id="installmentAmount"
                      value={
                        this.state.data.schemeAmount === undefined
                          ? ""
                          : this.state.data.schemeAmount
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">Installment Count</label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <InputFieldComponentv2
                      className="form-input"
                      type="text"
                      placeholder="Installment Count"
                      id="installmentCount"
                      value={
                        this.state.data.schemeInstallmentCount === undefined
                          ? ""
                          : this.state.data.schemeInstallmentCount
                      }
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
              <tr className="width100">
                <td className="width25">
                  <label className="form-input-label2">
                    First Installment Date
                  </label>
                </td>
                <td className="width75">
                  <div className="d-flex">
                    <DateTimeComponentScheme
                      value={this.state.data.installStartDateString}
                      rootComponent={this}
                      readOnly={true}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <hr />
        {this.state.installResultPresent.status === "SUCCESS" && (
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
                Installment {this.state.installResultPresent.serial} is marked
                paid.
              </h5>
            </div>
            <hr />
          </div>
        )}
        {this.state.installResultPresent.status === "FAILURE" && (
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
                Installment {this.state.installResultPresent.serial} payment
                update operation failed.
              </h5>
            </div>
            <hr />
          </div>
        )}
        {this.state.notifyResultPresent.status === "SUCCESS" && (
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
                Installment {this.state.installResultPresent.serial}{" "}
                notification is sent successfully..
              </h5>
            </div>
            <hr />
          </div>
        )}
        {this.state.notifyResultPresent.status === "FAILURE" && (
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
                Installment {this.state.installResultPresent.serial}{" "}
                notification send operation failed.
              </h5>
            </div>
            <hr />
          </div>
        )}
        <hr />
        <table className="width100">
          <tbody className="width100">
            <tr className="width100">
              <td className="width25">
                <label className="form-input-label2">
                  <b>Notification content</b>
                </label>
              </td>
              <td className="width75">
                <div className="d-flex">
                  <InputFieldComponentv2
                    className="form-input"
                    type="text"
                    placeholder="Notification content"
                    id="notificationContent"
                    value={
                      this.state.notificationContent === undefined
                        ? ""
                        : this.state.notificationContent
                    }
                    readOnly={false}
                    onChange={(val) =>
                      this.setInputValue("notificationContent", val)
                    }
                  />
                </div>
              </td>
            </tr>
            <tr className="width100">
              <td className="width25">
                <label className="form-input-label2">
                  <b>Markers</b>
                </label>
              </td>
              <td className="width75">
                <div className="d-flex">
                  <table>
                    <tbody>
                      <tr>
                        <td>[AMOUNT] </td>
                        <td>==&gt;</td>
                        <td>Installment amount </td>
                      </tr>
                      <tr>
                        <td>[#] </td>
                        <td>==&gt;</td>
                        <td>Installment serial </td>
                      </tr>
                      <tr>
                        <td>[SCHEME] </td>
                        <td>==&gt;</td>
                        <td>Issue ID </td>
                      </tr>
                      <tr>
                        <td>[MERCHANT] </td>
                        <td>==&gt;</td>
                        <td>Company Name </td>
                      </tr>
                      <tr>
                        <td>[DATE] </td>
                        <td>==&gt;</td>
                        <td>Installment Date </td>
                      </tr>
                      <tr>
                        <td>[SHOWROOM] </td>
                        <td>==&gt;</td>
                        <td>Showroom Name </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Installments</b>
          </h3>
          <hr />
        </div>
        <div className="p-grid p-fluid">
          <div className="datatable-filter-demo">
            <DataTable
              value={installmentData}
              paginator
              rows={10}
              className="p-datatable-customers"
            >
              {columnInstallmentData &&
                columnInstallmentData.map((value, index) => {
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
                        body={this.dateTemplate}
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
                        if (
                          h.paymentStatus === undefined ||
                          h.paymentStatus === null ||
                          h.paymentStatus === "" ||
                          h.paymentStatus === "DUE"
                        ) {
                          return (
                            <div key={index} style={{ padding: "2px" }}>
                              <Button
                                label={value.actionLabel}
                                onClick={() => {
                                  this.handleInstallment(value.actionCode, h);
                                }}
                              />
                            </div>
                          );
                        } else return null;
                      })}
                    </div>
                  )}
                />
              )}
            </DataTable>
          </div>
        </div>
        <hr />
        <div width="100%" style={{ textAlign: "center" }}>
          <h3>
            <b>Notifications</b>
          </h3>
        </div>
        <hr />
        <div className="p-grid p-fluid">
          <div className="datatable-filter-demo">
            <DataTable
              value={notificationData}
              paginator
              rows={10}
              className="p-datatable-customers"
            >
              {columnNotificationData &&
                columnNotificationData.map((value, index) => {
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
                        body={this.dateTemplate}
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
            </DataTable>
          </div>
        </div>
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
