// Material UI
// Core
import { makeStyles } from '@material-ui/core/styles';

export const useColorStyles = makeStyles((theme) => ({
    primary: {
        color: theme.palette.getContrastText(theme.palette.primary.main),
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    secondary: {
        color: theme.palette.getContrastText(theme.palette.secondary.main),
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
    },
    tertiary: {
        color: theme.palette.getContrastText(theme.palette.grey[300]),
        backgroundColor: theme.palette.grey[300],
        '&:hover': {
            backgroundColor: theme.palette.grey.A100,
        },
    },
    error: {
        color: theme.palette.getContrastText(theme.palette.error.main),
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    },
}));

export const useGameCardStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        flexDirection: "row",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
        },
    },
    media: {
        maxWidth: 400,
        maxHeight: 400,
    },
    cardActions: {
        padding: theme.spacing(4),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "row",
        },
        '& button': {
            margin: '6px',
        },
    },
}));

export const useGameThumbnailStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        justifyContent: "space-around",
    },
    media: {
        height: 160,
    },
}));

export const useInputStyles = makeStyles((theme) => ({
    inputButtonGroupRoot: {
        display: 'flex',
        alignItems: 'center',
        color: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
    },
    inputButtonGroupInput: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    inputButtonGroupIconButton: {
        padding: theme.spacing(1),
    },
    inputButtonGroupButton: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
}));

export const useRootStyles = makeStyles((theme) => ({
    padding: {
        padding: theme.spacing(3),
    },
    flex: {
        display: "flex",
        justifyContent: "space-around",
    },
}));