// Constants
import { choices, winner } from "../constants/RockPaperScissors";

export const getWinner = (player, computer) => { return winner[(choices[player] - choices[computer] + 3) % 3]; };