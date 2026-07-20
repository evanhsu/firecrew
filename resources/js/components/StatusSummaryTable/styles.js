import Moment from 'moment';

/** Crew status is stale when last update was 18+ hours ago. */
export const isCrewStale = (crewRow) =>
    Boolean(
        crewRow &&
            Moment.utc(crewRow.get('updated_at'))
                .add(18, 'hours')
                .isSameOrBefore(Moment.now())
    );

/**
 * Aircraft status is stale when its latest status is 18+ hours old.
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

    return Moment.utc(timestamp)
        .add(18, 'hours')
        .isSameOrBefore(Moment.now());
};
