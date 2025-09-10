sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("yt_joule.controller.Charts", {
        
        onInit: function() {
            const oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel);
            
            if (!oModel) {
                MessageBox.error("No Model Found");
                return;
            }
            
            console.log("Charts view initialized with model:", oModel);
            this._loadChartData();
            this._updateDashboardMetrics();
        },
        
        _loadChartData: function() {
            const oModel = this.getView().getModel();
            const oBinding = oModel.bindList("/Flights");
            
            oBinding.requestContexts().then(function(aContexts) {
                console.log("Flight data for charts:", aContexts.map(ctx => ctx.getObject()));
            }).catch(function(error) {
                console.error("Error loading flight data:", error);
                MessageToast.show("Unable to load flight data");
            });
        },
        
        _updateDashboardMetrics: function() {
            MessageToast.show("Dashboard metrics updated");
        },

        filterGlobally: function(oEvent) {
            const sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            const oTable = this.byId("table");
            const oBinding = oTable.getBinding("items");
            
            if (!oBinding) {
                return;
            }
            
            let aFilters = [];
            
            if (sQuery.trim()) {
                const aFieldFilters = [
                    new Filter("flightNumber", FilterOperator.Contains, sQuery),
                    new Filter("departure", FilterOperator.Contains, sQuery),
                    new Filter("arrival", FilterOperator.Contains, sQuery)
                ];
                
                const oCombinedFilter = new Filter({
                    filters: aFieldFilters,
                    and: false
                });
                
                aFilters.push(oCombinedFilter);
            }
            
            oBinding.filter(aFilters);
        },
        
        onSelectionChanged: function(oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedBars") || 
                                 oEvent.getParameter("selectedPoints") || 
                                 oEvent.getParameter("selectedSegments");
            
            console.log("Chart selection changed:", oSelectedItem);
            
            if (oSelectedItem && oSelectedItem.length > 0) {
                const sMessage = "Selected: " + oSelectedItem.length + " item(s)";
                MessageToast.show(sMessage);
            }
        },
        
        onChartPress: function(oEvent) {
            console.log("Chart pressed:", oEvent);
            const oSource = oEvent.getSource();
            MessageToast.show("Chart interaction: " + oSource.getMetadata().getName());
        },
        
        onRefreshData: function() {
            MessageToast.show("Refreshing flight data...");
            this._loadChartData();
            this._updateDashboardMetrics();
        },
        
        onExportReport: function() {
            MessageBox.confirm("Export comprehensive flight analytics report?", {
                title: "Export Report",
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        MessageToast.show("Report export initiated...");
                        setTimeout(function() {
                            MessageToast.show("Report exported successfully!");
                        }, 2000);
                    }
                }
            });
        },
        
        onSettings: function() {
            MessageBox.information(
                "Dashboard Settings:\n\n" +
                "• Auto-refresh: Every 5 minutes\n" +
                "• Data retention: 90 days\n" +
                "• Chart animations: Enabled\n" +
                "• Real-time updates: Active", {
                title: "Dashboard Configuration"
            });
        },
        
        onAttributePress: function(oEvent) {
            const sTitle = oEvent.getSource().getTitle();
            MessageToast.show("Drilling down into: " + sTitle);
        },
        
        onRoutePress: function() {
            MessageBox.information(
                "NYC → LAX Route Details:\n\n" +
                "• Daily flights: 4\n" +
                "• Average price: $485\n" +
                "• Load factor: 92%\n" +
                "• On-time performance: 96%"
            );
        },
        
        onFilterChart: function() {
            MessageBox.information("Chart filtering options:\n\n• By airline\n• By route\n• By time period\n• By price range");
        },
        
        onDrillDown: function() {
            MessageToast.show("Drilling down to detailed flight data...");
        },
        
        onNavBack: function() {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Main", true);
            }
        },
        
        formatStatusState: function(sStatus) {
            switch (sStatus) {
                case "On Time":
                    return "Success";
                case "Delayed":
                    return "Warning";
                case "Cancelled":
                    return "Error";
                default:
                    return "None";
            }
        },
        
        formatPerformanceColor: function(iValue) {
            if (iValue >= 90) return "Good";
            if (iValue >= 75) return "Critical";
            return "Error";
        }
    });
});