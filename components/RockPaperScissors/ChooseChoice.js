// React
import React from 'react';

// Next
import Image from 'next/image';

// Material UI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const ChooseChoice = ({ chooseChoiceDialogOpen, handleChooseChoiceDialogClose, handleChoiceClick }) => {

	const choices = [
		{
			type: "Rock",
			color: "primary"
		},
		{
			type: "Paper",
			color: "default"
		},
		{
			type: "Rock",
			color: "secondary"
		}
	]

	return (
		<Dialog
			onClose={handleChooseChoiceDialogClose}
			open={chooseChoiceDialogOpen}
			disableBackdropClick
			disableEscapeKeyDown
		>
			<DialogTitle disableTypography>
				<Typography variant="h4" align="center">Pick your choice...</Typography>
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={2} alignItems="center" justify="space-around">
					{
						choices.map(choice => (
							<Grid key={choice.type} item container xs direction="column" spacing={2} alignItems="center">
								<Grid item>
									<Image src={`/images/RockPaperScissorsAssets/${choice.type}.png`} height={100} width={100} />
								</Grid>
								<Grid item>
									<Button
										size="large"
										variant="contained"
										// @ts-ignore
										color={choice.color}
										onClick={() => {
											handleChoiceClick(`${choice.type}`);
											handleChooseChoiceDialogClose();
										}}
									>
										{choice.type}
									</Button>
								</Grid>
							</Grid>
						))
					}
				</Grid>
			</DialogContent>
		</Dialog>
	);

};

export default ChooseChoice;