import circle from '@turf/circle';
import type { Feature, Polygon } from 'geojson';

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
     * Optional HTML from the API; details UI prefers structured fields instead.
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

/** Assignment value that indicates an aircraft has a mechanical problem. */
export const MECHANICAL_ASSIGNMENT = 'Unavailable: Mechanical';

export const isMechanicalUnavailable = (
    helicopter: Pick<HelicopterProps, 'assignedFireName'>
): boolean => helicopter.assignedFireName === MECHANICAL_ASSIGNMENT;

const FRESH_MS = 18 * 60 * 60 * 1000;
const ICON_PATH = '/images/symbols';

export const getRangeStatuteMiles = (makeModel: HelicopterMakeModel): number =>
    helicopterMakeModelAttributes[makeModel]?.rangeStatuteMiles ?? 0;

export const getMakeModelLabel = (makeModel: HelicopterMakeModel): string =>
    helicopterMakeModelAttributes[makeModel]?.model ?? makeModel;

/**
 * True if the helicopter's position was updated within the past 18 hours.
 */
export const isHelicopterFresh = (updatedAt: Date): boolean =>
    Date.now() - updatedAt.getTime() < FRESH_MS;

export const getHelicopterIconUrl = (updatedAt: Date): string =>
    `${ICON_PATH}/rappelhelicopter-${
        isHelicopterFresh(updatedAt) ? 'fresh' : 'stale'
    }.png`;

export const getResponseRingColor = (
    updatedAt: Date,
    rangeStatuteMiles: number
): string => {
    if (!isHelicopterFresh(updatedAt)) {
        return 'rgb(150, 150, 150)';
    }
    return rangeStatuteMiles > 150
        ? 'rgb(100, 100, 200)'
        : 'rgb(100, 200, 100)';
};

export const buildResponseRingGeoJSON = (
    longitude: number,
    latitude: number,
    rangeStatuteMiles: number
): Feature<Polygon> =>
    circle([longitude, latitude], rangeStatuteMiles, {
        steps: 120,
        units: 'miles',
    });
