import { useState } from 'react';
import { PushUpDrawer } from './Drawer';
import { Map } from './Map';

export const App = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true); // TODO: remember with cookie/localstorage

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <Map isDrawerOpen={isDrawerOpen} />
            <PushUpDrawer
                open={isDrawerOpen}
                toggleDrawerOpen={handleDrawerToggle}
            >
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span>
                        <img src="/images/symbols/rappelhelicopter-fresh.png" />
                    </span>
                    <span
                        style={{
                            fontSize: '1.2em',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Click on a helicopter to see its IA Range and additional
                        details
                    </span>
                </div>
            </PushUpDrawer>
        </>
    );
};
