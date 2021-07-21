// React
import React from 'react';

// Material UI
// Core
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const DisplayScores = ({ scores }) => {

    return (
        <Box mb={3}>
            <Grid container spacing={2} alignItems="center" justify="space-around">
                {
                    scores.map((score, index) => (
                        <Grid key={index} item xs={4} md={3} lg={2}>
                            <Card>
                                <CardHeader
                                    className={score.class}
                                    title={score.title}
                                    titleTypographyProps={{ align: 'center' }}
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