// AI
import { minimax } from "../ai/TicTacToe";

export const getMovesLeft = (board) => {

	let count = 0;

	for (let i = 0; i < 9; i++) {
		if (!board[i]) count++;
	}
	
	return count;

}

export const getWinner = (board) => {

	const winningCombinations = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let winningCombination = 0; winningCombination < winningCombinations.length; winningCombination++) {
		const [i, j, k] = winningCombinations[winningCombination];
		if (board[i] && board[i] === board[j] && board[i] === board[k]) return board[i];
	};

	return getMovesLeft(board) ? null : "Tie";

};

export const findBestMove = (board, level) => {

	let bestScore = level % 2 === 0 ? -Infinity : Infinity;
	let bestMove = null;

	if (getMovesLeft(board)) {
		for (let i = 0; i < 9; i++) {
			if (board[i] === null) {
				board[i] = level % 2 == 0 ? 'X' : 'O';
				let score = minimax(board, level + 1, level % 2 === 0 ? false : true);
				board[i] = null;
				if ((level % 2 === 0 && score > bestScore) || (level % 2 !== 0 && score < bestScore)) {
					bestScore = score;
					bestMove = i;
				}
			}
		}
	}

	return bestMove;

};