// React
import React, { useState } from 'react';

// Next
import Head from 'next/head';

// Material UI
// Core
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
// Lab
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

// Components
import GameThumbnail from '../components/GameThumbnail';

// Constants
import { useRootStyles } from '../constants/Styles';
import { GAMES } from '../constants/Global';

const Home = () => {

  const SINGLE_PLAYER_GAMES = GAMES.filter(game => game.modes.includes("Single Player"));
  const MULTI_PLAYER_GAMES = GAMES.filter(game => game.modes.includes("Multi Player"));

  // CSS Classes
  const rootClasses = useRootStyles();

  const theme = useTheme();

  const [tab, setTab] = useState("Single Player");

  const handleTabChange = (event, newTab) => setTab(newTab);

  return (
    <>
      <Head>
        <title>Can Gaming</title>
      </Head>
      <Paper>
        <TabContext value={tab}>
          <AppBar position="sticky">
            <TabList
              onChange={handleTabChange}
              indicatorColor={theme.palette.type === "dark" ? "secondary" : "primary"}
              variant="fullWidth"
              centered
            >
              <Tab label="Single Player" value="Single Player" />
              <Tab label="Multi Player" value="Multi Player" />
            </TabList>
          </AppBar>
          <TabPanel value="Single Player">
            <div className={rootClasses.flex}>
              {SINGLE_PLAYER_GAMES.map((game, index) => <GameThumbnail key={index} game={game} mode="Single Player" />)}
            </div>
          </TabPanel>
          <TabPanel value="Multi Player">
            <div className={rootClasses.flex}>
              {MULTI_PLAYER_GAMES.map((game, index) => <GameThumbnail key={index} game={game} mode="Multi Player" />)}
            </div>
          </TabPanel>
        </TabContext>
      </Paper>
    </>
  );

};

export default Home;