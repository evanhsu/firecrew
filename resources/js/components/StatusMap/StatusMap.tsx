import { useMemo, useRef, useState } from 'react';
import { APP_HEADER_HEIGHT } from '../../layout/AppHeader';
import { AircraftDetailsDrawer } from './AircraftDetailsDrawer';
import { HelicopterProps } from './Helicopter';
import { Map, StatusMapHandle } from './Map';
import { useHelicopterData } from './hooks/useHelicopterData';

export const StatusMap = () => {
    const { helicopters } = useHelicopterData();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const mapRef = useRef<StatusMapHandle>(null);

    const selectedHelicopter = useMemo(
        () => helicopters.find((h) => h.id === selectedId) ?? null,
        [helicopters, selectedId]
    );

    const handleSelect = (helicopter: HelicopterProps) => {
        setSelectedId(helicopter.id);
    };

    const handleClearSelection = () => {
        setSelectedId(null);
    };

    return (
        <div style={{ height: `calc(100vh - ${APP_HEADER_HEIGHT}px)` }}>
            <Map
                ref={mapRef}
                helicopters={helicopters}
                selectedId={selectedId}
                onSelect={handleSelect}
                onClearSelection={handleClearSelection}
            />
            <AircraftDetailsDrawer
                helicopter={selectedHelicopter}
                opened={selectedHelicopter !== null}
                onClose={handleClearSelection}
                onZoomToRange={() => mapRef.current?.fitToSelectedRange()}
            />
        </div>
    );
};
