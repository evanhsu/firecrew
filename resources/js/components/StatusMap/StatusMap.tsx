import { Group, Image, Text } from '@mantine/core';
import { useState } from 'react';
import { PushUpDrawer } from './Drawer';
import { Map } from './Map';

export const StatusMap = () => {
    const wasDrawerPreviouslyClosed =
        localStorage.getItem('instructionsDismissed') === '1';
    const [isDrawerOpen, setIsDrawerOpen] = useState(
        !wasDrawerPreviouslyClosed
    );

    const handleDrawerToggle = () => {
        localStorage.setItem('instructionsDismissed', '1');
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <Map />
            <PushUpDrawer
                open={isDrawerOpen}
                toggleDrawerOpen={handleDrawerToggle}
            >
                <Group gap="sm" wrap="nowrap">
                    <Image
                        src="/images/symbols/rappelhelicopter-fresh.png"
                        alt="Rappel helicopter"
                        w={32}
                        h={32}
                        fit="contain"
                    />
                    <Text size="md">
                        Click on a helicopter to see its IA Range and additional
                        details
                    </Text>
                </Group>
            </PushUpDrawer>
        </>
    );
};
