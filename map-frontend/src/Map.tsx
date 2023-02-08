import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Helicopter } from './Helicopter';
import { OnDataCallback, useHelicopterData } from './hooks/useHelicopterData';
import { logger } from './utils/Logger';

export type InputHelicopter = {
    id: number;
    latitude: number;
    longitude: number;
    tailnumber: string;
    makeModel: '205A1' | '412EPX' | 'SuperPuma';
    popupContent: string;
};

/**
 * Get a layer (by its ID) from a WebMap
 */
const layer = <T extends __esri.Layer = __esri.Layer>(
    layerId: string,
    map: WebMap | null
): T => {
    if (map) {
        const layer = map.allLayers.find((layer) => layer.id === layerId);
        if (layer) {
            // @ts-expect-error
            return layer;
        }
        throw new Error(`Map layer "${layerId}" doesn't exist`);
    } else {
        throw new Error("The map hasn't finished loading yet");
    }
};

const createHelicopterDataHandler: (webMap: WebMap | null) => OnDataCallback =
    (webMap) => async (helicopters) => {
        logger.debug('Clearing all graphics from helicopter-graphics-layer');
        layer<GraphicsLayer>('helicopter-graphics-layer', webMap).removeAll();

        logger.debug('Clearing all graphics from response-ring-graphics-layer');
        layer<GraphicsLayer>(
            'response-ring-graphics-layer',
            webMap
        ).removeAll();

        helicopters.forEach((inputHelicopter) => {
            const h = Helicopter({
                tailnumber: inputHelicopter.tailnumber,
                makeModel: inputHelicopter.makeModel,
                latitude: inputHelicopter.latitude,
                longitude: inputHelicopter.longitude,
                updatedAt: '2023-01-30 21:30:00',
                popupContent: inputHelicopter.popupContent,
            });
            try {
                // layer<FeatureLayer>('helicopter-layer').applyEdits({
                //     addFeatures: [h.mapGraphic, h.responseRingGraphic],
                // });
                logger.debug(
                    `adding helicopter ${inputHelicopter.tailnumber} to graphics layer`
                );
                layer<GraphicsLayer>(
                    'helicopter-graphics-layer',
                    webMap
                ).addMany([h.helicopterGraphic, h.helicopterLabel]);
                layer<GraphicsLayer>(
                    'response-ring-graphics-layer',
                    webMap
                ).addMany([h.responseRingGraphic, h.responseRingGraphicLabel]);
            } catch (e) {
                console.error(e);
            }
        });
    };

const Map = () => {
    const mapDiv = useRef<HTMLDivElement>(null);
    // This ref is used to guarantee that the WebMap isn't built twice.
    // Since the WebMap is bound to a DOM element with userRef(), it persists between re-renders
    // and rendering this component twice results in duplicate maps and layers in the dom.
    const esriMapAlreadyLoaded = useRef(false);

    // const [position, setPosition] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [webMap, setWebMap] = useState<WebMap | null>(null);

    const handleHelicopterUpdatedEvent = useCallback(
        createHelicopterDataHandler(webMap),
        [webMap]
    );

    let { fetchAndSubscribe } = useHelicopterData(
        handleHelicopterUpdatedEvent,
        webMap
    );

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

    // Using a "FeatureLayer" is more complex than using a "GraphicsLayer" (like we're currently doing)
    // but has some additional capabilities. This example isn't fully functional, but I'm leaving it
    // here as a starting point if I ever decide to switch to a FeatureLayer.
    // const helicopterPositionFeatureLayer = new FeatureLayer({
    //     id: 'helicopter-layer',
    //     popupTemplate: {
    //         title: '{popupTitle}',
    //         content: [
    //             new TextContent({
    //                 text: '{popupContent}',
    //             }),
    //         ],
    //     },
    //     source: [
    //         Helicopter({
    //             resourceName: 'N000999',
    //             latitude: position.latitude,
    //             longitude: position.longitude,
    //             updatedAt: '2023-01-30 21:30:00',
    //             popupContent: '<span style="color: blue">hi there</span>',
    //         }).helicopterGraphic,
    //     ],
    //     objectIdField: 'OBJECTID',
    //     fields: [
    //         {
    //             name: 'OBJECTID',
    //             type: 'oid',
    //         },
    //         {
    //             name: 'popupTitle',
    //             type: 'string',
    //         },
    //         {
    //             name: 'popupContent',
    //             type: 'xml',
    //         },
    //     ],
    // });

    useEffect(() => {
        fetchAndSubscribe();
    }, [fetchAndSubscribe]);

    const toggleLayerIsVisible = () => {
        setIsVisible(!isVisible);
        console.debug(`toggling layer visibility to ${isVisible}`);
        try {
            layer('census-layer', webMap).visible = isVisible;
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (!esriMapAlreadyLoaded.current) {
            esriMapAlreadyLoaded.current = true;
            /**
             * Initialize application
             */
            logger.debug('Creating the WebMap...');

            const map = new WebMap({
                basemap: 'topo-vector',
                // portalItem: {
                //     id: "aa1d3f80270146208328cf66d022e09c",
                // },
            });

            const view = new MapView({
                // @ts-expect-error
                container: mapDiv.current,
                map: map,
                center: [-113, 43],
                zoom: 6,
            });

            map.add(stateBoundariesLayer);
            map.add(helicopterGraphicsLayer);
            map.add(responseRingGraphicsLayer);
            // webmap.add(helicopterPositionFeatureLayer);

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
                        // Make the entire responseRing layer invisible (hide all rings)
                        // const layer = responseRingGraphicsLayer;
                        // layer.visible = false;
                        //
                        // Alternative: make each response ring invisible
                        // layer.graphics.forEach((graphic) => {
                        //     graphic.visible = false;
                        // });
                    }

                    graphicHits.forEach((hit) => {
                        logger.debug(
                            `Clicked on ${hit.graphic.attributes.OBJECTID}`
                        );
                        const responseRingObjectId = `${hit.graphic.attributes['OBJECTID']}-response-ring`;
                        const responseRingLabelObjectId = `${hit.graphic.attributes['OBJECTID']}-response-ring-label`;
                        // const layer = hit.graphic.layer as GraphicsLayer;
                        const layer = responseRingGraphicsLayer;

                        layer.graphics.forEach((graphic) => {
                            graphic.visible = [
                                responseRingObjectId,
                                responseRingLabelObjectId,
                            ].includes(graphic.getAttribute('OBJECTID'))
                                ? !graphic.visible // Toggle the visibility if this graphic was clicked
                                : graphic.visible; // Leave the visibility unchanged if this graphic was NOT clicked
                        });
                        layer.visible = true;
                        // do something with the graphic
                    });
                });
            });

            map.when(() => {
                // if (webmap.bookmarks && webmap.bookmarks.length) {
                //     logger.debug("Bookmarks: ", webmap.bookmarks.length);
                // } else {
                //     logger.debug("No bookmarks in this webmap.");
                // }

                // The map is now loaded
                logger.debug(`The Map is loaded: ${map.loaded}`);
                setWebMap(map);
            });
        }
    }, []);

    return (
        <div style={{ height: '100%' }}>
            {/* <button
                onClick={toggleLayerIsVisible}
                style={{ width: 100, height: 40 }}
            >
                Toggle
            </button> */}
            <div id="map-container" ref={mapDiv}></div>
        </div>
    );
};

export { Map };
