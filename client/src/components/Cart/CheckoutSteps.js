import React from 'react'
import Typography from "@material-ui/core/Typography"
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import "./Shipping.css"

function CheckoutSteps({ activeStep }) {
    const steps = [{
        label: <Typography>Shipping Details</Typography>,
        icon: <LocalShippingIcon />
    },
    {
        label: <Typography>Confirm Order</Typography>,
        icon: <LibraryAddCheckIcon />
    },
    {
        label: <Typography>Payment</Typography>,
        icon: <AccountBalanceIcon />
    }
    ]
    const stepStyles = {
        boxSizing: "border-box"
    }
    return (
        <>
            <Stepper alternativeLabel activeStep={activeStep} style={stepStyles} className="step_style" >
                {
                    steps.map((item, index) => {
                        return <Step key={index} active={activeStep === index ? true : false} completed={activeStep >= index ? true : false}>
                            <StepLabel icon={item.icon} style={{ color: activeStep >= index ? "blue" : "rgba(0, 0, 0, 0.449)" }}>
                                {item.label}
                            </StepLabel>
                        </Step>
                    })
                }
            </Stepper>
        </>
    )
}

export default CheckoutSteps
