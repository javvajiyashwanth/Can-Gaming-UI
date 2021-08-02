// React
import React from 'react';

// Next
import Link from 'next/link';

// Material UI
// Core
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Constants
import { useGameThumbnailStyles } from '../constants/Styles';

const GameThumbnail = ({ game, mode }) => {

    // CSS Styles
    const gameThumbnailClasses = useGameThumbnailStyles();

    const { title, src, href } = game;

    return (
        <Link href={`${href}/${mode}`}>
            <Card>
                <CardActionArea>
                    <CardMedia
                        className={gameThumbnailClasses.media}
                        image={`/images/${src}`}
                        title={title}
                    />
                    <CardContent>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="h2"
                        >
                            {title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );

};

export default GameThumbnail;