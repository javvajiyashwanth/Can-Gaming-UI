// React
import React from 'react';

// Material UI
// Core
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const CustomDialog = ({ open, handleClose, disableBackdropClick, disableEscapeKeyDown, title, direction = "row", content = undefined, helperText = undefined, actions }) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableBackdropClick={disableBackdropClick}
            disableEscapeKeyDown={disableEscapeKeyDown}
        >
            <DialogTitle disableTypography>
                <Typography variant="h4" align="center">{title}</Typography>
            </DialogTitle>
            {
                content && (
                    <DialogContent>
                        <Typography variant="h5" align="center">
                            {content}
                        </Typography>
                    </DialogContent>
                )
            }
            {
                helperText && (
                    <DialogContent>
                        {helperText}
                    </DialogContent>
                )
            }
            <DialogContent>
                {/* @ts-ignore */}
                <Grid container spacing={2} direction={direction} alignItems="center" justify="space-around">
                    {
                        actions.map((action, index) => (
                            <Grid item key={index}>
                                {action}
                            </Grid>
                        ))
                    }
                </Grid>
            </DialogContent>
        </Dialog>
    );

};

export default CustomDialog;