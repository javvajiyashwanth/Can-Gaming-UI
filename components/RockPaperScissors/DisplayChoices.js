// React
import React from 'react';

// Next
import Image from 'next/image';

// Material UI
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';

// CSS
// @ts-ignore
import styles from '../../styles/RockPaperScissors/DisplayChoices.module.css';

const DisplayChoices = ({ animation, playerChoice, computerChoice }) => {

	return (
		<Grid container spacing={2} alignItems="center" justify="space-around">
			<Grid>
				<Image
					src={`/images/RockPaperScissorsAssets/${playerChoice}.png`}
					width={360}
					height={360}
					className={clsx(styles.player, {
						[styles.playerAnimation]: animation
					})}
				/>
			</Grid>
			<Grid>
				<Image
					src={`/images/RockPaperScissorsAssets/${computerChoice}.png`}
					width={360}
					height={360}
					className={clsx({
						[styles.computerAnimation]: animation
					})}
				/>
			</Grid>
		</Grid>
	);

};

export default DisplayChoices;