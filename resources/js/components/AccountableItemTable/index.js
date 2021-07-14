import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutableProptypes from 'react-immutable-proptypes';
import { List, ListItem } from 'material-ui/List';
import { Paper } from 'material-ui';
import AccountableItemForm from '../AccountableItemForm';
import moment from 'moment';

const cellStyle = {
  paddingLeft: 5,
  paddingRight: 5,
  paddingVertical: 0,
  minHeight: 10,
  display: 'inline-block',
  overflowWrap: 'break-word',
  textOverflow: 'ellipsis',
};

const rowStyle = {
  fontSize: 14,
  minHeight: 10,
  padding: 3,
};

const selectedRowStyle = {
  height: 0,
  overflow: 'hidden',
  padding: 0,
};

const headerRowStyle = {
  fontSize: 16,
  fontWeight: 600,
  minHeight: 20,
};

const smColWidth = { width: 70 };
const mdColWidth = { width: 120 };
const lgColWidth = { width: 180 };

const smColStyle = Object.assign({}, cellStyle, smColWidth);
const mdColStyle = Object.assign({}, cellStyle, mdColWidth);
const lgColStyle = Object.assign({}, cellStyle, lgColWidth);

const HeaderRow = () => (
  <div color="#888888" style={headerRowStyle}>
    <span style={mdColStyle}>Serial #</span>
    <span style={lgColStyle}>Description</span>
    <span style={smColStyle}>Size</span>
    <span style={smColStyle}>Color</span>
    <span style={mdColStyle}>Issued To</span>
    <span style={smColStyle}>Usable</span>
    <span style={mdColStyle}>Condition</span>
    <span style={lgColStyle}>Note</span>
    <span style={lgColStyle}>Updated</span>
  </div>
);

const ItemRow = ({ itemId, item, onTouchTap, selectedItemRow, onSubmit }) => (
  <ListItem
    key={`item-${itemId}`}
    style={selectedItemRow === parseInt(itemId, 10) ? selectedRowStyle : rowStyle}
    innerDivStyle={rowStyle}
    open={selectedItemRow === parseInt(itemId, 10)}
    onTouchTap={() => onTouchTap(itemId)}
    nestedItems={[
      <ListItem key={`expanded-item-${itemId}`} disabled style={rowStyle}>
        <Paper zDepth={2} style={{ backgroundColor: '#fafafa' }}>
          <AccountableItemForm
            key={`item-${itemId}-form`}
            form={`item-${itemId}-form`}
            initialValues={item}
            onSubmit={onSubmit(itemId)}
          />
        </Paper>
      </ListItem>,
    		]}
  >
    <span style={mdColStyle}>{item.get('serial_number')}</span>
    <span style={lgColStyle}>{item.get('description')}</span>
    <span style={smColStyle}>{item.get('item_size')}</span>
    <span style={smColStyle}>{item.get('color')}</span>
    <span style={mdColStyle}>{item.get('checked_out_to') && item.getIn(['checked_outTo', 'full_name'])}</span>
    <span style={smColStyle}>{item.get('usable')}</span>
    <span style={mdColStyle}>{item.get('condition')}</span>
    <span style={lgColStyle}>{item.get('note')}</span>
    <span style={lgColStyle}>{moment(item.get('updated_at')).format('YYYY-MM-DD')}</span>
  </ListItem>
);

class AccountableItemTable extends PureComponent {
  render() {
    if (this.props.items.size === 0) {
      return null;
    }
    return (
      <div>
        <HeaderRow />
        <List>
          {this.props.items.map((item) => (
            <ItemRow
              key={item.get('id')}
              itemId={item.get('id')}
              item={item.get('attributes')}
              onTouchTap={this.props.onRowClick}
              selectedItemRow={this.props.selectedItemRow}
              onSubmit={this.props.onUpdateItem}
            />
          ))}
        </List>
      </div>
    );
  }
}

AccountableItemTable.PropTypes = {
  items: ImmutableProptypes.map,
  onRowClick: PropTypes.func,
  selectedItemRow: PropTypes.number,
  onUpdateItem: PropTypes.func,
};

export default AccountableItemTable;

