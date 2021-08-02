// React
import React from 'react';

// Material UI
// Core
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

// CSS
// @ts-ignore
import styles from '../../styles/TicTacToe/Board.module.css';

const Board = ({ board, isYourTurn, handleCellClick }) => {

	// Theme
	const theme = useTheme();

	return (
		<Box
			className={styles.board}
			boxShadow={3}
		>
			{
				board.map((value, index) => (
					<Button
						key={index}
						className={styles.cell}
						onClick={() => {
							if (isYourTurn) handleCellClick(index);
						}}
						style={{
							color: value === 'X' ? theme.palette.error.main : theme.palette.primary.main
						}}
					>
						{value}
					</Button>
				))
			}
		</Box>
	);

};

export default Board;