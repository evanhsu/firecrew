import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../../../helpers/logger';
import { HelicopterProps } from '../Helicopter';

const translateHelicopterFromApiSchemaToAppSchema = (
    apiHelicopter: any
): HelicopterProps => {
    return {
        id: apiHelicopter.statusable_resource_id,
        latitude: apiHelicopter.latitude,
        longitude: apiHelicopter.longitude,
        tailnumber: apiHelicopter.statusable_resource_name,
        makeModel: apiHelicopter.resource?.model,
        popupContent: apiHelicopter.popup_content,
        staffingCategory1: apiHelicopter.staffing_category1,
        staffingValue1: apiHelicopter.staffing_value1,
        crewName: apiHelicopter.crew_name,
        managerName: apiHelicopter.manager_name,
        managerPhone: apiHelicopter.manager_phone,
        assignedFireName: apiHelicopter.assigned_fire_name,
        updatedAt: new Date(apiHelicopter.updated_at),
    };
};

const mergeHelicopterUpdate = (
    helicopters: HelicopterProps[],
    updatedHelicopter: HelicopterProps
): HelicopterProps[] => {
    const unchanged = helicopters.filter((h) => h.id != updatedHelicopter.id);
    return [...unchanged, updatedHelicopter];
};

export const useHelicopterData = () => {
    const [helicopters, setHelicopters] = useState<HelicopterProps[]>([]);
    const helicoptersRef = useRef<HelicopterProps[]>([]);
    const eventListenersAreRegistered = useRef(false);

    const setHelicopterData = (next: HelicopterProps[]) => {
        helicoptersRef.current = next;
        setHelicopters(next);
    };

    const onEventReceived = useCallback((event: any) => {
        const updatedHelicopter = translateHelicopterFromApiSchemaToAppSchema(
            event.resourceStatus
        );
        logger.debug(
            `Received status update event for resource ${updatedHelicopter.id}`
        );

        const next =
            helicoptersRef.current.length === 0
                ? [updatedHelicopter]
                : mergeHelicopterUpdate(
                      helicoptersRef.current,
                      updatedHelicopter
                  );

        setHelicopterData(next);
    }, []);

    const fetchAndSubscribe = useCallback(() => {
        fetch('/api/status/all')
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map(
                    translateHelicopterFromApiSchemaToAppSchema
                );
                setHelicopterData(formattedData);
            })
            .then(() => {
                if (
                    window.Echo?.channel !== undefined &&
                    !eventListenersAreRegistered.current
                ) {
                    logger.debug('Registering Echo event listener');
                    window.Echo.channel('publicStatusUpdates').listen(
                        'ResourceStatusUpdated',
                        onEventReceived
                    );
                    eventListenersAreRegistered.current = true;
                }
            });
    }, [onEventReceived]);

    useEffect(() => {
        fetchAndSubscribe();
    }, [fetchAndSubscribe]);

    return {
        helicopters,
        fetchAndSubscribe,
    };
};
