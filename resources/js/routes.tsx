import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import StatusSummary from './containers/StatusSummary';

// Lazy-load StatusMap so MapLibre and related map code stay out of the initial
// bundle. Users who only visit the summary page never download that chunk.
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
                // Suspense is required for lazy() components; fallback={null}
                // shows nothing while the map chunk is fetching.
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
