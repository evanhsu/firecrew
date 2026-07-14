import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import StatusSummary from './containers/StatusSummary';

const StatusMap = lazy(() =>
    import('./components/StatusMap/StatusMap').then((module) => ({
        default: module.StatusMap,
    }))
);

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
                element: (
                    <Suspense fallback={null}>
                        <StatusMap />
                    </Suspense>
                ),
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
