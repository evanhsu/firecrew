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

export const helicopterMakeModelAttributes = {
    '205a1': {
        model: '205 A1++',
        rangeStatuteMiles: 130,
    },
    '412epx': {
        model: '412 EPX',
        rangeStatuteMiles: 254,
    },
    superpuma: {
        model: '332L1',
        rangeStatuteMiles: 334,
    },
};
export type HelicopterMakeModel = keyof typeof helicopterMakeModelAttributes;

export type HelicopterProps = {
    /**
     * The 'statusable_resource_id' from the API
     */
    id: string;
    /**
     * The human-readable name for this helicopter. Usually a tailnumber
     * @example N208RH
     */
    tailnumber: string;
    latitude: number;
    longitude: number;
    makeModel: HelicopterMakeModel;
    /**
     * Formatted HTML that will be rendered in a popup when this Helicopter symbol is clicked
     */
    popupContent?: string;
    staffingCategory1: string; // HRAPs Available
    staffingValue1: string | number;
    crewName: string;
    managerName: string;
    managerPhone: string;
    assignedFireName: string;
    updatedAt: Date;
};

const defaultProps = {
    popupContent: null,
    crewName: '',
    managerName: '',
    managerPhone: '',
    assignedFireName: '',
};

const freshTime = 18 * 60 * 60 * 1000; // Milliseconds until this helicopter's position info is considered stale
const iconSize = 75;
const iconPath = '/images/symbols'; // The folder that contains all of the map-symbol image files

/**
 * Creates 3 "Graphics" that can be used with the ArcGIS SDK. Each Graphic can be added to
 * an ArcGIS map Layer.
 *   1. A Graphic representing the Helicopter itself
 *   2. A Graphic with a text label that will appear next to the Helicopter.
 *   3. A Graphic with a circle that represents the Helicopter's maximum fuel range.
 *
 * @example
 *   const h = new Helicopter({...});
 *   helicopterLayer.addMany([h.mapGraphic, h.mapLabel]);
 *   responseRingLayer.add(h.responseRingGraphic)
 * @returns
 */
export const Helicopter = (props: HelicopterProps) => {
    const {
        tailnumber: resourceName,
        latitude,
        longitude,
        makeModel,
        popupContent,
        staffingCategory1,
        staffingValue1,
        crewName,
        managerName,
        managerPhone,
        assignedFireName,
        updatedAt,
    } = { ...defaultProps, ...props };
    const rangeStatuteMiles =
        helicopterMakeModelAttributes[makeModel]?.rangeStatuteMiles ?? 0;

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
        var age = Date.now() - updatedAt.getTime();
        return age < freshTime;
    };

    const objectId = (suffix: string = '') =>
        `${resourceName}-${uuid}${suffix ? `-${suffix}` : ''}`;

    const helicopterAttributes = {
        OBJECTID: objectId(),
        popupTitle: `Helicopter ${resourceName}`,
        popupContent,
        rangeStatuteMiles,
        updatedAt,
        staffingCategory1,
        staffingValue1,
        assignedFireName,
        managerName,
        managerPhone,
        crewName,
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

    const helicopterSymbol = () => {
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
    /**
     * Returns an ArcGIS GRAPHIC object that can be placed onto a GraphicsLayer.
     * The GRAPHIC object combines an ArcGIS POINT with a PICTUREMARKERSYMBOL to produce an image with a location.
     * The 3rd parameter sets the content that is used to construct a popup when this Graphic is clicked on the map.
     *
     * @example:
     * 	const myHelicopter = new Helicopter();
     * 	const gl = new GraphicsLayer();
     *	gl.add(myHelicopter.mapGraphic);
     */
    const helicopterGraphic = () => {
        return new Graphic({
            geometry: mapPoint(),
            symbol: helicopterSymbol(),
            attributes: helicopterAttributes,
            popupTemplate: {
                title: '{popupTitle}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'crewName',
                                label: 'Crew',
                            },
                            {
                                fieldName: 'assignedFireName',
                                label: 'Assigned Fire',
                            },
                            {
                                fieldName: 'staffingValue1',
                                label: helicopterAttributes.staffingCategory1,
                            },
                            {
                                fieldName: 'managerName',
                                label: 'Spotter',
                            },
                            {
                                fieldName: 'managerPhone',
                                label: 'Phone',
                            },
                            {
                                fieldName: 'rangeStatuteMiles',
                                label: 'IA Range (mi)',
                            },
                            {
                                fieldName: 'updatedAt',
                                label: 'Updated',
                                type: 'date',
                            },
                        ],
                    },
                ],
            },
        });
    };

    /**
     * The text label that will appear next to this Helicopter's graphic symbol on the map.
     */
    const helicopterLabelGraphic = () => {
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
            rangeStatuteMiles > 150 ? bigRingColor : smallRingColor;
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
            radius: rangeStatuteMiles,
            radiusUnit: 'miles',
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

    const responseRingGraphicLabel = () => {
        const colorValue = isFresh() ? '#000000' : '#888888';
        return new Graphic({
            geometry: mapPoint(),
            attributes: {
                OBJECTID: objectId('response-ring-label'),
            },
            symbol: new TextSymbol({
                text: `IA Range: ${rangeStatuteMiles.toFixed(0)} mi`,
                color: new Color(colorValue),
                xoffset: 50,
                yoffset: 50,
                font: new Font({
                    size: 20,
                    family: 'sans-serif',
                    weight: 'bolder',
                }),
            }),
            visible: false, // The ring (and label) are hidden by default. They become visible when the heli icon is clicked.
        });
    };

    return {
        helicopterLabel: helicopterLabelGraphic(),
        helicopterGraphic: helicopterGraphic(),
        responseRingGraphic: responseRingGraphic(),
        responseRingGraphicLabel: responseRingGraphicLabel(),
    };
};
