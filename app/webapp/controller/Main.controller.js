sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/Text"
], function(Controller, MessageBox, Text) {
  "use strict";

  return Controller.extend("yt_joule.controller.Main", {
    onInit: function() {
      const oModel = this.getOwnerComponent().getModel();
      this.getView().setModel(oModel);      
      
      if (!oModel) {
        MessageBox.error("no Omodel found")
        
      }
      
      const oChatModel = new sap.ui.model.json.JSONModel({
        chatInputValue: "",
        messages: []
      });
      this.getView().setModel(oChatModel, "chat");
      console.log("Model data:", this.getView().getModel());
    },
    onChartPress: function() {    
    try {
        var oRouter = this.getOwnerComponent().getRouter();        
        if (!oRouter) {
            MessageBox.error("Navigation error: Router not found");
            return;
        }
        oRouter.navTo("Charts");        
    } catch (error) {
        MessageBox.error("Navigation failed: " + error.message);
    }
},

getRouter: function() {
    var oRouter = this.getOwnerComponent().getRouter();
    return oRouter;
},
onProductPress: function(oEvent) {    
    let oContext = oEvent.getSource().getBindingContext();
    console.log("ocontext", oContext);
    
    if (oContext) {
        let oFlightId = oContext.getProperty("ID");
        console.log("Flight ID:", oFlightId);
        
        if (oFlightId) {
            this.getRouter().navTo("Details", {
                FlightId: oFlightId  
            });
        }
    }
},
    
    onToggleChat: function() {
      const oPanel = this.byId("chatPanel");
      oPanel.setExpanded(!oPanel.getExpanded());
      
      const oButton = this.byId("chatBotButton");
      if (oPanel.getExpanded()) {
        oButton.setIcon("sap-icon://decline");
        oButton.setTooltip("Close chat assistant");
      } else {
        oButton.setIcon("sap-icon://paper-plane");
        oButton.setTooltip("Open chat assistant");
      }
    },
    
    onInputLiveChange: function(oEvent) {
      const sValue = oEvent.getSource().getValue();
      this.getView().getModel("chat").setProperty("/chatInputValue", sValue);
    },
    
    onSendMessage: function() {
      const oChatModel = this.getView().getModel("chat");
      const sMessage = oChatModel.getProperty("/chatInputValue");
      
      if (sMessage.trim() === "") return;
      
      this.addMessage(sMessage, "user");
      
      oChatModel.setProperty("/chatInputValue", "");
      
      this.callGeminiAPI(sMessage);
    },

    callGeminiAPI: function(userMessage) {
      const that = this;
      
      this.addMessage("Thinking...", "bot-loading");
      
      const mParameters = {
        message: userMessage,
        context: "flight assistant"
      };

      console.log('Calling CAP action with:', mParameters);

      jQuery.ajax({
        url: "/service/yT_Joule/callGeminiAI",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(mParameters),
        success: function(oData) {
          console.log('CAP service response:', oData);
          
          that.removeLoadingMessage();
          
          if (oData.success) {
            const aiResponse = oData.response || "I received your message but couldn't generate a proper response.";
            that.addMessage(aiResponse, "bot");
          } else {
            console.error('AI service error:', oData.error);
            that.addMessage(oData.error || "Sorry, there was an error processing your request.", "bot-error");
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Failed to call CAP action:', textStatus, errorThrown, jqXHR);
          that.removeLoadingMessage();
          
          let sErrorMessage = "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
          
          if (jqXHR.responseText) {
            try {
              const errorData = JSON.parse(jqXHR.responseText);
              if (errorData.error && errorData.error.message) {
                sErrorMessage = errorData.error.message;
              }
            } catch (e) {
              console.error('Error parsing error response:', e);
              sErrorMessage = `HTTP ${jqXHR.status}: ${textStatus}`;
            }
          }
          
          that.addMessage(sErrorMessage, "bot-error");
        }
      });
    },

    addMessage: function(sText, sType) {
      const oContainer = this.byId("messageContainer");
      const oMessage = new sap.m.Text({
        text: sText
      });
      
      const sClass = this.getMessageClass(sType);
      oMessage.addStyleClass(sClass);
      
      if (sType === "bot-loading") {
        oMessage.addStyleClass("loading-message");
      }
      
      oContainer.addContent(oMessage);
      
      setTimeout(function() {
        const oScrollContainer = oContainer.getDomRef();
        if (oScrollContainer) {
          oScrollContainer.scrollTop = oScrollContainer.scrollHeight;
        }
      }, 100);
    },

    removeLoadingMessage: function() {
      const oContainer = this.byId("messageContainer");
      const aContent = oContainer.getContent();
      
      for (let i = aContent.length - 1; i >= 0; i--) {
        const oItem = aContent[i];
        if (oItem.hasStyleClass && oItem.hasStyleClass("loading-message")) {
          oContainer.removeContent(oItem);
          oItem.destroy(); 
        }
      }
    },

    getMessageClass: function(sType) {
      switch (sType) {
        case "user":
          return "userMessage";
        case "bot":
          return "botMessage";
        case "bot-loading":
          return "botMessage loadingMessage";
        case "bot-error":
          return "botMessage errorMessage";
        default:
          return "botMessage";
      }
    },

    simulateBotResponse: function() {
      const aResponses = [
        "I'm a flight assistant chatbot. How can I help you with your flight today?",
        "I understand you're looking for flight information. What specifically would you like to know?",
        "I can help you find information about flights, schedules, and statuses.",
        "For real flight assistance, this would connect to a backend service."
      ];
      
      const sResponse = aResponses[Math.floor(Math.random() * aResponses.length)];
      this.addMessage(sResponse, "bot");
    }

  });
});