export const INITIAL_BOARD_STATE = Array(9).fill(null);

export const INITIAL_GAME_STATE = {
    board: Array(9).fill(null),
    player: "",
    opponent: "",
    opponentName: "Opponent",
    isOpponentTurn: false,
    roomId: "",
};

export const SCORE = {
    "X": 1,
    "O": -1,
    "Tie": 0,
    null: 0,
};