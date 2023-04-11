import { createBrowserRouter } from 'react-router-dom';
import { StatusMap } from './components/StatusMap/StatusMap';
import StatusSummary from './containers/StatusSummary';

const router = createBrowserRouter([
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
]);

export default router;
