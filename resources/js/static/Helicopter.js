// A helicopter object contains all of the information about current location, contact info, last update, logo, etc.
// This object uses Dojo and depends on the ArcGIS API for its map-rendering functions.
// (The 'define' function is defined by Dojo)
define(["dojo/_base/declare",
    "esri/Color",
    "esri/SpatialReference",
    "esri/geometry/Point",
    "esri/geometry/Circle",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/graphic",
    "esri/units",

  ],
  function (declare) {
    return declare(null, {
      constructor: function (params) {
        this.params = params || {};

        this.resourceType = this.params.statusable_resource_type;
        this.iso_date = this.params.updated_at.replace(/-/g, "/") + " GMT"; // Convert date string from YYYY-mm-dd HH:mm:ss to YYYY/mm/dd HH:mm:ss

        this.latitude = this.params.latitude;
        this.longitude = this.params.longitude;

        this.freshTime = 18 * 60 * 60 * 1000;	// Milliseconds until this helicopter's position info is considered stale

        switch(this.resourceType) {
          case 'Type1Helicopter':
            this.iconSize = 45;
            break;
          case 'HelitackHelicopter':
            this.iconSize = 45;
            break;
          default:
            this.iconSize = 75;
            break;
        }
        this.iconPath = '/images/symbols/';	// The folder that contains all of the map-symbol image files
        this.baseFilenames = {
          'ShortHaulHelicopter': 'shorthaulhelicopter',
          'RappelHelicopter': 'rappelhelicopter',
          'SmokejumperAirplane': 'smokejumperairplane',
          'HotshotCrew': 'hotshotcrew',
          'HelitackHelicopter' : 'helitackhelicopter',
          'Type1Helicopter' : 'type1helicopter',
        };

        this.responseRingRadius = this.params.Distance || 100;	// NAUTICAL MILES (Default 100)
      },

      isFresh: function () {
        // Returns TRUE | FALSE
        //
        // If the database entry for this helicopter's location has been updated within the past 18hr, return TRUE.
        var age = Date.now() - Date.parse(this.iso_date);
        return (age < this.freshTime);
      },

      showResponseRing: function () {
        // Return TRUE or FALSE, depending on whether a ring should be drawn around this feature on the map to denote its response radius.
        return (this.resourceType === "App\\Domain\\StatusableResources\\ShortHaulHelicopter");
      },

      mapPoint: function () {
        // Returns an ArcGIS POINT object (requires "esri/geometry/Point" module).
        // wkid: 4326 (GCS_WGS_1984) - geographic coordinate system (lat/lon)
        var spatialReference = new esri.SpatialReference({wkid: 4326});
        return new esri.geometry.Point(Number(this.longitude), Number(this.latitude), spatialReference);
      },

      mapMarker: function () {
        // Returns an ArcGIS PICTUREMARKERSYMBOL object (requires "esri/symbols/PictureMarkerSymbol" module).
        const filename = this.getIconFilename();
        // console.log(filename);

        try {
          return new esri.symbol.PictureMarkerSymbol(
            filename,
            this.iconSize,
            this.iconSize);

        } catch (e) {
          console.error("Error: " + e);
        }
      },

      getAttributes: function () {
        var prefix = "";
        if (this.params.statusable_resource_type.indexOf("helicopter") >= 0) prefix = "Helicopter ";

        return {
          popuptitle: prefix + this.params.statusable_resource_name,
          popupcontent: this.params.popup_content,
          updated_at: this.iso_date,
        };
      },

      getIconFilename: function () {
        return this.iconPath + this.baseFilenames[this.params.statusable_resource_type] + '-' + (this.isFresh() ? 'fresh' : 'stale') + '.png';
      },

      mapGraphic: function () {
        // Returns an ArcGIS GRAPHIC object (requires "esri/graphic" module) that can be placed onto a GraphicsLayer.
        // The GRAPHIC object combines an ArcGIS POINT with a PICTUREMARKERSYMBOL to produce an image with a location.
        // The 3rd parameter sets the content that is used to construct a popup when this Graphic is clicked on the map.
        //
        // Example:
        // 	var myHelicopter = new Helicopter;
        // 	var gl = new GraphicsLayer();
        //	gl.add(myHelicopter.mapGraphic);

        return new esri.Graphic(this.mapPoint(), this.mapMarker(), this.getAttributes());
      },

      mapLabelSymbol: function () {
        // Returns an ArcGIS TextSymbol
        try {
          const colorValue = this.isFresh() ? "#000000" : "#888888";
          return new esri.symbol.TextSymbol(
            {
              type: "text",  // autocasts as new TextSymbol()
              text: this.params.statusable_resource_name,
              color: new esri.Color(colorValue),
              xoffset: 14,
              yoffset: 18,
              font: {  // autocast as new Font()
                size: 10,
                family: "sans-serif",
                weight: "bolder",
              }
            }
          );
        } catch (e) {
          console.error("Error: " + e);
        }
      },

      mapLabel: function () {
        return new esri.Graphic(this.mapPoint(), this.mapLabelSymbol());
      },

      mapResponseRingGraphic: function () {
        // Returns an ArcGIS GRAPHIC object that can be placed onto a GraphicsLayer.

        var that = this;  // Make the current scope available to anonymous functions

        // Choose a color for the Response Ring based on whether the helicopter location data is FRESH or STALE
        var ringColor = (function () {
          if (that.isFresh()) {
            return new esri.Color([100, 200, 100]); // Color for a FRESH ring
          } else {
            return new esri.Color([150, 150, 150]); // Color for a STALE ring
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
          null // Fill-color for interior of the circle
        );

        var responseRingParams = {
          radius: this.responseRingRadius,
          radiusUnit: esri.Units.NAUTICAL_MILES,
          numberOfPoints: 120,
          geodesic: true,
        };

        var c = new esri.geometry.Circle(this.mapPoint(), responseRingParams);

        return new esri.Graphic(c, responseRingSymbol);
      },


    }); // End return declare()
  } // End function(declare)
); // End define()
