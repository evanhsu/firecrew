import {
    buildResponseRingGeoJSON,
    getHelicopterIconUrl,
    getRangeStatuteMiles,
    getResponseRingColor,
    HelicopterProps,
    isHelicopterFresh,
} from './Helicopter';
import {
    DESKTOP_DRAWER_WIDTH_PX,
    MOBILE_DRAWER_HEIGHT_VH,
} from './detailsLayout';
import { useMediaQuery } from '@mantine/hooks';
import type { Feature, Polygon } from 'geojson';
import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
} from 'react';
import Map, {
    Layer,
    MapLayerMouseEvent,
    MapRef,
    Marker,
    Source,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const DEFAULT_MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

const INITIAL_VIEW_STATE = {
    longitude: -113,
    latitude: 43,
    zoom: 6,
};

const bboxFromPolygon = (
    feature: Feature<Polygon>
): [[number, number], [number, number]] => {
    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    for (const [lng, lat] of feature.geometry.coordinates[0]) {
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
    }

    return [
        [minLng, minLat],
        [maxLng, maxLat],
    ];
};

export type StatusMapHandle = {
    /** Zoom so the selected aircraft's IA range circle fills the visible map area. */
    fitToSelectedRange: () => void;
};

export type StatusMapViewProps = {
    helicopters: HelicopterProps[];
    selectedId: string | null;
    onSelect: (helicopter: HelicopterProps) => void;
    onClearSelection: () => void;
};

const MapView = forwardRef<StatusMapHandle, StatusMapViewProps>(
    function MapView(
        { helicopters, selectedId, onSelect, onClearSelection },
        ref
    ) {
        const mapRef = useRef<MapRef>(null);
        // Touch taps on markers often also fire a map click; ignore that ghost click.
        const suppressMapClickUntilRef = useRef(0);
        const isDesktop = useMediaQuery('(min-width: 62em)');

        const selectedHelicopter = useMemo(
            () => helicopters.find((h) => h.id === selectedId) ?? null,
            [helicopters, selectedId]
        );

        const responseRing = useMemo(() => {
            if (!selectedHelicopter) {
                return null;
            }
            const range = getRangeStatuteMiles(selectedHelicopter.makeModel);
            if (!range) {
                return null;
            }
            return {
                geojson: buildResponseRingGeoJSON(
                    selectedHelicopter.longitude,
                    selectedHelicopter.latitude,
                    range
                ),
                color: getResponseRingColor(
                    selectedHelicopter.updatedAt,
                    range
                ),
                label: `IA Range: ${range.toFixed(0)} mi`,
                fresh: isHelicopterFresh(selectedHelicopter.updatedAt),
            };
        }, [selectedHelicopter]);

        useImperativeHandle(
            ref,
            () => ({
                fitToSelectedRange: () => {
                    if (!responseRing || !mapRef.current) {
                        return;
                    }

                    const drawerPad = isDesktop
                        ? DESKTOP_DRAWER_WIDTH_PX
                        : Math.round(
                              window.innerHeight * MOBILE_DRAWER_HEIGHT_VH
                          );

                    mapRef.current.fitBounds(
                        bboxFromPolygon(responseRing.geojson),
                        {
                            padding: isDesktop
                                ? {
                                      top: 48,
                                      bottom: 48,
                                      left: 48,
                                      right: drawerPad + 48,
                                  }
                                : {
                                      top: 48,
                                      bottom: drawerPad + 48,
                                      left: 24,
                                      right: 24,
                                  },
                            duration: 450,
                            maxZoom: 9,
                        }
                    );
                },
            }),
            [responseRing, isDesktop]
        );

        const mapStyle =
            import.meta.env.VITE_MAP_STYLE_URL || DEFAULT_MAP_STYLE;

        const handleMapClick = (_event: MapLayerMouseEvent) => {
            if (Date.now() < suppressMapClickUntilRef.current) {
                return;
            }
            onClearSelection();
        };

        const handleMarkerClick = (helicopter: HelicopterProps) => {
            suppressMapClickUntilRef.current = Date.now() + 400;
            onSelect(helicopter);
        };

        return (
            <div style={{ height: '100%', width: '100%' }}>
                <Map
                    ref={mapRef}
                    initialViewState={INITIAL_VIEW_STATE}
                    mapStyle={mapStyle}
                    style={{ width: '100%', height: '100%' }}
                    onClick={handleMapClick}
                >
                    {responseRing && (
                        <Source
                            id="response-ring"
                            type="geojson"
                            data={responseRing.geojson}
                        >
                            <Layer
                                id="response-ring-line"
                                type="line"
                                paint={{
                                    'line-color': responseRing.color,
                                    'line-width': 3,
                                    'line-dasharray': [1, 2],
                                }}
                            />
                        </Source>
                    )}

                    {helicopters.map((helicopter) => {
                        const fresh = isHelicopterFresh(helicopter.updatedAt);
                        const selected = helicopter.id === selectedId;

                        return (
                            <Marker
                                key={helicopter.id}
                                longitude={helicopter.longitude}
                                latitude={helicopter.latitude}
                                anchor="center"
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation();
                                    e.originalEvent.preventDefault();
                                    handleMarkerClick(helicopter);
                                }}
                                style={{
                                    cursor: 'pointer',
                                    zIndex: selected ? 2 : 1,
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        position: 'relative',
                                    }}
                                >
                                    <img
                                        src={getHelicopterIconUrl(
                                            helicopter.updatedAt
                                        )}
                                        alt={helicopter.tailnumber}
                                        width={65}
                                        height={65}
                                        style={{
                                            display: 'block',
                                            filter: selected
                                                ? 'drop-shadow(0 0 4px rgba(30, 64, 175, 0.9))'
                                                : undefined,
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '70%',
                                            top: 4,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            fontFamily: 'sans-serif',
                                            color: fresh ? '#000' : '#888',
                                            whiteSpace: 'nowrap',
                                            textShadow:
                                                '0 0 3px #fff, 0 0 3px #fff',
                                            pointerEvents: 'none',
                                        }}
                                    >
                                        {helicopter.tailnumber}
                                    </span>
                                </div>
                            </Marker>
                        );
                    })}

                    {responseRing && selectedHelicopter && (
                        <Marker
                            longitude={selectedHelicopter.longitude}
                            latitude={selectedHelicopter.latitude}
                            anchor="center"
                            style={{ pointerEvents: 'none' }}
                        >
                            <span
                                style={{
                                    position: 'relative',
                                    top: 40,
                                    left: 40,
                                    fontSize: 16,
                                    fontWeight: 700,
                                    fontFamily: 'sans-serif',
                                    color: responseRing.fresh
                                        ? '#000'
                                        : '#888',
                                    whiteSpace: 'nowrap',
                                    textShadow: '0 0 4px #fff, 0 0 4px #fff',
                                }}
                            >
                                {responseRing.label}
                            </span>
                        </Marker>
                    )}
                </Map>
            </div>
        );
    }
);

export { MapView as Map };
