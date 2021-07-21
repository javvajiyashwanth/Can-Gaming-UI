// React
import React from 'react';

// Material UI
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const DisplayScores = ({ playerScore, tieScore, computerScore }) => {

    const theme = useTheme();

    const scores = [
        {
            title: "Player",
            style: {
                color: theme.palette.getContrastText(theme.palette.primary.main),
                backgroundColor: theme.palette.primary.main
            },
            value: playerScore
        },
        {
            title: "Tie",
            style: {
                color: theme.palette.getContrastText(theme.palette.grey[300]),
                backgroundColor: theme.palette.grey[300]
            },
            value: tieScore
        },
        {
            title: "Computer",
            style: {
                color: theme.palette.getContrastText(theme.palette.secondary.main),
                backgroundColor: theme.palette.secondary.main
            },
            value: computerScore
        }
    ];

    return (
        <Box mb={3}>
            <Grid container spacing={2} alignItems="center" justify="space-around">
                {
                    scores.map(score => (
                        <Grid key={score.title} item xs={4} md={3} lg={2}>
                            <Card>
                                <CardHeader
                                    title={score.title}
                                    titleTypographyProps={{ align: 'center' }}
                                    style={score.style}
                                />
                                <CardContent style={{ paddingBottom: "16px" }}>
                                    <Typography component="h4" variant="h4" color="textPrimary" align="center">
                                        {score.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );

};

export default DisplayScores;