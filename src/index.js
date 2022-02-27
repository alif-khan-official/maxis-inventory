import React from "react";
import ReactDOM from "react-dom";
import {
	BrowserRouter as Router,
	Route,
	Switch
} from "react-router-dom";
import App from "./App";
import "./index.css";

import PrivacyPolicy from "./login/privacypolicy";

import UserManagement from "./../src/service-portal/onboarding/UserManagement/UserManagement";

import ViewFormComponent from "./service-portal/onboarding/FormComponent/ViewFormComponent";
import AddFormComponent from "./service-portal/onboarding/FormComponent/AddFormComponent";
import EditFormComponent from "./service-portal/onboarding/FormComponent/EditFormComponent";

import AddSchemeComponent from "./service-portal/scheme/SchemeForm/NewScheme";
import SchemeDetails from "./service-portal/scheme/SchemeForm/SchemeDetails";
import SchemeManagement from "./service-portal/scheme/SchemeList/SchemeManagement";
import InstallmentManagement from "./service-portal/scheme/SchemeList/InstallmentManagement";
import NotificationManagement from "./service-portal/scheme/SchemeList/NotificationManagement";

import HomeComponent from "./../src/home/HomeComponent";
import UpdatePassword from "./password/UpdatePasswordComponent";

import NotFound from "./../src/not-found/NotFound";

import CreditNotificationManagement from "./service-portal/creditmanagement/creditnotification/CreditNotificationManagement";

import CreditPartnerSettingsNew from "./service-portal/creditmanagement/creditpartnersettings/CreditPartnerSettingsNew";
import CreditPartnerSettingsDetails from "./service-portal/creditmanagement/creditpartnersettings/CreditPartnerSettingsDetails";
import CreditPartnerSettingsView from "./service-portal/creditmanagement/creditpartnersettings/CreditPartnerSettingsView";
import CreditPartnerSettingsManagement from "./service-portal/creditmanagement/creditpartnersettings/CreditPartnerSettingsManagement";

import CreditPartnerLedgerManagement from "./service-portal/creditmanagement/creditledger/CreditPartnerLedgerManagement";
import CreditSalesOfficerManagement from "./service-portal/creditmanagement/creaditsalesofficer/CreditSalesOfficer";

import CreditSaleSendSMS from "./service-portal/creditmanagement/creditreminder/CreditSaleSendSMS";
import CreditSaleReschedule from "./service-portal/creditmanagement/creditreminder/CreditSaleReschedule";
import CreditSaleReminderManagement from "./service-portal/creditmanagement/creditreminder/CreditReminderManagement";

import CreditSaleManagement from "./service-portal/creditmanagement/creditsale/CreditSaleManagement";
import CreditSaleNew from "./service-portal/creditmanagement/creditsale/CreditSaleNew";
import CreditSaleDetails from "./service-portal/creditmanagement/creditsale/CreditSaleDetails";

import CreditCollectionManagement from "./service-portal/creditmanagement/creditcollection/CreditCollectionManagement";
import CreditCollectionNew from "./service-portal/creditmanagement/creditcollection/CreditCollectionNew";
import CreditCollectionDetails from "./service-portal/creditmanagement/creditcollection/CreditCollectionDetails";

//product-management
import ProductList from "./service-portal/productmanagement/ProductList";
import ProductAdd from "./service-portal/productmanagement/ProductAdd";
// import ProductView from "./service-portal/productmanagement/ProductView";
import ProductEdit from "./service-portal/productmanagement/ProductEdit";
import ProductVariantAdd from "./service-portal/productmanagement/ProductVariantAdd";
//stock-in-management
import StockInDetails from "./service-portal/stockmanagement/stockin/StockInDetails";
import StockInManagement from "./service-portal/stockmanagement/stockin/StockInManagement";
import ViewStockIn from "./service-portal/stockmanagement/stockin/ViewStockIn";
//stock-out-management
import StockOutDetails from "./service-portal/stockmanagement/stockout/StockOutDetails";
import StockOutManagement from "./service-portal/stockmanagement/stockout/StockOutManagement";
import ViewStockOut from "./service-portal/stockmanagement/stockout/ViewStockOut";
//stock-management
import StockManagementSummary from "./service-portal/stockmanagement/stockmanage/StockManagementSummary";
import StockManagementHistory from "./service-portal/stockmanagement/stockmanage/StockManagementHistory";
import StockManagementDetails from "./service-portal/stockmanagement/stockmanage/StockManagementDetails";
//product-category-management
import ProductCategoryDetails from "./service-portal/productcategorymanagement/ProductCategoryDetails";
import ProductCategoryManagement from "./service-portal/productcategorymanagement/ProductCategoryList";
import ViewProductCategories from "./service-portal/productcategorymanagement/ViewProductCategories";
//measurement-unit-category-management
import MeasureUnitCategoryDetails from "./service-portal/measurementunitcategorymanagement/MeasurementUnitCategoryDetails";
import MeasureUnitCategoryManagement from "./service-portal/measurementunitcategorymanagement/MeasurementUnitCategoryList";
//measurement-unit-management
import MeasureUnitDetails from "./service-portal/measurementunitmanagement/MeasurementUnitDetails";
import MeasureUnitManagement from "./service-portal/measurementunitmanagement/MeasurementUnitList";
import ViewMeasurementUnits from "./service-portal/measurementunitmanagement/ViewMeasurementUnit";
//attribute-management
import AttributeDetails from "./service-portal/attributemanagement/AttributeDetails";
// import AttributeManagement from "./service-portal/attributemanagement/AttributeList";
//attribute-value-management
import AttributeValueDetails from "./service-portal/attributevaluemanagement/AttributeValueDetails";
import AttributeValueManagement from "./service-portal/attributevaluemanagement/AttributeValueList";
import ViewAttributeValues from "./service-portal/attributevaluemanagement/ViewAttributeValues";
//inventory-management
import InventoryManagement from "./service-portal/inventorymanagement/InventoryManagement";
//variant-management
import ProductVariantDetails from "./service-portal/variantmanagement/ProductVariantDetails";
import EditProductVariant from "./service-portal/variantmanagement/EditProductVariant";
import UsageCrMS from "./service-portal/creditmanagement/usage/UsageCrMS";

console.log = function() { };

const routing = (
	<Router>
		<Switch>
			<Route exact path="/" component={App} />
			<Route exact path="/home" component={HomeComponent} />
			<Route exact path="/update-password" component={UpdatePassword} />

			<Route exact path="/user-management" component={UserManagement} />

			<Route exact path="/view" component={ViewFormComponent} />
			<Route exact path="/add" component={AddFormComponent} />
			<Route exact path="/edit" component={EditFormComponent} />

			<Route exact path="/new-scheme" component={AddSchemeComponent} />
			<Route exact path="/scheme-details" component={SchemeDetails} />
			<Route exact path="/scheme-management" component={SchemeManagement} />
			<Route exact path="/scheme-installment" component={InstallmentManagement} />
			<Route exact path="/scheme-notification" component={NotificationManagement} />

			<Route exact path="/credit-notification-management" component={CreditNotificationManagement} />

			<Route exact path="/credit-sales-send-sms" component={CreditSaleSendSMS} />
			<Route exact path="/credit-sales-reschedule" component={CreditSaleReschedule} />
			<Route exact path="/reminder-management" component={CreditSaleReminderManagement} />

			<Route exact path="/credit-sale-new" component={CreditSaleNew} />
			<Route exact path="/credit-sale-details" component={CreditSaleDetails} />
			<Route exact path="/credit-sales-management" component={CreditSaleManagement} />

			<Route exact path="/credit-collection-new" component={CreditCollectionNew} />
			<Route exact path="/credit-collection-details" component={CreditCollectionDetails} />
			<Route exact path="/credit-collection-management" component={CreditCollectionManagement} />

			<Route exact path="/credit-partner-settings-new" component={CreditPartnerSettingsNew} />
			<Route exact path="/credit-partner-settings-details" component={CreditPartnerSettingsDetails} />
			<Route exact path="/credit-partner-settings-view" component={CreditPartnerSettingsView} />
			<Route exact path="/credit-partner-settings-management" component={CreditPartnerSettingsManagement} />

			<Route exact path="/credit-partner-ledger-details" component={CreditPartnerLedgerManagement} />
			<Route exact path="/credit-sales-officer-management" component={CreditSalesOfficerManagement} />
			<Route exact path="/product-edit" component={ProductEdit} />

			<Route exact path="/new-product" component={ProductAdd} />
			<Route exact path="/product-management" component={ProductList} />
			{/* <Route exact path="/product-view" component={ProductView} /> */}
			<Route exact path="/usage-crms" component={UsageCrMS} />

			<Route exact path="/new-product-variant" component={ProductVariantAdd} />

			<Route exact path="/new-stock-in" component={StockInDetails} />
			<Route exact path="/stock-in-details" component={StockInDetails} />
			<Route exact path="/stock-in-management" component={StockInManagement} />
			<Route exact path="/view-stock-in" component={ViewStockIn} />

			<Route exact path="/new-stock-out" component={StockOutDetails} />
			<Route exact path="/stock-out-details" component={StockOutDetails} />
			<Route
				exact
				path="/stock-out-management"
				component={StockOutManagement}
			/>
			<Route exact path="/view-stock-out" component={ViewStockOut} />

			<Route
				exact
				path="/stock-management"
				component={StockManagementSummary}
			/>
			<Route
				exact
				path="/stock-management-history"
				component={StockManagementHistory}
			/>
			<Route
				exact
				path="/stock-management-details"
				component={StockManagementDetails}
			/>

			<Route
				exact
				path="/product-category-details"
				component={ProductCategoryDetails}
			/>
			<Route
				exact
				path="/product-category-management"
				component={ProductCategoryManagement}
			/>

			<Route
				exact
				path="/view-product-category"
				component={ViewProductCategories}
			/>

			<Route
				exact
				path="/measurement-unit-category-details"
				component={MeasureUnitCategoryDetails}
			/>
			<Route
				exact
				path="/measurement-unit-category-management"
				component={MeasureUnitCategoryManagement}
			/>

			<Route
				exact
				path="/measurement-unit-details"
				component={MeasureUnitDetails}
			/>
			<Route
				exact
				path="/measurement-unit-management"
				component={MeasureUnitManagement}
			/>
			<Route
				exact
				path="/view-measurement-unit"
				component={ViewMeasurementUnits}
			/>

			{/*
      <Route
        exact
        path="/attribute-management"
        component={AttributeManagement}
      />
	  */}

			<Route exact path="/attribute-management" component={AttributeDetails} />

			<Route exact path="/attribute-details" component={AttributeDetails} />
			<Route
				exact
				path="/inventory-full-management"
				component={InventoryManagement}
			/>

			<Route exact path="/attribute-details" component={AttributeDetails} />

			<Route
				exact
				path="/attribute-value-management"
				component={AttributeValueManagement}
			/>
			<Route
				exact
				path="/attribute-value-details"
				component={AttributeValueDetails}
			/>
			<Route
				exact
				path="/view-attribute-values"
				component={ViewAttributeValues}
			/>

			<Route
				exact
				path="/product-variant-details"
				component={ProductVariantDetails}
			/>
			<Route
				exact
				path="/edit-product-variant"
				component={EditProductVariant}
			/>
			<Route exact path="/privacy-policy" component={PrivacyPolicy} />
			<Route component={NotFound} />
		</Switch>
	</Router>
)
	;
ReactDOM.render(routing, document.getElementById("root"));
