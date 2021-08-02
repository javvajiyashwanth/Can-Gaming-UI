// React
import React from 'react';

// Next
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Material UI
// Core
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

// Constants
import { useRootStyles, useGameCardStyles } from '../../constants/Styles';

const TicTacToe = () => {

    // CSS Classes
    const rootClasses = useRootStyles();
    const gameCardClasses = useGameCardStyles();

    return (
        <>
            <Head>
                <title>Can Gaming | Tic Tac Toe</title>
            </Head>
            <div className={rootClasses.padding}>
                <div className={rootClasses.flex}>
                    <Card className={gameCardClasses.card}>
                        <Image
                            className={gameCardClasses.media}
                            alt="Tic Tac Toe"
                            height="480"
                            width="480"
                            src="/images/TicTacToe.png"
                            title="Tic Tac Toe"
                        />
                        <div className={gameCardClasses.cardActions}>
                            <Link href="/tic-tac-toe/Single Player">
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                >
                                    Play vs AI
                                </Button>
                            </Link>
                            <Link href="/tic-tac-toe/Multi Player">
                                <Button
                                    size="large"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Play with a Friend
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );

};

export default TicTacToe;