import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import TextField from 'material-ui/TextField';
import { ListItem } from 'material-ui/List';
import moment from 'moment';
import { IncrementButton, DecrementButton } from '../QuantityButtons';

const cellStyle = {
  paddingLeft: 5,
  paddingRight: 5,
  minHeight: 20,
  display: 'inline-block',
  overflowWrap: 'break-word',
  textOverflow: 'ellipsis',
};

const rowStyle = {
  minHeight: 20,
  padding: 0,
};

const headerRowStyle = {
  fontSize: 16,
  fontWeight: 600,
  minHeight: 20,
  padding: 0,
};

const formContainerStyle = {
  backgroundColor: '#fafafa',
  border: '3px solid #2eb2fd',
  boxShadow: '3px 3px 8px #888888',
  padding: 0,
};

const textFieldStyle = {
  fontSize: 14,
  paddingRight: 5,
};

const buttonStyle = {
  paddingHorizontal: 5,
  paddingVertical: 0,
};

const xsColWidth = { width: 35 };
const smColWidth = { width: 70 };
const mdColWidth = { width: 120 };
const lgColWidth = { width: 180 };

const xsColStyle = Object.assign({}, cellStyle, xsColWidth);
const smColStyle = Object.assign({}, cellStyle, smColWidth);
const mdColStyle = Object.assign({}, cellStyle, mdColWidth);
const lgColStyle = Object.assign({}, cellStyle, lgColWidth);

const xsTextFieldStyle = Object.assign({}, textFieldStyle, xsColWidth);
const smTextFieldStyle = Object.assign({}, textFieldStyle, smColWidth);
const mdTextFieldStyle = Object.assign({}, textFieldStyle, mdColWidth);
const lgTextFieldStyle = Object.assign({}, textFieldStyle, lgColWidth);

const HeaderRow = () => (
  <div color="#888888" style={headerRowStyle}>
    <span style={lgColStyle}>Qty</span>
    <span style={lgColStyle}>Description</span>
    <span style={smColStyle}>Size</span>
    <span style={smColStyle}>Color</span>
    <span style={mdColStyle}>Min Qty</span>
    <span style={mdColStyle}>Restock</span>
    <span style={lgColStyle}>Note</span>
    <span style={lgColStyle}>Source</span>
    <span style={lgColStyle}>Updated</span>
  </div>
);

const ItemRow = ({ itemId, item, onTouchTap, selectedItemRow, handleIncrement, handleDecrement }) => (
  <ListItem
    key={`item-${itemId}`}
    style={rowStyle}
    open={selectedItemRow === parseInt(itemId, 10)}
    onTouchTap={() => onTouchTap(itemId)}
    nestedItems={[
      <ListItem key={`expanded-item-${itemId}`} disabled style={rowStyle}>
        <span style={mdColStyle}>
          <DecrementButton onTouchTap={handleDecrement(itemId)} />
          <TextField
            floatingLabelText="Qty"
            style={xsColStyle}
            inputStyle={{ ...xsTextFieldStyle, textAlign: 'center' }}
            name={`item-${itemId}-quantity`}
            defaultValue={item.get('quantity')}
          />
          <IncrementButton onTouchTap={handleIncrement(itemId)} />
        </span>
        <span style={lgColStyle}><TextField floatingLabelText="Description" inputStyle={lgTextFieldStyle} name={`item-${itemId}-description`} 		defaultValue={item.description} /></span>
        <span style={smColStyle}><TextField floatingLabelText="Size" inputStyle={smTextFieldStyle} name={`item-${itemId}-item-size`} 		defaultValue={item.item_size} /></span>
        <span style={smColStyle}><TextField floatingLabelText="Color" inputStyle={smTextFieldStyle} name={`item-${itemId}-color`} 			defaultValue={item.color} /></span>
        <span style={mdColStyle}><TextField floatingLabelText="Min Qty" inputStyle={mdTextFieldStyle} name={`item-${itemId}-restock-trigger`} 	defaultValue={item.restock_trigger} /></span>
        <span style={mdColStyle}><TextField floatingLabelText="Restock" inputStyle={mdTextFieldStyle} name={`item-${itemId}-restock-to-quantity`} defaultValue={item.restock_to_quantity} /></span>
        <span style={lgColStyle}><TextField floatingLabelText="Note" inputStyle={lgTextFieldStyle} name={`item-${itemId}-note`} 			defaultValue={item.note} /></span>
        <span style={lgColStyle}><TextField floatingLabelText="Source" inputStyle={lgTextFieldStyle} name={`item-${itemId}-source`} 			defaultValue={item.source} /></span>
        <span style={lgColStyle}></span>
      </ListItem>,
    ]}
  >

    <span style={mdColStyle}>{item.get('quantity')}</span>
    <span style={lgColStyle}>{item.get('description')}</span>
    <span style={smColStyle}>{item.get('item_size')}</span>
    <span style={smColStyle}>{item.get('color')}</span>
    <span style={mdColStyle}>{item.get('restock_trigger')}</span>
    <span style={mdColStyle}>{item.get('restock_to_quantity')}</span>
    <span style={lgColStyle}>{item.get('note')}</span>
    <span style={lgColStyle}>{item.get('source')}</span>
    <span style={lgColStyle}>{moment(item.get('updated_at')).format('YYYY-MM-DD')}</span>
  </ListItem>
);

class BulkItemTable extends PureComponent {
  render() {
    if (!this.props.items || (this.props.items.size === 0)) {
      return null;
    }
    // const items = this.props.items.toArray(); // Convert from Immutable List to js Array
    return (
      <div>
        <HeaderRow />
        {this.props.items && this.props.items.map((item) => (
          <ItemRow
            key={item.get('id')}
            itemId={item.get('id')}
            item={item.get('attributes')}
            onTouchTap={this.props.onRowClick}
            handleIncrement={this.props.handleIncrement}
            handleDecrement={this.props.handleDecrement}
            selectedItemRow={this.props.selectedItemRow}
          />
        ))}
      </div>
    );
  }
}

BulkItemTable.PropTypes = {
  handleIncrement: PropTypes.func.isRequired,
  handleDecrement: PropTypes.func.isRequired,
  items: ImmutablePropTypes.map,
  onRowClick: PropTypes.func,
  selectedItemRow: PropTypes.number,
};

export default BulkItemTable;
