sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageToast"
], function (ControllerExtension, MessageToast) {
    "use strict";

    return ControllerExtension.extend("com.financemis.financemis.ext.controller.ListReportExt", {
        // Handle framework lifecycle hooks if necessary
        override: {
            onInit: function() {
                // Extension initialization logic
            }
        },

        // This is the direct action handler mapped from your manifest
        exportCSV: function (oEvent) {
            console.log("Export CSV Action Triggered Successfully");
            
            // 1. Properly target the base view via the extension API
            var oView = this.base.getView();
            var oSmartTable = null;

            // 2. Locate the SmartTable by structural type since Fiori generates dynamic prefix IDs
            var aElements = oView.findElements(true, function(oElement) {
                return oElement.isA("sap.ui.comp.smarttable.SmartTable");
            });

            if (aElements && aElements.length > 0) {
                oSmartTable = aElements[0];
            }

            if (!oSmartTable) {
                MessageToast.show("Error: SmartTable could not be located on the UI.");
                return;
            }

            // 3. Extract model settings and URLs
            var oModel = oSmartTable.getModel();
            var sServiceUrl = oModel.sServiceUrl; 
            var sEntitySet = oSmartTable.getEntitySet() || "ZC_SALES_DETAILSSet"; 
            
            // 4. Retrieve current active filters applied by the user in the SmartFilterBar
            var sFilterParams = "";
            var oTable = oSmartTable.getTable();
            var oBinding = oTable.getBinding("items") || oTable.getBinding("rows");

            if (oBinding && oBinding.sFilterParams) {
                sFilterParams = oBinding.sFilterParams;
            } else if (oSmartTable.getSmartFilterId()) {
                // Fallback: If table is not loaded yet, grab filters directly from the filter bar control
                var oSmartFilter = oView.byId(oSmartTable.getSmartFilterId());
                if (oSmartFilter) {
                    var oUi5Filters = oSmartFilter.getFilters();
                    // Fallback configuration if parameters are empty
                }
            }

            // 5. Clean up structural URL formatting
            if (sServiceUrl.endsWith("/")) {
                sServiceUrl = sServiceUrl.slice(0, -1);
            }

            // Construct streaming endpoint 
            var sDownloadUrl = sServiceUrl + "/" + sEntitySet + "?" + sFilterParams + "&$format=csv";
            
            // Standard OData v2 systems skip layout pagination top/skip counts when downloading formats directly
            if (!sDownloadUrl.includes("$batch")) {
                MessageToast.show("Exporting raw dataset... Please wait.");
                window.open(sDownloadUrl, "_blank");
            } else {
                MessageToast.show("Unable to parse background batch queries directly.");
            }
        }
    });
});