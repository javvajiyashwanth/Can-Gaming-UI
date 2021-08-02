// AI
import { minimax } from "../ai/TicTacToe";

export const getMovesLeft = (board) => board.reduce((count, val) => (!val ? count + 1 : count), 0);

export const getWinner = (board) => {

	const winningCombinations = [
		[0, 1, 2], // row 1
		[3, 4, 5], // row 2
		[6, 7, 8], // row 3
		[0, 3, 6], // column 1
		[1, 4, 7], // column 2
		[2, 5, 8], // column 3
		[0, 4, 8], // positive diagonal
		[2, 4, 6], // negative diagonal
	];

	for (let winningCombination = 0; winningCombination < winningCombinations.length; winningCombination++) {
		const [i, j, k] = winningCombinations[winningCombination];
		if (board[i] && board[i] === board[j] && board[i] === board[k]) {
			return board[i];
		}
	};

	return getMovesLeft(board) ? null : "Tie";

};

export const findBestMove = (board) => {

	const level = 9 - getMovesLeft(board);
	const isMax = level % 2 === 0;

	let bestScore = isMax ? -Infinity : Infinity;
	let bestMove = null;

	if (level !== 9) {
		for (let i = 0; i < 9; i++) {
			if (!board[i]) {
				board[i] = isMax ? 'X' : 'O';
				let score = minimax(board, level + 1, -Infinity, Infinity, !isMax);
				board[i] = null;
				if ((isMax && score > bestScore) || (!isMax && score < bestScore)) {
					bestScore = score;
					bestMove = i;
				}
			}
		}
	}

	return bestMove;

};