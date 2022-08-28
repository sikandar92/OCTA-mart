import { Step, StepLabel, Stepper } from '@material-ui/core';
import React from 'react';
import UseStyles from '../Utils/styles';

export default function CheckoutWizard({ activeStep = 0 }) {
  const classes = UseStyles();
  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step} </StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}
