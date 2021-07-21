// React
import React, { useState, useEffect } from 'react';

// Next
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

// Next Auth
import { getSession, signIn, useSession } from 'next-auth/client'

// Socket IO
import { io } from "socket.io-client";

// Material UI
// Core
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
// Icons
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import SendIcon from '@material-ui/icons/Send';
// Lab
import Alert from '@material-ui/lab/Alert';

// Components
import Board from '../components/TicTacToe/Board';
import CustomDialog from '../components/CustomDialog';
import CustomSnackbar from '../components/Alerts';
import DisplayScores from '../components/DisplayScores';
import DisplayTurn from '../components/DisplayTurn';

// Utils
import { getMovesLeft, findBestMove, getWinner } from '../utils/TicTacToe';
import { isNumberEntered, isValidRoomId } from '../utils/Global';

// Constants
import { INITIAL_BOARD_STATE } from '../constants/TicTacToe';
import { INITIAL_TWO_PLAYER_SCORES_STATE } from '../constants/Global';
import { useRootStyles, useColorStyles, useInputStyles, useCardStyles } from '../constants/Styles';

const TicTacToe = () => {

    // Next Auth Session
    const [session, loading] = useSession();
    if (typeof window !== 'undefined' && loading) return null;

    // CSS Classes
    const rootClasses = useRootStyles();
    const colorClasses = useColorStyles();
    const inputClasses = useInputStyles();
    const cardClasses = useCardStyles();

    // Next Router
    const router = useRouter();

    // Game Type
    const [gameType, setGameType] = useState(null);

    // Socket IO
    const [socket, setSocket] = useState(null);
    const [joinRoomId, setJoinRoomId] = useState("");
    const [shareRoomId, setShareRoomId] = useState("");

    // Game States
    const [isChoosingTurn, setIsChoosingTurn] = useState(false);
    const [isPlayAgainRequestSent, setIsPlayAgainRequestSent] = useState(false);
    const [isPlayAgainRequestReceived, setIsPlayAgainRequestReceived] = useState(false);
    const [board, setBoard] = useState(INITIAL_BOARD_STATE);
    const [player, setPlayer] = useState({
        name: "You",
        email: "",
        value: "",
    });
    const [opponent, setOpponent] = useState({
        name: "Opponent",
        email: "",
        value: "",
    });
    const [turn, setTurn] = useState("X");
    const [scores, setScores] = useState(INITIAL_TWO_PLAYER_SCORES_STATE);
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
    const addAlert = (alert) => setSnackPack((prev) => [...prev, alert]);

    // Start Game Dialog
    const [startGameDialogOpen, setStartGameDialogOpen] = useState(false);
    const handleStartGameDialogOpen = () => setStartGameDialogOpen(true);
    const handleStartGameDialogClose = () => setStartGameDialogOpen(false);

    // Waiting For Other Player Dialog
    const [waitingForOtherPlayerDialogOpen, setWaitingForOtherPlayerDialogOpen] = useState(false);
    const handleWaitingForOtherPlayerDialogOpen = () => setWaitingForOtherPlayerDialogOpen(true);
    const handleWaitingForOtherPlayerDialogClose = () => setWaitingForOtherPlayerDialogOpen(false);

    // Choose Turn Dialog
    const [chooseTurnDialogOpen, setChooseTurnDialogOpen] = useState(false);
    const handleChooseTurnDialogOpen = () => setChooseTurnDialogOpen(true);
    const handleChooseTurnDialogClose = () => setChooseTurnDialogOpen(false);

    // Game Over Dialog
    const [gameOverDialogOpen, setGameOverDialogOpen] = useState(false);
    const handleGameOverDialogOpen = () => setGameOverDialogOpen(true);
    const handleGameOverDialogClose = () => setGameOverDialogOpen(false);

    // Socket Emit Event Utility Function
    const handleSocketEmitEvents = (event, payload) => {
        const { name, email } = player;
        socket.emit(event, {
            ...payload,
            name,
            email,
            roomId: joinRoomId || shareRoomId,
        });
    }

    const placeValueOnBoard = (board, index, value) => {
        board[index] = value;
        setBoard(board);
        setTurn((turn) => turn === 'X' ? 'O' : 'X');
    };

    const handleCellClick = (index) => {
        if (winner || board[index]) return;
        if (gameType === "Single Player") {
            placeValueOnBoard([...board], index, player.value);
        } else if (gameType === "Multi Player") {
            handleSocketEmitEvents("Move", {
                index,
                placeValue: player.value
            });
        }
    };

    const playAgain = () => {
        if (!winner) return;
        if (gameType === "Single Player") {
            setBoard(INITIAL_BOARD_STATE);
            setTurn("X");
            setPlayer({
                ...player,
                value: "",
            });
            setOpponent({
                ...opponent,
                value: "",
            });
            handleGameOverDialogClose();
            handleChooseTurnDialogOpen();
        } else if (gameType === "Multi Player") {
            if (!isPlayAgainRequestReceived) handleSocketEmitEvents("Send Play Again Request");
            else handleSocketEmitEvents("Accept Play Again Request");
        }
    };

    const copyToClipboard = async (text) => {
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    };

    const getPlayAgainIcon = () => {
        if (isPlayAgainRequestReceived) return <DoneOutlineIcon />;
        if (isPlayAgainRequestSent) return <CircularProgress color="inherit" size={24} />;
        return undefined;
    };

    const getPlayAgainButtonText = () => {
        if (isPlayAgainRequestReceived) return "Accept Request";
        if (isPlayAgainRequestSent) return "Request Sent";
        return "Play Again";
    };

    useEffect(() => {
        if (session) {
            setPlayer({
                ...player,
                ...session.user,
            });
        }
    }, [session]);

    useEffect(() => {
        if (gameType === "Single Player") {
            setOpponent({
                ...opponent,
                name: "AI"
            });
            handleChooseTurnDialogOpen();
        } else if (gameType === "Multi Player") {
            if (!socket) {
                setSocket(io("http://localhost:4000", {
                    path: "/tic-tac-toe"
                }));
            }
        }
    }, [gameType]);

    useEffect(() => {
        if (socket) {
            handleStartGameDialogOpen();
            socket.on("Waiting", async ({ roomId }) => {
                await setShareRoomId(roomId);
                await setStartGameDialogOpen(false);
                await setChooseTurnDialogOpen(false);
                await setGameOverDialogOpen(false);
                setWaitingForOtherPlayerDialogOpen(true);
            });
            socket.on("Other Player Joined", async ({ otherPlayer }) => {
                await setOpponent({
                    ...otherPlayer,
                    value: "",
                });
                await setWaitingForOtherPlayerDialogOpen(false);
                setChooseTurnDialogOpen(true);
            });
            socket.on("Join Successful", async ({ otherPlayer }) => {
                await setOpponent({
                    ...otherPlayer,
                    value: "",
                });
                await setIsChoosingTurn(true);
                handleStartGameDialogClose();
                setChooseTurnDialogOpen(true);
            });
            socket.on("Set Players", ({ players }) => {
                setPlayer(players[0]);
                setOpponent(players[1]);
                setIsChoosingTurn(false);
                setChooseTurnDialogOpen(false);
            });
            socket.on("Update Game State", async ({ board, turn }) => {
                await setBoard(board);
                setTurn(turn);
            });
            socket.on("Play Again Request Sent", () => {
                setIsPlayAgainRequestSent(true);
            });
            socket.on("Play Again Request Received", () => {
                setIsPlayAgainRequestReceived(true);
            });
            socket.on("Play Again", async ({ players, isCreator }) => {
                await setBoard(INITIAL_BOARD_STATE);
                await setTurn("X");
                await setPlayer(players[0]);
                await setOpponent(players[1]);
                if (!isCreator) await setIsChoosingTurn(true);
                setGameOverDialogOpen(false);
                setIsPlayAgainRequestSent(false);
                setIsPlayAgainRequestReceived(false);
                setChooseTurnDialogOpen(true);
            });
            socket.on("Alert", ({ severity, message }) => {
                addAlert({
                    severity,
                    message
                });
            });
        }
    }, [socket]);

    useEffect(() => {
        if (gameType === "Single Player" && opponent.value === turn && !winner) {
            setTimeout(() => {
                const index = findBestMove(board, 9 - getMovesLeft(board));
                if (index !== null) {
                    placeValueOnBoard([...board], index, opponent.value);
                }
            }, 900);
        }
    }, [turn]);

    useEffect(() => {
        if (winner) {
            setScores({
                playerScore: winner !== "Tie" && player.value === turn ? scores.playerScore + 1 : scores.playerScore,
                tieScore: winner === "Tie" ? scores.tieScore + 1 : scores.tieScore,
                opponentScore: winner !== "Tie" && opponent.value === turn ? scores.opponentScore + 1 : scores.opponentScore,
            });
            handleGameOverDialogOpen();
        }
    }, [winner]);

    useEffect(() => {
        if (snackPack.length && !alertState) {
            setAlertState({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setAlertOpen(true);
        } else if (snackPack.length && alertState && alertOpen) {
            setAlertOpen(false);
        }
    }, [snackPack, alertState, alertOpen]);

    return (
        <>
            <Head>
                <title>Tic Tac Toe</title>
            </Head>
            {
                !gameType &&
                <div className={rootClasses.root}>
                    <Card className={cardClasses.card}>
                        <Image
                            className={cardClasses.thumbnail}
                            alt="Tic Tac Toe"
                            height="480"
                            width="480"
                            src="/images/TicTacToe.png"
                            title="Tic Tac Toe"
                        />
                        <div className={cardClasses.cardActions}>
                            <Button
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={() => setGameType("Single Player")}
                            >
                                Play vs AI
                            </Button>
                            <Button
                                size="large"
                                variant="contained"
                                color="secondary"
                                onClick={() => setGameType("Multi Player")}
                            >
                                Play with a Friend
                            </Button>
                        </div>
                    </Card>
                </div>
            }
            {
                gameType === "Multi Player" && !session &&
                <Alert
                    variant="filled"
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={() => signIn()}>
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
                    <Box mb={2} fontWeight={500}>
                        <Typography variant="h2" align="center">
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

                    <Board board={board} isYourTurn={player.value === turn} handleCellClick={handleCellClick} />

                    {(player.value || opponent.value) && !winner && <DisplayTurn isOpponentTurn={opponent.value === turn} opponentName={opponent.name} />}

                    {/* Start Game */}
                    <CustomDialog
                        open={startGameDialogOpen}
                        handleClose={handleStartGameDialogClose}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        title="Start Game"
                        direction="column"
                        actions={[
                            <Button
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    handleSocketEmitEvents("New Game");
                                    handleStartGameDialogClose();
                                }}
                            >
                                New Game
                            </Button>,
                            <Paper
                                component="form"
                                className={inputClasses.inputButtonGroupRoot}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    if (isValidRoomId(joinRoomId)) {
                                        handleSocketEmitEvents("Join Room", { roomId: joinRoomId });
                                    } else {
                                        addAlert({
                                            severity: "error",
                                            message: "Room ID should consist of 6 digits"
                                        });
                                    }
                                }}
                            >
                                <IconButton color="secondary" className={inputClasses.inputButtonGroupIconButton}>
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
                                    Send
                                </Button>
                            </Paper>
                        ]}
                    />

                    {/* Waiting for Other Player */}
                    <CustomDialog
                        open={waitingForOtherPlayerDialogOpen}
                        handleClose={handleWaitingForOtherPlayerDialogOpen}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        title="Waiting for other player to join.."
                        direction="column"
                        actions={[
                            <CircularProgress />,
                            <Paper component="form" className={inputClasses.inputButtonGroupRoot}>
                                <IconButton color="secondary" className={inputClasses.inputButtonGroupIconButton}>
                                    <MeetingRoomIcon />
                                </IconButton>
                                <InputBase
                                    className={inputClasses.inputButtonGroupInput}
                                    value={shareRoomId}
                                    readOnly
                                />
                                <Tooltip title="Copy to Clipboard">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        className={inputClasses.inputButtonGroupButton}
                                        onClick={() => {
                                            copyToClipboard(shareRoomId).then(() => {
                                                addAlert({
                                                    severity: "info",
                                                    message: "Room ID copied to clipboard"
                                                });
                                            });
                                        }}
                                    >
                                        Copy
                                    </Button>
                                </Tooltip>
                            </Paper>
                        ]}
                    />

                    {/* Choose Turn */}
                    <CustomDialog
                        open={chooseTurnDialogOpen}
                        handleClose={handleChooseTurnDialogClose}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        title={isChoosingTurn ? `${opponent.name} is choosing turn...` : "Who is going to play first?"}
                        actions={
                            isChoosingTurn ?
                                [<CircularProgress />] :
                                [
                                    <Button
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            if (gameType === "Single Player") {
                                                setPlayer({
                                                    ...player,
                                                    value: "X"
                                                });
                                                setOpponent({
                                                    ...opponent,
                                                    value: "O"
                                                });
                                            } else if (gameType === "Multi Player") {
                                                handleSocketEmitEvents("Set Turn", {
                                                    player: "X",
                                                    opponent: "O",
                                                });
                                            }
                                            handleChooseTurnDialogClose();
                                        }}
                                    >
                                        You
                                    </Button>,
                                    <Button
                                        size="large"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            if (gameType === "Single Player") {
                                                setPlayer({
                                                    ...player,
                                                    value: "O"
                                                });
                                                setOpponent({
                                                    ...opponent,
                                                    value: "X"
                                                });
                                            } else if (gameType === "Multi Player") {
                                                handleSocketEmitEvents("Set Turn", {
                                                    player: "O",
                                                    opponent: "X",
                                                });
                                            }
                                            handleChooseTurnDialogClose();
                                        }}
                                    >
                                        {opponent.name}
                                    </Button>
                                ]
                        }
                    />

                    {/* Game Over */}
                    <CustomDialog
                        open={gameOverDialogOpen}
                        handleClose={handleGameOverDialogClose}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        title="Game Over"
                        content={winner === "Tie" ? "It's a Tie!!!" : (opponent.value === turn ? "You Won!!!" : `${opponent.name} Won!!!`)}
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
                                onClick={() => router.push('/')}
                            >
                                Exit
                            </Button>
                        ]}
                    />

                    {/* Alerts */}
                    <CustomSnackbar open={alertOpen} handleClose={handleAlertClose} handleExited={handleAlertExited} alert={alertState} />
                </>
            }
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