import React, { useRef, useEffect, useState } from 'react';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Expand from '@arcgis/core/widgets/Expand';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { Helicopter } from './Helicopter';
import { TextContent } from '@arcgis/core/popup/content';

const getPosition = () => {
    const latitude = 43.0 + Math.random() * 5;
    const longitude = -113.0 + Math.random() * 5;

    return {
        latitude,
        longitude,
    };
};

const Map = () => {
    const mapDiv = useRef<HTMLDivElement>(null);
    // This ref is used to guarantee that the WebMap isn't built twice.
    // Since the WebMap is bound to a DOM element with userRef(), it persists between re-renders
    // and rendering this component twice results in duplicate maps and layers in the dom.
    const esriMapAlreadyLoaded = useRef(false);

    const [position, setPosition] = useState(getPosition());
    const [isVisible, setIsVisible] = useState(false);
    const [webMap, setWebMap] = useState<WebMap | null>(null);

    const stateBoundariesLayer = new FeatureLayer({
        id: 'census-layer',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3',
    });

    const helicopterGraphicsLayer = new GraphicsLayer({
        id: 'helicopter-graphics-layer',
    });

    const responseRingGraphicsLayer = new GraphicsLayer({
        id: 'response-ring-graphics-layer',
    });

    const helicopterPositionFeatureLayer = new FeatureLayer({
        id: 'helicopter-layer',
        popupTemplate: {
            title: '{popupTitle}',
            content: [
                new TextContent({
                    text: '{popupContent}',
                }),
            ],
        },
        source: [
            Helicopter({
                resourceName: 'N000999',
                latitude: position.latitude,
                longitude: position.longitude,
                updatedAt: '2023-01-30 21:30:00',
                popupContent: '<span style="color: blue">hi there</span>',
            }).mapGraphic,
        ],
        objectIdField: 'OBJECTID',
        fields: [
            {
                name: 'OBJECTID',
                type: 'oid',
            },
            {
                name: 'popupTitle',
                type: 'string',
            },
            {
                name: 'popupContent',
                type: 'xml',
            },
        ],
    });

    const layer = <T extends __esri.Layer = __esri.Layer>(
        layerId: string
    ): T => {
        if (webMap) {
            const layer = webMap.allLayers.find(
                (layer) => layer.id === layerId
            );
            if (layer) {
                // @ts-expect-error
                return layer;
            }
            throw new Error(`Map layer "${layerId}" doesn't exist`);
        } else {
            throw new Error("The map hasn't finished loading yet");
        }
    };

    const toggleLayerIsVisible = () => {
        setIsVisible(!isVisible);
        console.debug(`toggling layer visibility to ${isVisible}`);
        try {
            layer('census-layer').visible = isVisible;
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setPosition(getPosition());

            const h = Helicopter({
                resourceName: 'N12345',
                latitude: position.latitude,
                longitude: position.longitude,
                updatedAt: '2023-01-30 21:30:00',
                popupContent: '<span style="color: blue">hi there</span>',
                rangeNauticalMiles: Math.random() * 100 + 100,
            });

            try {
                // layer<FeatureLayer>('helicopter-layer').applyEdits({
                //     addFeatures: [h.mapGraphic, h.responseRingGraphic],
                // });
                layer<GraphicsLayer>('helicopter-graphics-layer').addMany([
                    h.mapGraphic,
                    h.mapLabel,
                ]);
                layer<GraphicsLayer>('response-ring-graphics-layer').add(
                    h.responseRingGraphic
                );
            } catch (e) {
                console.error(e);
            }
        }, 5000);

        return () => {
            clearInterval(timer);
        };
    });

    useEffect(() => {
        if (!esriMapAlreadyLoaded.current) {
            esriMapAlreadyLoaded.current = true;
            /**
             * Initialize application
             */
            const webmap = new WebMap({
                basemap: 'topo-vector',
                // portalItem: {
                //     id: "aa1d3f80270146208328cf66d022e09c",
                // },
            });

            const view = new MapView({
                // @ts-expect-error
                container: mapDiv.current,
                map: webmap,
                center: [-113, 43],
                zoom: 6,
            });

            const bookmarks = new Bookmarks({
                view,
                // allows bookmarks to be added, edited, or deleted
                editingEnabled: true,
            });

            const bkExpand = new Expand({
                view,
                content: bookmarks,
                expanded: true,
            });

            webmap.add(stateBoundariesLayer);
            webmap.add(helicopterGraphicsLayer);
            webmap.add(responseRingGraphicsLayer);
            webmap.add(helicopterPositionFeatureLayer);

            // Add the widget to the top-right corner of the view
            // view.ui.add(bkExpand, "top-right");

            view.on('click', function (event) {
                // the hitTest() checks to see if any graphics in the view
                // intersect the given screen x, y coordinates.
                // We can pass options to the hitTest() method to specify layers and graphics to include/exclude
                // from the hitTest
                view.hitTest(event, {
                    // Only check to see if the click intersected with a Graphic on this specific layer
                    include: [helicopterGraphicsLayer],
                }).then((response) => {
                    const graphicHits = response.results?.filter(
                        (hitResult): hitResult is __esri.GraphicHit =>
                            hitResult.type === 'graphic'
                        //  && hitResult.graphic.layer === helicopterGraphicsLayer
                    );

                    // If we clicked away from all helicopters, hide all response rings
                    if (graphicHits.length === 0) {
                        const layer = responseRingGraphicsLayer;
                        layer.visible = false;
                        // layer.graphics.forEach((graphic) => {
                        //     graphic.visible = false;
                        // });
                    }

                    graphicHits.forEach((hit) => {
                        console.log(
                            `Clicked on ${JSON.stringify(
                                hit.graphic.attributes
                            )}`
                        );
                        const responseRingObjectId = `${hit.graphic.attributes['OBJECTID']}-response-ring`;
                        // const layer = hit.graphic.layer as GraphicsLayer;
                        const layer = responseRingGraphicsLayer;
                        layer.graphics.forEach((graphic) => {
                            graphic.visible =
                                graphic.getAttribute('OBJECTID') ===
                                responseRingObjectId;
                        });
                        layer.visible = true;
                        // do something with the graphic
                    });
                });
            });

            webmap
                .when(() => {
                    // if (webmap.bookmarks && webmap.bookmarks.length) {
                    //     console.log("Bookmarks: ", webmap.bookmarks.length);
                    // } else {
                    //     console.log("No bookmarks in this webmap.");
                    // }
                })
                .then(() => {
                    setWebMap(webmap);
                    console.log('Map has loaded');
                });
        }
    }, []);

    return (
        <div>
            <button
                onClick={toggleLayerIsVisible}
                style={{ width: 100, height: 40 }}
            >
                Toggle
            </button>
            <div id="map-container" ref={mapDiv}></div>
        </div>
    );
};

export { Map };
