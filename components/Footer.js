// React
import React from 'react';

// Material UI
// Core
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    footer: {
        paddingTop: theme.spacing(2),
        marginTop: 'auto',
    },
}));

const Footer = () => {

    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Typography variant="body2" color="textSecondary" align="center">Copyright &copy; Can Gaming</Typography>
        </footer>
    );

};

export default Footer;