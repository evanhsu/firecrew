// A FireResource object contains all of the information about current location, contact info, last update, logo, etc.
// This object uses Dojo and depends on the ArcGIS API for its map-rendering functions.
// (The 'define' function is defined by Dojo)

define([	"dojo/_base/declare",
			"esri/Color",
            "esri/geometry/Point",
            "esri/geometry/Circle",
            "esri/symbols/PictureMarkerSymbol",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/graphic",
            "esri/units"
		],
	function(declare) {
    	return declare(null, {
    		constructor: function(params) {
        		this.params = params || {};

        		this.tailnumber	= this.params.tailnumber;
		        this.latitude 	= this.params.latitude; // Format: decimal degrees, North-positive
		        this.longitude 	= this.params.longitude;// Format: decimal degrees, East-positive

		        this.staffing_emts		= this.params.staffing_emts;
		        this.staffing_shorthaul	= this.params.staffing_shorthaul;

				this.freshTime			= 24 * 60 * 60;	// Seconds until this helicopter's position info is considered stale
				this.fresh = true;
				
				this.activeIconPath		= '/assets/images/heli-icon-active.png';
				this.inactiveIconPath	= '/assets/images/heli-icon-inactive.png';
				this.iconSize = 75;		// Pixel dimensions of the helicopter icon on the map

				this.responseRingVisible = true;	// Display a circle on the map to represent this helicopter's response range
				this.responseRingRadius  = 100;		// NAUTICAL MILES  -  Default: 100

		    },

			isFresh: function() {
				// Returns TRUE | FALSE
				// 
				// If the database entry for this helicopter's location has been updated within the past 24hr, return TRUE.

				// if(time.now - position.updated_at < this.freshtime) return true;       else false;
				return this.fresh;
			},

			mapPoint: function() {
				// Returns an ArcGIS POINT object (requires "esri/geometry/Point" module).
				return new esri.geometry.Point(Number(this.longitude),Number(this.latitude));
			},

			mapMarker: function() {
				// Returns an ArcGIS PICTUREMARKERSYMBOL object (requires "esri/symbols/PictureMarkerSymbol" module).

				try {
					var that = this;
					return new esri.symbol.PictureMarkerSymbol(
						(function() {
							if(that.isFresh()) {
								return that.activeIconPath;
							} else {
								return that.inactiveIconPath;
							}
						})(),
						this.iconSize,
						this.iconSize);

				} catch(e) {
					console.error("Error: " + e);
				}
			},

			mapGraphic: function() {
				// Returns an ArcGIS GRAPHIC object (requires "esri/graphic" module) that can be placed onto a GraphicsLayer.
				// The GRAPHIC object combines an ArcGIS POINT with a PICTUREMARKERSYMBOL to produce an image with a location.
				// 
				// 
				// Example:
				// 	var myHelicopter = new Helicopter;
				// 	var gl = new GraphicsLayer();
				//	gl.add(myHelicopter.mapGraphic);

				return new esri.Graphic(this.mapPoint(),this.mapMarker());
			},

			mapResponseRingGraphic: function() {
				// Returns an ArcGIS GRAPHIC object that can be placed onto a GraphicsLayer.

				var that = this;  // Make the current scope available to anonymous functions

			    // Choose a color for the Response Ring based on whether the helicopter location data is FRESH or STALE
			    var ringColor = (function() {
			    					if(that.isFresh()) {
			    						return new esri.Color([100,200,100]); // Color for a FRESH ring
			    					} else {
			    						return new esri.Color([150,150,150]); // Color for a STALE ring
			    					}
			    				})();

			    var responseRingSymbol = new esri.symbol.SimpleFillSymbol(
			    										// Fill-style
			                                            esri.symbol.SimpleFillSymbol.STYLE_NULL,
			                                            // Outline-style
			                                            new esri.symbol.SimpleLineSymbol(
			                                            			esri.symbol.SimpleLineSymbol.STYLE_SHORTDOT,
			                                                        ringColor, 
			                                                        3),
			                                            // Fill-color for interior of the circle
			                                            null
			                                        );

			    var responseRingParams = {	radius: this.responseRingRadius,
			                                radiusUnit: esri.Units.NAUTICAL_MILES,
			                                numberOfPoints: 120,
			                                geodesic: true };

			    var c = new esri.geometry.Circle(this.mapPoint(), responseRingParams);

			    return new esri.Graphic(c, responseRingSymbol);
			}


	    }); // End return declare()
	} // End function(declare)
); // End define()
