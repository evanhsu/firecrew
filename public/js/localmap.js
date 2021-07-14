// This script gathers all of the map data and sends the
// rendered map to the requested DIV

// Configuration variables
var mapDiv = 'mapDiv';

// Send AJAX request to retrieve all active Fire Resources

// Create a jQuery Deferred to notify when the map has finished loading
var loadingMap = $.Deferred();
var loadingFeatures = $.Deferred();

// Retrieve all FireResources to plot on the map
// Track completion of the ajax request with the 'loadingFireResources' deferred
var fireResources;
var loadingFireResources = $.ajax({
  url: '/api/status/all',
  type: 'get',
  dataType: 'text',
}).done(function (o) {
  fireResources = JSON.parse(o);
}).fail(function (e) {
  // An error occurred
  console.error('Status Code: ' + e.status + ',  Text: ' + e.statusText);
});


// Assemble and render the entire map
var map;    // Accessible in the global scope
require([
  'esri/map',
  'esri/config', 'esri/urlUtils',
  'esri/dijit/Popup', 'esri/dijit/PopupMobile', 'esri/dijit/PopupTemplate',
  'esri/dijit/Legend', 'esri/dijit/LayerList',
  'esri/InfoTemplate',
  'dojo/dom-construct', 'dojo/dom-style',
  'esri/layers/GraphicsLayer',
  'js/Helicopter',
  'dojo/domReady!',
], function (Map,
             esriConfig, urlUtils,
             Popup, PopupMobile, PopupTemplate,
             Legend, LayerList,
             InfoTemplate,
             domConstruct, domStyle,
             GraphicsLayer,
             Helicopter) {

  // Subscribe to the Pusher broadcast channel for ResourceStatus updates
  window.Echo.channel('publicStatusUpdates').listen('ResourceStatusUpdated', function(event) {
    fireResources = mergeHelicopter(event.resourceStatus, fireResources);
    clearLayers();
    addHelicoptersToMap(fireResources);
  });

  // Define the default popup settings and size for every feature that is clicked on
  var popup = new Popup({
    fillSymbol: false,
    titleInBody: false,
  }, domConstruct.create('div'));
  popup.resize(450, 200);

  var infoTemplate = new InfoTemplate('${popuptitle}', '${popupcontent}');

  // Grab the basemap, set the initial map view, and load the map into the specified DOM element ("mapDiv")
  map = new Map(mapDiv, {
    center: [-113, 43],
    zoom: 6,
    basemap: 'topo',
    showLabels: true,
    infoWindow: popup,
  });

  map.on('load', function () {
    loadingMap.resolve(); // Resolve this deferred object (mark this task as complete and fire callbacks)
  });


  const gl1 = new GraphicsLayer({ id: 'Short Haul', infoTemplate: infoTemplate });
  const gl2 = new GraphicsLayer({ id: 'Response Range' });
  const gl3 = new GraphicsLayer({ id: 'Rappel', infoTemplate: infoTemplate });
  const gl4 = new GraphicsLayer({ id: 'Hotshots', infoTemplate: infoTemplate });
  const gl5 = new GraphicsLayer({ id: 'Smokejumpers', infoTemplate: infoTemplate });
  const gl6 = new GraphicsLayer({ id: 'Helitack', infoTemplate: infoTemplate });
  const gl7 = new GraphicsLayer({ id: 'Type 1 Heli', infoTemplate: infoTemplate });


  //Add each Feature point to the GraphicsLayer
  var p, heliGraphic, responseRingGraphic, c, heli;

  // Wait for the map to load AND the fireResource data to load, THEN draw icons on the map...
  $.when(loadingMap, loadingFireResources).then(
    function () {
      // Add our layers to the map
      // map.addLayer(gl1);
      // map.addLayer(gl2);
      map.addLayer(gl3);
      // map.addLayer(gl4);
      // map.addLayer(gl5);
      map.addLayer(gl6);
      map.addLayer(gl7);

      // Add the Legend to the map - this must be done AFTER all of the data layers have been added
      // so that it knows which symbols to describe.
      /*            var legend = new Legend({
                      map: map
                  }, "legendDiv");
                  legend.startup();
      */
      const layers = [
        // {
        //   layer: gl1,
        // },
        // {
        //   layer: gl2
        // },
        {
          layer: gl3,
        },
        // {
          // layer: gl4,
        // },
        // {
          // layer: gl5,
        // },
        {
          layer: gl6,
        },
        {
          layer: gl7,
        },
      ];
      const layerList = new LayerList({
        map: map,
        showLegend: false,
        layers: layers,
      }, 'legendDiv');
      layerList.startup();

      // Draw each helicopter on the map
      setTimeout(addHelicoptersToMap(fireResources), 0);
    });

  function clearLayers() {
    // gl1.clear();
    // gl2.clear();
    gl3.clear();
    // gl4.clear();
    // gl5.clear();
    gl6.clear();
    gl7.clear();
  }

  function addHelicopterToLayer(heliAttributes) {
    const helicopter = new Helicopter(heliAttributes);

    switch (helicopter.resourceType) {
      // case 'ShortHaulHelicopter':
      //   gl1.add(helicopter.mapGraphic());
      //   gl1.add(helicopter.mapResponseRingGraphic());
      //   gl1.add(helicopter.mapLabel());
      //   break;
      case 'RappelHelicopter':
        gl3.add(helicopter.mapGraphic());
        gl3.add(helicopter.mapLabel());
        break;
      // case 'HotshotCrew':
      //   gl4.add(helicopter.mapGraphic());
      //   gl4.add(helicopter.mapLabel());
      //   break;
      // case 'SmokejumperAirplane':
      //   gl5.add(helicopter.mapGraphic());
      //   gl5.add(helicopter.mapLabel());
      //   break;
      case 'HelitackHelicopter':
        gl6.add(helicopter.mapGraphic());
        gl6.add(helicopter.mapLabel());
        break;
      case 'Type1Helicopter':
        gl7.add(helicopter.mapGraphic());
        gl7.add(helicopter.mapLabel());
        break;
      default:
        break;
    }
  }

  function addHelicoptersToMap(helicopters) {
    for (let i = 0; i < helicopters.length; i++) {
      addHelicopterToLayer(helicopters[i]);
    }
  }

  function getIndexOfHelicopter(helicopter, helicopters) {
    let i;
    let found = false;
    for (i = 0; i < helicopters.length; i++) {
      if (helicopters[i].statusable_resource_id === helicopter.statusable_resource_id) {
        found = true;
        break;
      }
    }
    return found ? i : false;
  }

  function mergeHelicopter(helicopter, helicopters) {
    const newHelicopters = helicopters;
    const i = getIndexOfHelicopter(helicopter, newHelicopters);
    if (i !== false) {
      newHelicopters[i] = helicopter;
    } else {
      newHelicopters.push(helicopter);
    }

    return newHelicopters;
  }
});
