sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function(Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend("yt_joule.controller.Details", {

    onInit: function() {
      const oModel = this.getOwnerComponent().getModel();
      this.getView().setModel(oModel);      
      this.oRouter = this.getOwnerComponent().getRouter();
      this.oRouter.getRoute("Details").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function(oEvent) {
      var sFlightId = oEvent.getParameter("arguments").FlightId;
      
      var sPath = "/Flights(ID=" + sFlightId + ",IsActiveEntity=true)";
      
      this.getView().bindElement({
        path: sPath,
        events: {
          dataReceived: function(oData) {
            console.log("Full Flight Data:", oData.getParameter());
          },
          dataRequested: function() {
            console.log("Data requested for path:", sPath);
          },
          change: function(oEvent) {
            var oBinding = oEvent.getSource();
            if (oBinding.getBoundContext()) {
              console.log("Binding successful");
            }
          }
        }
      });
    },

    onNavBack: function() {
      var oHistory = sap.ui.core.routing.History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();

      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.oRouter.navTo("Main", true);
      }
    },

    onEdit: function(oEvent) {
      var oForm = this.getView().byId("detailForm");
      if (!oForm) {
        MessageToast.show("Form not found");
        return;
      }

      var oBindingContext = this.getView().getBindingContext();
      if (!oBindingContext) {
        MessageToast.show("No data loaded");
        return;
      }

      oForm.setEditable(true);
      
      var oSaveButton = this.getView().byId("saveButton");
      var oEditButton = oEvent ? oEvent.getSource() : this.getView().byId("editButton");
      
      if (oSaveButton) {
        oSaveButton.setVisible(true);
      }
      if (oEditButton) {
        oEditButton.setVisible(false);
      }
      
      MessageToast.show("Edit mode enabled");
    },

    onSave: function() {
      var oModel = this.getView().getModel();
      var that = this;
      
      if (oModel.hasPendingChanges()) {
        sap.ui.core.BusyIndicator.show();
        
        oModel.submitChanges({
          success: function() {
            sap.ui.core.BusyIndicator.hide();
            
            var oForm = that.getView().byId("detailForm");
            if (oForm) {
              oForm.setEditable(false);
            }
            
            var oSaveButton = that.getView().byId("saveButton");
            var oEditButton = that.getView().byId("editButton");
            
            if (oSaveButton) {
              oSaveButton.setVisible(false);
            }
            if (oEditButton) {
              oEditButton.setVisible(true);
            }
            
            MessageToast.show("Flight saved successfully");
          },
          error: function(oError) {
            sap.ui.core.BusyIndicator.hide();
            console.error("Save error:", oError);
            var sErrorMessage = oError.message || "Unknown error occurred";
            MessageToast.show("Error saving flight: " + sErrorMessage);
          }
        });
      } else {
        MessageToast.show("No changes to save");
      }
    },

    onDelete: function() {
      var that = this;
      var oBindingContext = this.getView().getBindingContext();
      
      if (!oBindingContext) {
        MessageToast.show("No data to delete");
        return;
      }
      
      MessageBox.confirm(
        "Are you sure you want to delete this flight?", {
          title: "Confirm Deletion",
          onClose: function(oAction) {
            if (oAction === MessageBox.Action.OK) {
              that._deleteFlightData();
            }
          }
        }
      );
    },

    _deleteFlightData: function() {
      var oModel = this.getView().getModel();
      var oBindingContext = this.getView().getBindingContext();
      var that = this;

      if (!oBindingContext) {
        MessageToast.show("No data to delete");
        return;
      }

      var sPath = oBindingContext.getPath();
      sap.ui.core.BusyIndicator.show();

      oModel.remove(sPath, {
        success: function() {
          sap.ui.core.BusyIndicator.hide();
          MessageToast.show("Flight deleted successfully");
          that.onNavBack();
        },
        error: function(oError) {
          sap.ui.core.BusyIndicator.hide();
          console.error("Delete error:", oError);
          var sErrorMessage = oError.message || "Unknown error occurred";
          MessageToast.show("Error deleting flight: " + sErrorMessage);
        }
      });
    },

    formatStatusState: function(sStatus) {
      switch (sStatus) {
        case "Scheduled":
        case "Boarding":
          return "Information";
        case "Departed":
        case "Arrived":
          return "Success";
        case "Delayed":
          return "Warning";
        case "Cancelled":
          return "Error";
        default:
          return "None";
      }
    },

    onAddPassenger: function() {
      var oBindingContext = this.getView().getBindingContext();
      if (!oBindingContext) {
        MessageToast.show("Please load flight data first");
        return;
      }
      
      MessageToast.show("Add passenger functionality to be implemented");
    },

    onRefresh: function() {
      var oModel = this.getView().getModel();
      var oBindingContext = this.getView().getBindingContext();
      
      if (oBindingContext) {
        oBindingContext.refresh();
      } else {
        oModel.refresh();
      }
      
      MessageToast.show("Data refreshed");
    },

    _handleNavigationError: function(sFlightId) {
      MessageToast.show(`Flight not found: ${sFlightId}`);
      this.onNavBack();
    },
    _handleNavigationError: function(sFlightId) {
      MessageToast.show("Flight not found: " + sFlightId);
      this.onNavBack();
    },

    _logAvailableProperties: function(oContext) {
      try {
        var oObject = oContext.getObject();
        if (oObject) {
          console.log("Available properties:", Object.keys(oObject));
          
          var oModel = oContext.getModel();
          var sEntityType = oContext.getPath().split('(')[0].substring(1);
          console.log("Entity type:", sEntityType);
          
          var oMetaModel = oModel.getMetaModel();
          oMetaModel.requestObject("/$EntityContainer/" + sEntityType).then(function(oEntitySet) {
            if (oEntitySet) {
              console.log("Entity set metadata:", oEntitySet);
            }
          }).catch(function(oError) {
            console.log("Could not retrieve metadata:", oError);
          });
        }
      } catch (oError) {
        console.log("Error logging properties:", oError);
      }
    }

  });
});