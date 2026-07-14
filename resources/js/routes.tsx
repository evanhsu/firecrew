import { createBrowserRouter, Outlet } from 'react-router-dom';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { StatusMap } from './components/StatusMap/StatusMap';
import StatusSummary from './containers/StatusSummary';

const StatusPagesLayout = () => (
    <>
        <AnnouncementBanner />
        <Outlet />
    </>
);

const router = createBrowserRouter([
    {
        element: <StatusPagesLayout />,
        children: [
            {
                path: 'map',
                element: <StatusMap />,
            },
            {
                path: 'summary',
                element: <StatusSummary />,
            },
            {
                path: '/',
                element: <StatusSummary />,
            },
        ],
    },
]);

export default router;
