import { fromJS, List } from 'immutable';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import StatusSummaryTable from '../../components/StatusSummaryTable';
import StatusSummaryTableClassic from '../../components/StatusSummaryTableClassic';
import { SummaryUiMigrationBanner } from '../../components/SummaryUiMigrationBanner';
import {
    fetchSummary,
    receiveCrewStatusUpdate,
    receiveResourceStatusUpdate,
} from './actions';
import { selectSummary } from './selectors';
import { useSummaryUiPreference } from './useSummaryUiPreference';

export type StatusSummaryProps = {
    crews: List<any>;
    fetchSummary: () => void;
    receiveCrewStatusUpdate: (event: any) => void;
    receiveResourceStatusUpdate: (event: any) => void;
};

const StatusSummary = (props: StatusSummaryProps) => {
    const {
        uiMode,
        showBanner,
        switchToNewUi,
        revertToLegacyUi,
        dismissBanner,
    } = useSummaryUiPreference();

    useEffect(() => {
        props.fetchSummary();

        window.Echo.channel('publicStatusUpdates').listen(
            'CrewStatusUpdated',
            (event: any) => {
                props.receiveCrewStatusUpdate(event);
            }
        );

        window.Echo.channel('publicStatusUpdates').listen(
            'ResourceStatusUpdated',
            (event: any) => {
                props.receiveResourceStatusUpdate(event);
            }
        );
    }, []);

    return (
        <>
            {showBanner && (
                <SummaryUiMigrationBanner
                    uiMode={uiMode}
                    onTryNewUi={switchToNewUi}
                    onRevertToLegacy={revertToLegacyUi}
                    onDismiss={dismissBanner}
                />
            )}
            {uiMode === 'legacy' ? (
                <StatusSummaryTableClassic crews={props.crews} />
            ) : (
                <StatusSummaryTable crews={props.crews} />
            )}
        </>
    );
};

StatusSummary.propTypes = {
    crews: ImmutablePropTypes.list,
    fetchSummary: PropTypes.func.isRequired,
    receiveCrewStatusUpdate: PropTypes.func.isRequired,
    receiveResourceStatusUpdate: PropTypes.func.isRequired,
};

StatusSummary.defaultProps = {
    crews: fromJS([]),
};

function mapStateToProps(state: any) {
    return {
        crews: selectSummary()(state),
    };
}

function mapDispatchToProps(dispatch: any) {
    return {
        fetchSummary: () => dispatch(fetchSummary()),
        receiveCrewStatusUpdate: (payload: any) =>
            dispatch(receiveCrewStatusUpdate(payload)),
        receiveResourceStatusUpdate: (payload: any) =>
            dispatch(receiveResourceStatusUpdate(payload)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusSummary);
