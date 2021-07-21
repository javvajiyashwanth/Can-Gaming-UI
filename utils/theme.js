// Material UI
// Core
import { createMuiTheme } from "@material-ui/core/styles";

const baseTheme = {
    typography: {
        fontFamily: [
            '"Segeo UI"',
            'Roboto',
            '"Helvetica Neue"'
        ].join(',')
    },
    palette: {
    }
};

export const darkTheme = createMuiTheme({
    ...baseTheme,
    palette: {
        ...baseTheme.palette,
        type: 'dark'
    }
});

export const lightTheme = createMuiTheme({
    ...baseTheme,
    palette: {
        ...baseTheme.palette,
        type: 'light'
    }
});