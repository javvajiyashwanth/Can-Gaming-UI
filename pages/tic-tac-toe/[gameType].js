// React
import React, { useState, useEffect } from 'react';

// Next
import { useRouter } from 'next/router';
import Head from 'next/head';

// Next Auth
import { getSession, signIn, useSession } from 'next-auth/client';

// Socket IO
import { io } from "socket.io-client";

// Material UI
// Core
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// Icons
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SendIcon from '@material-ui/icons/Send';
// Lab
import Alert from '@material-ui/lab/Alert';

// Components
import Board from '../../components/TicTacToe/Board';
import CustomDialog from '../../components/CustomDialog';
import CustomSnackbar from '../../components/Alerts';
import DisplayScores from '../../components/DisplayScores';
import DisplayTurn from '../../components/DisplayTurn';

// Utils
import { findBestMove, getWinner } from '../../utils/TicTacToe';
import { isNumberEntered, isValidRoomId } from '../../utils/Global';

// Constants
import { INITIAL_BOARD_STATE } from '../../constants/TicTacToe';
import { INITIAL_PLAYER_STATE, INITIAL_TWO_PLAYER_SCORES_STATE } from '../../constants/Global';
import { useColorStyles, useInputStyles, useRootStyles } from '../../constants/Styles';

const TicTacToe = () => {

    // Next Auth Session
    const [session, loading] = useSession();
    if (typeof window !== 'undefined' && loading) return null;

    // CSS Classes
    const rootClasses = useRootStyles();
    const colorClasses = useColorStyles();
    const inputClasses = useInputStyles();

    // Next Router
    const router = useRouter();

    // Game Type
    const gameType = router.query.gameType || "";

    // Socket IO
    const [socket, setSocket] = useState(undefined);

    // Socket Room Id
    const [joinRoomId, setJoinRoomId] = useState(router.query.roomId || "");
    const [shareRoomId, setShareRoomId] = useState("");
    const [shareRoomIdCopyState, setShareRoomIdCopyState] = useState("Copy");

    // Game States
    const [isPlayAgainRequestSent, setIsPlayAgainRequestSent] = useState(false);
    const [isPlayAgainRequestReceived, setIsPlayAgainRequestReceived] = useState(false);
    const [board, setBoard] = useState(INITIAL_BOARD_STATE);
    const [player, setPlayer] = useState(INITIAL_PLAYER_STATE);
    const [opponent, setOpponent] = useState({
        ...INITIAL_PLAYER_STATE,
        name: "Opponent",
    });
    const [scores, setScores] = useState(INITIAL_TWO_PLAYER_SCORES_STATE);
    const [isYourTurn, setIsYourTurn] = useState(undefined);
    const winner = getWinner(board);

    // Alerts
    const [snackPack, setSnackPack] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);
    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlertOpen(false);
    };
    const [alertState, setAlertState] = useState(undefined);
    const handleAlertExited = () => setAlertState(undefined);
    const addAlert = (alert) => setSnackPack(prev => [...prev, alert]);

    // Dialogs
    const [dialogState, setDialogState] = useState(undefined);
    // Dialog Close
    const handleDialogClose = () => setDialogState(undefined);
    // Start Game Dialog
    const handleStartGameDialogOpen = () => setDialogState("Start Game");
    // Waiting For Other Player Dialog
    const handleWaitingForOtherPlayerDialogOpen = () => setDialogState("Waiting for Other Player");
    // Choose Turn Dialog
    const handleChooseTurnDialogOpen = () => setDialogState("Choose Turn");
    // Game Over Dialog
    const handleGameOverDialogOpen = () => setDialogState("Game Over");

    const getPlayAgainIcon = () => {
        if (isPlayAgainRequestReceived) {
            return <DoneOutlineIcon />;
        }
        if (isPlayAgainRequestSent) {
            return <CircularProgress color="inherit" size={24} />;
        }
        return undefined;
    };

    const getPlayAgainButtonText = () => {
        if (isPlayAgainRequestReceived) {
            return "Accept Request";
        }
        if (isPlayAgainRequestSent) {
            return "Request Sent";
        }
        return "Play Again";
    };

    // Socket Emit Event Utility Function
    const handleSocketEmitEvents = (event, payload) => {
        const { name, email } = player;
        socket.emit(event, {
            name,
            email,
            roomId: joinRoomId || shareRoomId,
            ...payload,
        });
    };

    const joinRoom = (roomId) => {
        if (isValidRoomId(roomId)) {
            handleSocketEmitEvents("Join Room", { roomId });
        } else {
            addAlert({
                severity: "error",
                message: "Room ID should consist of 6 digits"
            });
        }
    };

    const updatePlayerState = async (payload) => {
        await setPlayer(prevPlayer => ({
            ...prevPlayer,
            ...payload,
        }));
    };

    const updateOpponentState = async (payload) => {
        await setOpponent(prevOpponent => ({
            ...prevOpponent,
            ...payload,
        }));
    }

    const setTurn = async (playerValue, opponentValue, isEmit = false) => {
        updatePlayerState({
            value: playerValue,
        });
        updateOpponentState({
            value: opponentValue,
        });
        await setIsYourTurn(playerValue === 'X');
        if (isEmit) {
            handleSocketEmitEvents("Set Turn", {
                playerValue,
                opponentValue,
            });
        }
        handleDialogClose();
    }

    const toggleIsYourTurn = async () => await setIsYourTurn(prevIsYourTurn => !prevIsYourTurn);

    const placeValueAtIndexOnBoard = async (index, value) => {
        await setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[index] = value;
            return newBoard;
        });
    };

    const handleCellClick = async (index) => {
        if (winner || board[index]) {
            return;
        }
        placeValueAtIndexOnBoard(index, player.value);
        if (gameType === "Single Player") {
            toggleIsYourTurn();
        } else if (gameType === "Multi Player") {
            handleSocketEmitEvents("Move", {
                index,
                value: player.value,
            });
        }
    };

    const playAgain = () => {
        if (!winner) {
            return;
        }
        updatePlayerState({
            value: "",
        });
        updateOpponentState({
            value: "",
        });
        setIsYourTurn(undefined);
        setBoard(INITIAL_BOARD_STATE);
        if (gameType === "Single Player") {
            handleChooseTurnDialogOpen();
        } else if (gameType === "Multi Player") {
            if (!isPlayAgainRequestReceived) {
                handleSocketEmitEvents("Send Play Again Request");
            } else {
                handleSocketEmitEvents("Accept Play Again Request");
            }
        }
    };

    const exit = () => {
        if (socket) {
            socket.disconnect();
        }
        router.push("/tic-tac-toe");
    }

    useEffect(() => {
        if (gameType === "Single Player") {
            updatePlayerState({
                isHost: true,
            });
            updateOpponentState({
                name: "AI",
            });
            handleChooseTurnDialogOpen();
        } else if (gameType === "Multi Player" && session) {
            fetch('/api/socketio/tic-tac-toe').finally(() => setSocket(io()));
        }
    }, [gameType]);

    useEffect(() => {
        if (session) {
            const { name, email } = session.user;
            updatePlayerState({
                name,
                email,
            });
        }
    }, [session]);

    useEffect(() => {
        if (socket) {
            const { roomId } = router.query;
            if (roomId) {
                joinRoom(roomId);
            }
            else handleStartGameDialogOpen();

            socket.on("Waiting", async ({ roomId }) => {
                updatePlayerState({
                    isHost: true,
                });
                await setShareRoomId(roomId);
                handleWaitingForOtherPlayerDialogOpen();
            });

            socket.on("Join Successful", ({ otherPlayer }) => {
                updateOpponentState(otherPlayer);
                handleChooseTurnDialogOpen();
            });

            socket.on("Set Turn", ({ playerValue, opponentValue }) => setTurn(playerValue, opponentValue));

            socket.on("Update Game State", async ({ index, value }) => {
                placeValueAtIndexOnBoard(index, value);
                toggleIsYourTurn();
            });

            socket.on("Play Again Request Sent", () => setIsPlayAgainRequestSent(true));

            socket.on("Play Again Request Received", () => setIsPlayAgainRequestReceived(true));

            socket.on("Play Again", async () => {
                updatePlayerState({
                    value: "",
                });
                updateOpponentState({
                    value: "",
                });
                handleChooseTurnDialogOpen();
                setIsPlayAgainRequestSent(false);
                setIsPlayAgainRequestReceived(false);
            });

            socket.on("Alert", async ({ severity, message, cause, payload }) => {
                addAlert({
                    severity,
                    message,
                });
                switch (cause) {
                    case "Join Room":
                        handleStartGameDialogOpen();
                        break;
                    case "Player Left":
                        handleWaitingForOtherPlayerDialogOpen();
                        setScores(INITIAL_TWO_PLAYER_SCORES_STATE);
                        setBoard(INITIAL_BOARD_STATE);
                        break;
                    case "Host Left":
                        updatePlayerState({
                            isHost: true,
                        });
                        await setShareRoomId(payload.roomId);
                        handleWaitingForOtherPlayerDialogOpen();
                        setScores(INITIAL_TWO_PLAYER_SCORES_STATE);
                        setBoard(INITIAL_BOARD_STATE);
                        break;
                }
            });
        }
    }, [socket]);

    useEffect(() => {
        if (gameType === "Single Player" && !winner && isYourTurn === false) {
            const index = findBestMove(board);
            setTimeout(() => {
                if (index !== null) {
                    placeValueAtIndexOnBoard(index, opponent.value);
                }
                toggleIsYourTurn();
            }, 900);
        }
    }, [isYourTurn]);

    useEffect(() => {
        if (winner) {
            if (winner === "Tie") {
                setScores(prevScores => ({
                    ...prevScores,
                    tieScore: prevScores.tieScore + 1,
                }));
            } else {
                if (isYourTurn) {
                    setScores(prevScores => ({
                        ...prevScores,
                        playerScore: prevScores.playerScore + 1,
                    }));
                } else {
                    setScores(prevScores => ({
                        ...prevScores,
                        opponentScore: prevScores.opponentScore + 1,
                    }));
                }
            }
            handleGameOverDialogOpen();
        }
    }, [winner]);

    useEffect(() => {
        if (snackPack.length && !alertState) {
            setAlertState({ ...snackPack[0] });
            setSnackPack(prev => prev.slice(1));
            setAlertOpen(true);
        } else if (snackPack.length && alertState && alertOpen) {
            setAlertOpen(false);
        }
    }, [snackPack, alertState, alertOpen]);

    return (
        <>
            <Head>
                <title>Can Gaming | Tic Tac Toe</title>
            </Head>
            <div className={rootClasses.padding}>
                {
                    gameType === "Multi Player" && !session &&
                    <Alert
                        variant="filled"
                        severity="error"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => signIn()}>
                                Login
                            </Button>
                        }
                    >
                        To access Multi Player, you need to login
                    </Alert>
                }
                {
                    (gameType === "Single Player" || (gameType === "Multi Player" && session)) &&
                    <>
                        <Box
                            mb={2}
                            fontWeight={500}
                        >
                            <Typography
                                variant="h3"
                                align="center"
                            >
                                Tic Tac Toe
                            </Typography>
                        </Box>

                        <DisplayScores
                            scores={[
                                {
                                    title: "You",
                                    class: colorClasses.primary,
                                    value: scores.playerScore
                                },
                                {
                                    title: "Tie",
                                    class: colorClasses.tertiary,
                                    value: scores.tieScore
                                },
                                {
                                    title: opponent.name,
                                    class: colorClasses.secondary,
                                    value: scores.opponentScore
                                }
                            ]}
                        />

                        <Board
                            board={board}
                            isYourTurn={isYourTurn}
                            handleCellClick={handleCellClick}
                        />

                        {
                            (player.value || opponent.value) && !winner && (
                                <DisplayTurn
                                    isOpponentTurn={!isYourTurn}
                                    opponentName={opponent.name}
                                />
                            )
                        }

                        {/* Start Game */}
                        <CustomDialog
                            open={dialogState === "Start Game"}
                            handleClose={handleDialogClose}
                            disableBackdropClick={true}
                            disableEscapeKeyDown={true}
                            title="Start Game"
                            direction="column"
                            actions={[
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSocketEmitEvents("New Game")}
                                >
                                    New Game
                                </Button>,
                                <Paper
                                    component="form"
                                    className={inputClasses.inputButtonGroupRoot}
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        joinRoom(joinRoomId);
                                    }}
                                >
                                    <IconButton
                                        color="secondary"
                                        className={inputClasses.inputButtonGroupIconButton}
                                    >
                                        <MeetingRoomIcon />
                                    </IconButton>
                                    <InputBase
                                        className={inputClasses.inputButtonGroupInput}
                                        value={joinRoomId}
                                        placeholder="Enter Room ID"
                                        onChange={(event) => {
                                            if (event.target.value === '' || (event.target.value.length <= 6 && isNumberEntered(event.target.value))) {
                                                setJoinRoomId(event.target.value);
                                            }
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        endIcon={<SendIcon />}
                                        className={inputClasses.inputButtonGroupButton}
                                    >
                                        Join
                                    </Button>
                                </Paper>
                            ]}
                        />

                        {/* Waiting for Other Player */}
                        <CustomDialog
                            open={dialogState === "Waiting for Other Player"}
                            handleClose={handleDialogClose}
                            disableBackdropClick={true}
                            disableEscapeKeyDown={true}
                            title="Waiting for other player to join.."
                            direction="column"
                            actions={[
                                <CircularProgress />,
                                <Paper
                                    className={inputClasses.inputButtonGroupRoot}
                                    component="form"
                                >
                                    <IconButton
                                        className={inputClasses.inputButtonGroupIconButton}
                                        color="secondary"
                                    >
                                        <MeetingRoomIcon />
                                    </IconButton>
                                    <InputBase
                                        className={inputClasses.inputButtonGroupInput}
                                        value={shareRoomId}
                                        readOnly
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        className={inputClasses.inputButtonGroupButton}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                'Join tic-tac-toe game on Can Gaming\n'
                                                + `Join Room ${shareRoomId}\n\n`
                                                + `${process.env.NEXT_PUBLIC_BASE_URL}/tic-tac-toe/Multi%20Player?roomId=${shareRoomId}`
                                            );
                                            setShareRoomIdCopyState("Copied!");
                                            setTimeout(() => {
                                                setShareRoomIdCopyState("Copy");
                                            }, 5000);
                                        }}
                                    >
                                        {shareRoomIdCopyState}
                                    </Button>
                                </Paper>
                            ]}
                        />

                        {/* Choose Turn */}
                        <CustomDialog
                            open={dialogState === "Choose Turn"}
                            handleClose={handleDialogClose}
                            disableBackdropClick={true}
                            disableEscapeKeyDown={true}
                            title={!player.isHost ? `${opponent.name} is choosing turn...` : "Who is going to play first?"}
                            actions={
                                !player.isHost ?
                                    [<CircularProgress />] :
                                    [
                                        <Button
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setTurn('X', 'O', gameType === "Multi Player")}
                                        >
                                            You
                                        </Button>,
                                        <Button
                                            size="large"
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => setTurn('O', 'X', gameType === "Multi Player")}
                                        >
                                            {opponent.name}
                                        </Button>
                                    ]
                            }
                        />

                        {/* Game Over */}
                        <CustomDialog
                            open={dialogState === "Game Over"}
                            handleClose={handleDialogClose}
                            disableBackdropClick={true}
                            disableEscapeKeyDown={true}
                            title="Game Over"
                            content={winner === "Tie" ? "It's a Tie!!!" : (!isYourTurn ? "You Won!!!" : `${opponent.name} Won!!!`)}
                            helperText={isPlayAgainRequestReceived && <Alert severity="info">{opponent.name} want&apos;s to play again!</Alert>}
                            actions={[
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    startIcon={getPlayAgainIcon()}
                                    onClick={playAgain}
                                >
                                    {getPlayAgainButtonText()}
                                </Button>,
                                <Button
                                    className={colorClasses.error}
                                    size="large"
                                    variant="contained"
                                    onClick={exit}
                                >
                                    Exit
                                </Button>
                            ]}
                        />

                        {/* Alerts */}
                        <CustomSnackbar
                            open={alertOpen}
                            handleClose={handleAlertClose}
                            handleExited={handleAlertExited}
                            alert={alertState}
                        />
                    </>
                }
            </div>
        </>
    );

};

export async function getServerSideProps(context) {
    const session = await getSession(context);
    return {
        props: { session }
    }
}

export default TicTacToe;