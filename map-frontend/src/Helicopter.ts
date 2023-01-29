import { Point, SpatialReference } from '@arcgis/core/geometry';
import Circle from '@arcgis/core/geometry/Circle';
import Color from '@arcgis/core/Color';
import Graphic from '@arcgis/core/Graphic';
import {
    PictureMarkerSymbol,
    SimpleFillSymbol,
    SimpleLineSymbol,
    TextSymbol,
    Font,
} from '@arcgis/core/symbols';
import { TextContent } from '@arcgis/core/popup/content';

export type HelicopterProps = {
    /**
     * The human-readable name for this helicopter. Usually a tailnumber
     * @example N208RH
     */
    resourceName: string;
    latitude: number;
    longitude: number;
    rangeNauticalMiles?: number;
    /**
     * Formatted HTML that will be rendered in a popup when this Helicopter symbol is clicked
     */
    popupContent?: string;
    updatedAt: string;
};

const defaultProps = {
    rangeNauticalMiles: 100,
    popupContent: null,
};

const freshTime = 18 * 60 * 60 * 1000; // Milliseconds until this helicopter's position info is considered stale
const iconSize = 75;
const iconPath = '/images/symbols'; // The folder that contains all of the map-symbol image files

export const Helicopter = (props: HelicopterProps) => {
    const {
        resourceName,
        latitude,
        longitude,
        rangeNauticalMiles,
        popupContent,
    } = { ...defaultProps, ...props };
    const isoDate = props.updatedAt.replace(/-/g, '/') + ' GMT'; // Convert date string from YYYY-mm-dd HH:mm:ss to YYYY/mm/dd HH:mm:ss

    // This uuid will be used to uniquely identify this helicopter
    // and associate it with its related "response ring", map label, and other related Graphics.
    // You should be able to assume that a helicopter Graphic with an id of "n12345-<UUID>-helictoper"
    // will have a "response rign" Graphic with an ID of "n12345-<uuid>-response-ring". This allows us
    // to toggle the visibility of response rings in response to helicopter click events.
    const uuid = Math.random().toString(); // TODO: use an actual uuid

    /**
     * If the database entry for this helicopter's location has been updated within the past 18hr, return TRUE.
     */
    const isFresh = () => {
        var age = Date.now() - Date.parse(isoDate);
        return age < freshTime;
    };

    /**
     * Creates an ArcGIS Point object that represents the coordinates of this Helicopter.
     * This Point is used as the location argument when constructing things like Graphics and Symbols.
     */
    const mapPoint = () => {
        // wkid: 4326 (GCS_WGS_1984) - geographic coordinate system (lat/lon)
        const spatialReference = new SpatialReference({ wkid: 4326 });
        return new Point({
            latitude,
            longitude,
            spatialReference,
        });
    };

    const helictoperSymbol = () => {
        const filename = `${iconPath}/rappelhelicopter-${
            isFresh() ? 'fresh' : 'stale'
        }.png`;
        try {
            return new PictureMarkerSymbol({
                url: filename,
                height: iconSize,
                width: iconSize,
            });
        } catch (e) {
            console.error('Error creating helicopter symbol: ' + e);
        }
    };

    const objectId = (suffix: string = '') =>
        `${resourceName}-${uuid}${suffix ? `-${suffix}` : ''}`;

    /**
     * Returns an ArcGIS GRAPHIC object that can be placed onto a GraphicsLayer.
     * The GRAPHIC object combines an ArcGIS POINT with a PICTUREMARKERSYMBOL to produce an image with a location.
     * The 3rd parameter sets the content that is used to construct a popup when this Graphic is clicked on the map.
     *
     * @example:
     * 	const myHelicopter = new Helicopter();
     * 	const gl = new GraphicsLayer();
     *	gl.add(myHelicopter.mapGraphic());
     */
    const mapGraphic = () => {
        return new Graphic({
            geometry: mapPoint(),
            symbol: helictoperSymbol(),
            attributes: {
                OBJECTID: objectId(),
                popupTitle: `Helicopter ${resourceName}`,
                popupContent,
                rangeNauticalMiles,
                updatedAt: isoDate,
            },
            popupTemplate: {
                title: '{popupTitle}',
                content: [
                    new TextContent({
                        text: '{popupContent}',
                    }),
                ],
            },
        });
    };

    /**
     * The text label that will appear next to this Helicopter's graphic symbol on the map.
     */
    const mapLabel = () => {
        const colorValue = isFresh() ? '#000000' : '#888888';
        return new Graphic({
            geometry: mapPoint(),
            attributes: {
                OBJECTID: objectId('label'),
            },
            symbol: new TextSymbol({
                text: resourceName,
                color: new Color(colorValue),
                xoffset: 14,
                yoffset: 24,
                font: new Font({
                    size: 10,
                    family: 'sans-serif',
                    weight: 'bolder',
                }),
            }),
        });
    };

    const responseRingGraphic = () => {
        // Returns an ArcGIS GRAPHIC object that can be placed onto a GraphicsLayer.

        const bigRingColor = new Color([100, 100, 200]);
        const smallRingColor = new Color([100, 200, 100]);

        // Choose a color for the Response Ring based on whether the helicopter location data is FRESH or STALE
        const freshColor =
            rangeNauticalMiles > 150 ? bigRingColor : smallRingColor;
        const staleColor = new Color([150, 150, 150]);

        const responseRingSymbol = new SimpleFillSymbol({
            // Fill-style
            style: 'none', // The inside of the circle is transparent
            color: undefined, // Fill-color for interior of the circle

            // Outline-style
            outline: new SimpleLineSymbol({
                style: 'short-dot',
                color: isFresh() ? freshColor : staleColor,
                width: 3,
            }),
        });

        const circle = new Circle({
            center: mapPoint(),
            radius: rangeNauticalMiles,
            radiusUnit: 'nautical-miles',
            numberOfPoints: 120,
            geodesic: true,
        });

        return new Graphic({
            geometry: circle,
            symbol: responseRingSymbol,
            attributes: {
                OBJECTID: objectId('response-ring'),
            },
            visible: false, // The ring is hidden by default. It becomes visible when the heli icon is clicked.
        });
    };

    return {
        mapLabel: mapLabel(),
        mapGraphic: mapGraphic(),
        responseRingGraphic: responseRingGraphic(),
    };
};
