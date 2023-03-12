import React from 'react';

export type DrawerProps = {
    open?: boolean;
    toggleDrawerOpen: () => void;
};
const defaultProps = {
    open: false,
};
const style = {
    position: 'absolute' as const,
    bottom: 0,
    width: '100%',
    height: 200,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid gray',
};

export const PushUpDrawer = (props: React.PropsWithChildren<DrawerProps>) => {
    const { open, toggleDrawerOpen } = { ...defaultProps, ...props };

    if (!open) {
        return null;
    }

    return (
        <div style={style}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                }}
            >
                <span
                    onClick={toggleDrawerOpen}
                    style={{
                        textAlign: 'right',
                        padding: 10,
                        cursor: 'pointer',
                    }}
                >
                    Close
                </span>
            </div>
            <div
                style={{
                    padding: '0 10px 10px 10px',
                }}
            >
                {props.children}
            </div>
        </div>
    );
};
