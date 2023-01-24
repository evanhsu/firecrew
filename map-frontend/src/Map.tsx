import React, { useRef, useEffect } from "react";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

function Map() {
    const mapDiv = useRef(null);

    useEffect(() => {
        if (mapDiv.current) {
            /**
             * Initialize application
             */
            const webmap = new WebMap({
                basemap: "topo-vector",
                // portalItem: {
                //     id: "aa1d3f80270146208328cf66d022e09c",
                // },
            });

            const view = new MapView({
                container: mapDiv.current,
                map: webmap,
                center: [-113, 43],
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

            // Add the widget to the top-right corner of the view
            // view.ui.add(bkExpand, "top-right");

            // bonus - how many bookmarks in the webmap?
            webmap
                .when(() => {
                    // if (webmap.bookmarks && webmap.bookmarks.length) {
                    //     console.log("Bookmarks: ", webmap.bookmarks.length);
                    // } else {
                    //     console.log("No bookmarks in this webmap.");
                    // }
                })
                .then(() => console.log("Map has loaded"));
        }
    }, []);

    return <div id="map-container" ref={mapDiv}></div>;
}

export { Map };
