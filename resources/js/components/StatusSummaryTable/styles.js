import Moment from 'moment';

/** Crew status is stale when last update was 18+ hours ago. */
export const isCrewStale = (crewRow) =>
    Boolean(
        crewRow &&
            Moment.utc(crewRow.get('updated_at'))
                .add(18, 'hours')
                .isSameOrBefore(Moment.now())
    );
