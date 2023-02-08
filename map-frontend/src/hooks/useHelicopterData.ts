import WebMap from '@arcgis/core/WebMap';
import { useCallback, useRef } from 'react';
import { InputHelicopter } from '../Map';
import { logger } from '../utils/Logger';

const translateHelicopterFromApiSchemaToAppSchema = (
    apiHelicopter: any
): InputHelicopter => {
    return {
        id: apiHelicopter.statusable_resource_id,
        latitude: apiHelicopter.latitude,
        longitude: apiHelicopter.longitude,
        tailnumber: apiHelicopter.statusable_resource_name,
        makeModel: '205A1',
        popupContent: apiHelicopter.popup_content,
    };
};

export type OnDataCallback = (data: InputHelicopter[]) => Promise<void>;
export const useHelicopterData = (
    onData: OnDataCallback,
    webMap: WebMap | null
) => {
    const eventListenersAreRegistered = useRef(false);

    // Using a ref instead of a useState() hook because the value needs to be accessible to a
    // Javascript event handler that's registered on the window (outside of React).
    // See the window.Echo.channel().listen() event handler that's registered in this hook.
    // Initially built this using [helicopterData, setHelicopterData] = useState([]) but the event
    // handler always saw an empty collection, even after the state had been updated.
    const helicopterData = useRef<InputHelicopter[]>([]);
    const setHelicopterData = (helicopters: InputHelicopter[]) => {
        helicopterData.current = helicopters;
    };

    const onEventReceived = (event: any) => {
        const updatedHelicopter = translateHelicopterFromApiSchemaToAppSchema(
            event.resourceStatus
        );
        logger.debug(
            `Received status update event for resource ${updatedHelicopter.id}`
        );

        let helicopters = helicopterData.current;

        // Merge new update with existing data
        if (helicopters.length === 0) {
            logger.debug('Adding helicopter to empty collection');
            helicopters.push(updatedHelicopter);
            setHelicopterData(helicopters);
        } else {
            logger.debug('Merging helicopter into existing collection');

            const unchangedHelicopters = helicopters.filter((h) => {
                // Remove the helicopter that was updated (keep the others)
                return h.id != updatedHelicopter.id;
            });

            // Now add the updated helicopter back into the collection
            helicopters = [...unchangedHelicopters, updatedHelicopter];
            setHelicopterData(helicopters);
        }

        // The onData() callback was passed in as a prop
        onData(helicopters);
    };

    const fetchAndSubscribe = useCallback(() => {
        if (webMap === null) {
            return;
        }
        // Make a one-time API request to fetch the initial data
        // Subsequent updates will be handled by the event subscription above
        // useEffect(() => {
        fetch('/api/status/all')
            .then((response) => response.json())
            .then((data) => {
                const formattedData = data.map(
                    translateHelicopterFromApiSchemaToAppSchema
                );
                setHelicopterData(formattedData);
                onData(formattedData);
            })
            .then(() => {
                /**
                 * Subscribe to the Pusher broadcast channel for ResourceStatus updates
                 */
                if (
                    // @ts-expect-error
                    window.Echo?.channel !== undefined &&
                    !eventListenersAreRegistered.current
                ) {
                    logger.debug('Registering Echo event listener');
                    // @ts-expect-error
                    window.Echo.channel('publicStatusUpdates').listen(
                        'ResourceStatusUpdated',
                        onEventReceived
                    );
                    eventListenersAreRegistered.current = true;
                }
            });
    }, [onData, webMap]);

    return {
        initialData: helicopterData,
        fetchAndSubscribe,
    };
};
