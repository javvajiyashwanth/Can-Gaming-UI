// React
import React from 'react';

// Next
import Link from 'next/link';

// Material UI
// Core
import Avatar from '@material-ui/core/Avatar';
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
                    <Link href={game.href}>
                        <ListItem button key={index}>
                            <ListItemAvatar>
                                <Avatar variant="rounded" src={`/images/${game.src}`} />
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: 'textPrimary',
                                }}
                                primary={game.title}
                            />
                        </ListItem>
                    </Link>
                ))
            }
        </List>
    );

};

export default GamesList;