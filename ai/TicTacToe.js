// Utils
import { getWinner } from "../utils/TicTacToe";

// Constants
import { SCORE } from "../constants/TicTacToe";

// Utility function to get the score of current state of the board
export const evaluate = (board) => SCORE[getWinner(board)];

// MiniMax algorithm with Alpha-Beta pruning
// returns the score based on depth of the state
export const minimax = (board, level, alpha, beta, isMax) => {

    const score = evaluate(board); // get the score of current state of the board

    // if current state is a dead state then return score
    if (score !== 0) {
        return score / level;
    }

    // if no moves left
    if (level === 9) {
        return 0;
    }

    let bestScore = isMax ? -Infinity : Infinity; // initializing best score achieved till now to extreme values

    for (let i = 0; i < 9; i++) { // iterate through all possible positions on the board
        if (!board[i]) { // if position "i" on the board is empty
            board[i] = isMax ? 'X' : 'O'; // place the value
            if (isMax) {
                bestScore = Math.max(bestScore, minimax(board, level + 1, alpha, beta, !isMax)); // updating best score
                alpha = Math.max(alpha, bestScore); // updating alpha
            } else {
                bestScore = Math.min(bestScore, minimax(board, level + 1, alpha, beta, !isMax)); // updating best score
                beta = Math.min(beta, bestScore); // updating beta
            }
            board[i] = null; // replace back the original value
            if (beta <= alpha) { // prune condition
                break;
            }
        }
    }

    return bestScore / level; // return the score of current state of the board

};