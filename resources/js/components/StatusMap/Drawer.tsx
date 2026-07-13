import { Drawer } from '@mantine/core';
import React from 'react';

export type DrawerProps = {
    open?: boolean;
    toggleDrawerOpen: () => void;
};

const defaultProps = {
    open: false,
};

export const PushUpDrawer = (props: React.PropsWithChildren<DrawerProps>) => {
    const { open, toggleDrawerOpen } = { ...defaultProps, ...props };

    return (
        <Drawer
            opened={open}
            onClose={toggleDrawerOpen}
            position="bottom"
            size={200}
            withCloseButton
            title={null}
            padding="md"
            styles={{
                content: {
                    borderTop: '1px solid var(--mantine-color-gray-4)',
                },
            }}
        >
            {props.children}
        </Drawer>
    );
};
