const textFieldStyle = {
  fontSize: 14,
  paddingRight: 5,
};

const cellStyle = {
  paddingLeft: 5,
  paddingRight: 5,
  minHeight: 20,
  display: 'inline-block',
  overflowWrap: 'break-word',
  textOverflow: 'ellipsis',
};

const smColWidth = { width: 70 };
const mdColWidth = { width: 120 };
const lgColWidth = { width: 180 };

const getStyles = (props) => ({
  root: {
    //
  },
  smCol: Object.assign({}, cellStyle, smColWidth),
  mdCol: Object.assign({}, cellStyle, mdColWidth),
  lgCol: Object.assign({}, cellStyle, lgColWidth),
  smTextField: Object.assign({}, textFieldStyle, smColWidth),
  mdTextField: Object.assign({}, textFieldStyle, mdColWidth),
  lgTextField: Object.assign({}, textFieldStyle, lgColWidth),
});

export default getStyles;
