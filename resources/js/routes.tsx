import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import StatusSummary from './containers/StatusSummary';

const StatusMap = lazy(() =>
    import('./components/StatusMap/StatusMap').then((module) => ({
        default: module.StatusMap,
    }))
);

const router = createBrowserRouter([
    {
        path: '/map',
        element: (
            <Suspense fallback={null}>
                <StatusMap />
            </Suspense>
        ),
    },
    {
        path: '/summary',
        element: <StatusSummary />,
    },
    {
        path: '/',
        element: <StatusSummary />,
    },
]);

export default router;
