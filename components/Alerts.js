// React
import React from 'react';

// Material UI
// Core
import Snackbar from '@material-ui/core/Snackbar';
// Lab
import MuiAlert from '@material-ui/lab/Alert';

// Constants
import { ALERT_AUTO_HIDE_DURATION } from '../constants/Global';

const Alert = (props) => (
  <MuiAlert
    elevation={6}
    variant="filled"
    {...props}
  />
);

const CustomSnackbar = ({ open, handleClose, handleExited, alert }) => {

  return (
    <Snackbar
      open={open}
      autoHideDuration={ALERT_AUTO_HIDE_DURATION}
      onClose={handleClose}
      onExited={handleExited}
    >
      <Alert
        onClose={handleClose}
        severity={alert ? alert.severity : undefined}
      >
        {alert ? alert.message : undefined}
      </Alert>
    </Snackbar>
  );

};

export default CustomSnackbar;