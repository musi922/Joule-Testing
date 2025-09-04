sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("yt_joule.controller.Detail", {

    onInit: function() {
      this.oRouter = this.getOwnerComponent().getRouter();
      this.oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function(oEvent) {
      var sFlightId = oEvent.getParameter("arguments").flightId;
      var sPath = "/Flights(" + sFlightId + ")";
      this.getView().bindElement(sPath);
    },

    onNavBack: function() {
      this.oRouter.navTo("Main");
    },

    onEdit: function() {
      this.getView().byId("detailForm").setEditable(true);
      MessageToast.show("Edit mode enabled");
    },

    onSave: function() {
      var oModel = this.getView().getModel();
      oModel.submitChanges({
        success: function() {
          MessageToast.show("Flight saved successfully");
        },
        error: function() {
          MessageToast.show("Error saving flight");
        }
      });
    },

    onDelete: function() {
      var oModel = this.getView().getModel();
      var sPath = this.getView().getBindingContext().getPath();

      oModel.remove(sPath, {
        success: function() {
          MessageToast.show("Flight deleted successfully");
        },
        error: function() {
          MessageToast.show("Error deleting flight");
        }
      });
    }
  });
});
