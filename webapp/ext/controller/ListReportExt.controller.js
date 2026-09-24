sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        onDownloadCSV: function () {

            var sUrl =
                "/sap/opu/odata/sap/ZC_SALES_DETAILS_CDS/" +
                "ZC_SALES_DETAILS(" +
                "p_bukrs='1000'," +
                "p_from=datetime'2024-04-01T00:00:00'," +
                "p_to=datetime'2024-04-01T00:00:00'," +
                "p_hkont='3100000000'" +
                ")/Set?$format=json";

            window.open(sUrl, "_blank");
        }
    };
});