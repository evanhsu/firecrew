import { Anchor, Box, Group, Text } from '@mantine/core';
import { getNavConfig } from './navTypes';

export const APP_FOOTER_HEIGHT = 40;

export function AppFooter() {
    const { routes } = getNavConfig();

    return (
        <Box
            component="footer"
            h={APP_FOOTER_HEIGHT}
            px="md"
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                borderTop: '1px solid var(--mantine-color-gray-3)',
                backgroundColor: 'var(--mantine-color-body)',
            }}
        >
            <Group h="100%" justify="center" gap="md">
                <Text size="xs" c="dimmed">
                    A service of SmirkSoftware, LLC
                </Text>
                <Anchor href={routes.privacy} size="xs">
                    Privacy
                </Anchor>
            </Group>
        </Box>
    );
}
