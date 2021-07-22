// React
import React from 'react';

// Material UI
// Core
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

// Constants
import { GAMES } from '../constants/Global';

const GamesList = () => {

    return (
        <List>
            {
                GAMES.map((game, index) => (
                    <ListItem button component={Link} key={index} href={game.href}>
                        <ListItemAvatar>
                            <Avatar variant="rounded" src={`/images/${game.src}`} />
                        </ListItemAvatar>
                        <ListItemText
                            primaryTypographyProps={{
                                color: 'textPrimary',
                            }}
                            primary={game.name}
                        />
                    </ListItem>
                ))
            }
        </List>
    );

};

export default GamesList;