// Utils
import { getMovesLeft, getWinner } from "../utils/TicTacToe";

// Constants
import { SCORE } from "../constants/TicTacToe";

// Utility function to get the score of current state of the board
export const evaluate = (board) => SCORE[getWinner(board)];

// MiniMax algorithm 
// returns the score based on depth of the state
export const minimax = (board, level, isMax) => {

    const score = evaluate(board); // get the score of current state of the board

    if (score !== 0) return score / level; // if current state is a dead state then return score

    if (!getMovesLeft(board)) return 0; // if no moves left

    let bestScore = isMax ? -Infinity : Infinity; // initializing best score achieved till now to extreme values

    for (let i = 0; i < 9; i++) { // iterate through all possible positions on the board
        if (board[i] === null) { // if position "i" on the board is empty
            board[i] = isMax ? 'X' : 'O'; // place the value
            // update best score achieved till now
            bestScore = isMax ?
                Math.max(bestScore, minimax(board, level + 1, !isMax)) :
                Math.min(bestScore, minimax(board, level + 1, !isMax));
            board[i] = null; // replace back the original value
        }
    }

    return bestScore / level; // return the score of current state of the board

};