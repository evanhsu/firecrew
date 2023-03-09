import Moment from 'moment';

export const getStatusSummaryTableStyle = () => ({
    border: '2px solid black',
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: 1000,
});

export const getCrewRowStyle = (props) => {
    const stale =
        props.crewRow &&
        Moment.utc(props.crewRow.get('updated_at'))
            .add(18, 'hours')
            .isSameOrBefore(Moment.now());
    let backgroundColor = stale ? '#fbec5d' : 'white';
    if (props.isSelected) {
        backgroundColor = '#337ab7';
    }

    return {
        root: {
            borderBottom: '2px solid black',
            transition: 'background-color 100ms ease-in, color 100ms ease-in',
            backgroundColor,
            color: props.isSelected ? 'white' : 'black',
            whiteSpace: 'unset',
        },
        resourceCell: {
            paddingLeft: 0,
            paddingRight: 0,
            borderLeft: '1px dashed gray',
            whiteSpace: 'unset',
        },
        intelCell: {
            border: '1px dashed gray',
            whiteSpace: 'unset',
        },
    };
};

export const getCrewResourceRowStyle = (isLastRow) => ({
    borderBottom: isLastRow ? 'none' : '1px dashed gray',
    margin: 0,
    whiteSpace: 'unset',
    display: 'flex',
});
