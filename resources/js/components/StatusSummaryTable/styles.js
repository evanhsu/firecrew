import Moment from 'moment';

/**
 * Aircraft status is stale when its latest status is more than 18 hours old.
 * Uses created_at (matching PHP freshness), with updated_at as fallback.
 */
export const isResourceStale = (resource) => {
    if (!resource) {
        return false;
    }

    const timestamp =
        resource.getIn(['latest_status', 'created_at']) ||
        resource.getIn(['latest_status', 'updated_at']);

    if (!timestamp) {
        return true;
    }

    return Moment.utc(timestamp).add(18, 'hours').isBefore(Moment.now());
};
