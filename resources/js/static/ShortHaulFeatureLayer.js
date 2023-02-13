// Return an ESRI FeatureLayer object using the provided Feature Service URL
// This Class contains the rendering symbology and Popup content specific to Short Haul Helicopters.

define([	"dojo/_base/declare",
			"assets/js/Helicopter",
			"esri/dijit/Popup", "esri/dijit/PopupMobile", "esri/dijit/PopupTemplate",
			"esri/dijit/Legend",
            "dojo/dom-construct",
            "esri/symbols/TextSymbol",
            "esri/layers/FeatureLayer",
            "esri/layers/FeatureTemplate",
            "esri/layers/LabelClass",
            "esri/renderers/UniqueValueRenderer",
			"esri/Color",
            "esri/geometry/Point",
            "esri/geometry/Circle",
            "esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/graphic",
            "esri/units",
            
		],
	function(declare, Helicopter) {
    	return declare(Helicopter, {
    		constructor: function(serviceUrl) {
    		
    			this.settings = {
					freshness: {
						hoursUntilStale: 	18,
						daysUntilExpired: 	21
					},

					icons: {
						shortHaulHelicopter: {
							fresh: 	"/assets/images/heli-icon-active.png",
							stale: 	"/assets/images/heli-icon-inactive.png",
							expired:"/assets/images/heli-icon-inactive.png",
							size: 75 // pixels
						}
					}
				};

				this.serviceUrl = serviceUrl;
        		this.setPopupTemplate();
        		this.setLabelClass();
        		this.setRenderer();
        		this.createLayer();
		    },

			setPopupTemplate: function() {
				// 
			    this.popupTemplate = new esri.dijit.PopupTemplate({
			        title: "{CREW_NAME}",
			        fieldInfos: [{
			            fieldName: "created_at",
			            visible: true,
			            format: {
			                dateFormat: 'shortDateShortTime24'
			            }
			        }]
			    });

			    this.popupTemplate.setContent("<table class=\"popup-table\"><tr>"
			                                    +"<td aria-label=\"Helicopter Info\" title=\"Current manager & aircraft info\">"
			                                        +"<div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-plane\"></span> HMGB</div>"
			                                        +"${manager_name}<br />"
			                                        +"${manager_phone}<br >"
			                                        +"${statusable_name}</td>"

			                                    +"<td aria-label=\"Current Staffing\" title=\"Current staffing levels\">"
			                                        +"<div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-user\"></span> Staffing</div>"
			                                        +"  <table class=\"staffing_table\"><tr><td>EMT:</td><td>${staffing_value1}</td></tr>"
			                                        +"  <tr><td>HAUL:</td><td>${staffing_value2}</td></tr></table>"
			                                        +"</td>"

			                                    +"<td aria-label=\"Current Assignment\" title=\"Current assignment & supervisor\">"
			                                        +"<div class=\"popup-col-header\"><span class=\"glyphicon glyphicon-map-marker\"></span> Assigned</div>"
			                                        +"${assigned_fire_name}<br />"
			                                        +"${assigned_fire_number}<br />"
			                                        +"${assigned_supervisor}<br />"
			                                        +"${assigned_supervisor_phone}</td>"
			                                +"</tr>"
			                                +"<tr><td class=\"timestamp-cell\" colspan=\"4\">${created_at}</td></tr></table>");
				return;
			},

			setRenderer: function() {
				var size = this.settings.icons.shortHaulHelicopter.size;
				var freshSymbol 	= new esri.symbol.PictureMarkerSymbol(this.settings.icons.shortHaulHelicopter.fresh,size,size);
			    var staleSymbol 	= new esri.symbol.PictureMarkerSymbol(this.settings.icons.shortHaulHelicopter.stale,size,size);
			    var expiredSymbol 	= new esri.symbol.PictureMarkerSymbol(this.settings.icons.shortHaulHelicopter.expired,size,size);

			    // The following text values will appear on the Legend along with the symbology
			    var freshText = "Fresh (within "+this.settings.freshness.hoursUntilStale+" hours)";
			    var staleText = "Stale";

			    var that = this;
				this.renderer = new esri.renderer.UniqueValueRenderer(null, function(feature) {
			        // Determine the age of this status update so that a different symbol can be used for stale data
			        // This function will return "fresh", "stale", or "expired" for each Feature on the Layer
			        // Then, the renderer.addValue() method will be used to assign a symbol to each Feature based on its 'freshness'
			        var freshness = that.checkFreshness(feature.attributes.created_at);
			        if(freshness == "fresh") {
			        	return freshText;
			        } else {
			        	// This will both 'stale' and 'expired' data - but 'expired' data should be removed from the dataset before this point
			        	return staleText;
			        }
			    });

			    this.renderer.addValue(freshText,freshSymbol);
			    this.renderer.addValue(staleText,staleSymbol);
			    // this.renderer.addValue("expired",expiredSymbol); // Expired data should not be loaded at all, and does not need a symbol

			    return;
			},

			checkFreshness: function(timestamp) {
				// Check the given timestamp against the current time to determine age.
				// Then return an adjective to categorize this age based on the settings in this.settings.freshness
				// Return "fresh", "stale", or "expired"
				var freshness;
				var statusTimestamp = new Date(timestamp);
		        var currentTimestamp= new Date();
		        var hoursAgo = (currentTimestamp - statusTimestamp) / 1000 / 3600; // Convert milliseconds to hours

				if(hoursAgo < this.settings.freshness.hoursUntilStale) freshness = "fresh";
				else if(	(hoursAgo >= this.settings.freshness.hoursUntilStale) && 
							(hoursAgo / 24 < this.settings.freshness.daysUntilExpired)) freshness = "stale";
				else freshness = "expired"; // Expired data should be removed from the dataset

				return freshness;
			},

			createLayer: function() {
				this.featureLayer = new esri.layers.FeatureLayer(this.serviceUrl, {
	                            	                    id: "ShortHaulHelicopters",
	                                                    outFields: ["*"],
	                                                    showLabels: true,
	                                                    infoTemplate: this.popupTemplate,
	                                                    renderer: this.renderer
	                                                });
				this.featureLayer.setLabelingInfo([this.labelClass]);
				this.featureLayer.setRenderer(this.renderer);
			},

			setLabelClass: function() {
			    // Build a symbol to use for labeling each helicopter (font settings)
			    var resourceLabelSymbol = new esri.symbol.TextSymbol().setColor(new esri.Color("#555"));
			        resourceLabelSymbol.font.setSize("14pt");
			        resourceLabelSymbol.font.setFamily("arial");

			    // Define the content of each feature label (which dB field to use, etc)
			    var resourceLabelContent = {
			      "labelExpressionInfo" : {"value": "{statusable_name}"},
			      "labelPlacement"		: "above-center" //"below-center" "center-center"
			    };

			    // Apply the font settings to the label content
			    var resourceLabel = new esri.layers.LabelClass(resourceLabelContent);
			    resourceLabel.symbol = resourceLabelSymbol;

			    this.labelClass = resourceLabel;
			    return;
			},

			// legend


	    }); // End return declare()
	} // End function(declare)
); // End define()



