// React
import React, { useState, useEffect } from 'react';

// Next
import Head from 'next/head';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

// Components
import DisplayScores from '../components/RockPaperScissors/DisplayScores';
import DisplayChoices from '../components/RockPaperScissors/DisplayChoices';
import ChooseChoice from '../components/RockPaperScissors/ChooseChoice';
import GameOver from '../components/RockPaperScissors/GameOver';

// Utils
import { getWinner } from '../utils/RockPaperScissors';

// Constants
import { choices, initialGameState } from '../constants/RockPaperScissors';

const RockPaperScissors = () => {

    const [gameState, setGameState] = useState(initialGameState);
    const winner = getWinner(gameState.playerChoice, gameState.computerChoice);

    const [chooseChoiceDialogOpen, setChooseChoiceDialogOpen] = useState(false);
    const handleChooseChoiceDialogOpen = () => {
        setChooseChoiceDialogOpen(true);
    };
    const handleChooseChoiceDialogClose = () => {
        setChooseChoiceDialogOpen(false);
    };

    const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
    const handleGameOverDialogOpen = () => {
        setGameOverDialogOpen(true);
    };
    const handleGameOverDialogClose = () => {
        setGameOverDialogOpen(false);
    };

    const handleChoiceClick = (playerChoice) => {
        setGameState({
            ...gameState,
            animation: true
        });
        setTimeout(() => {
            setGameState({
                ...gameState,
                animation: false,
                playerChoice,
                computerChoice: Object.keys(choices)[Math.floor(Math.random() * Object.keys(choices).length)]
            });
        }, 2000);
    };

    const playAgain = () => {
        setGameState({
            ...initialGameState,
            playerScore: gameState.playerScore,
            tieScore: gameState.tieScore,
            computerScore: gameState.computerScore
        });
        handleGameOverDialogClose();
        handleChooseChoiceDialogOpen();
    };

    useEffect(() => {
        handleChooseChoiceDialogOpen();
    }, []);

    useEffect(() => {
        if (winner) {
            setTimeout(() => {
                setGameState({
                    ...gameState,
                    playerScore: winner === "Player" ? gameState.playerScore + 1 : gameState.playerScore,
                    tieScore: winner === "Tie" ? gameState.tieScore + 1 : gameState.tieScore,
                    computerScore: winner === "Computer" ? gameState.computerScore + 1 : gameState.computerScore,
                });
                handleGameOverDialogOpen();
            }, 1000);
        }
    }, [winner]);

    return (
        <>
            <Head>
                <title>Rock Paper Scissors</title>
            </Head>
            <Box mb={2} fontWeight={500}>
                <Typography variant="h2" align="center">
                    Rock Paper Scissors
                </Typography>
            </Box>
            <DisplayScores playerScore={gameState.playerScore} tieScore={gameState.tieScore} computerScore={gameState.computerScore} />
            <DisplayChoices animation={gameState.animation} playerChoice={gameState.playerChoice} computerChoice={gameState.computerChoice} />
            <ChooseChoice chooseChoiceDialogOpen={chooseChoiceDialogOpen} handleChooseChoiceDialogClose={handleChooseChoiceDialogClose} handleChoiceClick={handleChoiceClick} />
            {gameOverDialogOpen && <GameOver gameOverDialogOpen={gameOverDialogOpen} handleGameOverDialogClose={handleGameOverDialogClose} winner={winner} playAgain={playAgain} />}
        </>
    );

};

export default RockPaperScissors;