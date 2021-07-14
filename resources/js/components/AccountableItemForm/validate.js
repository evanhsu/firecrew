const validate = (values, props) => { // eslint-disable-line no-unused-vars
  const errors = {};

  if (!values.get('serial_number') || (values.get('serial_number') === '')) {
    errors.serial_number = 'A serial number is required';
  }

  if (!values.get('description') || (values.get('description') === '')) {
    errors.description = 'A description is required';
  }

  return errors;
};

export default validate;
