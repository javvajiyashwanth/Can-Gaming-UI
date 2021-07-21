// React
import React from 'react';

// Next
import { useRouter } from 'next/router';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    exit: {
        color: theme.palette.getContrastText(theme.palette.error.main),
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark
        }
    }
}));

const result = {
    "Player": "You Won!!!",
    "Computer": "You Lost!!!",
    "Tie": "It's a Tie"
};

const GameOver = ({ gameOverDialogOpen, handleGameOverDialogClose, winner, playAgain }) => {

    const router = useRouter();
    const classes = useStyles();

    return (
        <Dialog
            open={gameOverDialogOpen}
            onClose={handleGameOverDialogClose}
            disableBackdropClick
            disableEscapeKeyDown
        >
            <DialogTitle disableTypography>
                <Typography variant="h4" align="center">Game Over</Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="h5" align="center">
                    {result[winner]}
                </Typography>
            </DialogContent>
            <DialogContent>
                <Grid container spacing={2} alignItems="center" justify="space-around">
                    <Grid item>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            onClick={playAgain}
                        >
                            Play Again
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            className={classes.exit}
                            size="large"
                            variant="contained"
                            onClick={() => {
                                router.push('/');
                            }}
                        >
                            Exit
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );

};

export default GameOver;