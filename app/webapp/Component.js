sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "./model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("yt_joule.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);

            this.setModel(models.createDeviceModel(), "device");

            var oRouter = this.getRouter();
            if (oRouter) {
                oRouter.initialize();
            }
        },

        getContentDensityClass: function () {
            if (this.contentDensityClass === undefined) {
                if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
                    this.contentDensityClass = "";
                } else if (!Device.support.touch) {
                    this.contentDensityClass = "sapUiSizeCompact";
                } else {
                    this.contentDensityClass = "sapUiSizeCozy";
                }
            }
            return this.contentDensityClass;
        }
    });
});