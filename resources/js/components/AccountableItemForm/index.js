import PropTypes from 'prop-types';
import React from 'react';
import { Field, Form, propTypes as reduxFormPropTypes, reduxForm } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';

import getStyles from './styles';
import validate from './validate';

function AccountableItemForm(props) {
  const styles = getStyles(props);
  const { handleSubmit, pristine, reset, submitting } = props; // Redux-form injects these props
  return (
    <Form
      form={props.form}
      onSubmit={handleSubmit(props.onSubmit)}
      style={[styles.root, props.style]}
    >
      <Field
        name="serial_number"
        component={TextField}
        floatingLabelText="Serial #"
        style={styles.mdCol}
        inputStyle={styles.mdTextField}
      />
      <Field
        name="description"
        component={TextField}
        floatingLabelText="Description"
        style={styles.lgCol}
        inputStyle={styles.lgTextField}
      />
      <Field
        name="item_size"
        component={TextField}
        floatingLabelText="Size"
        style={styles.smCol}
        inputStyle={styles.smTextField}
      />
      <Field
        name="color"
        component={TextField}
        floatingLabelText="Color"
        style={styles.smCol}
        inputStyle={styles.smTextField}
      />
      <Field
        name="issued_to"
        component={TextField}
        floatingLabelText="Issued To"
        style={styles.mdCol}
        inputStyle={styles.mdTextField}
      />
      <Field
        name="usable"
        component={TextField}
        floatingLabelText="Usable"
        style={styles.smCol}
        inputStyle={styles.smTextField}
      />
      <Field
        name="condition"
        component={TextField}
        floatingLabelText="Condition"
        style={styles.mdCol}
        inputStyle={styles.mdTextField}
      />
      <Field
        name="note"
        component={TextField}
        floatingLabelText="Note"
        style={styles.lgCol}
        inputStyle={styles.lgTextField}
      />
      <RaisedButton
        type="submit"
        label="Save"
        disabled={submitting}
        fullWidth
      />
    </Form>
  );
}

AccountableItemForm.propTypes = {
  ...reduxFormPropTypes,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onSubmit: PropTypes.func,
};

AccountableItemForm.defaultProps = {
  form: undefined,
  style: undefined,
  onSubmit: () => null,
};

export default reduxForm({
  validate,
})(AccountableItemForm);
