// React
import React from 'react';

// Material UI
// Core
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

const DisplayTurn = ({ isOpponentTurn, opponentName }) => {

    return (
        <Box m={3} display="flex" alignItems="center" justifyContent="center">
            <Button size="large" variant="contained" color={isOpponentTurn ? "secondary" : "primary"}>
                {isOpponentTurn ? `${opponentName}'s` : "Your"} Turn
            </Button>
        </Box>
    );

};

export default DisplayTurn;