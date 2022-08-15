import * as React from "react";
import Head from "next/head"
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import AppBar from "../components/AppBar";
import Copyright from "../src/Copyright";
import parse from "html-react-parser";
import Parser from "rss-parser";
import Moment from "react-moment";

export default function Index({ feed, name }) {
  const [showNumber, setShowNumber] = React.useState(6);

  function increaseShowNumber() {
    setShowNumber(showNumber + 6);
  }

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <AppBar name={name} />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {name}
          </Typography>
          <Grid container spacing={2}>
            {feed.items.filter((item, index) => ((index < showNumber) ? true : false)).map((item) => (
              <Grid item xs={12} sm={6} lg={4} key={item.link}>
                <img
                  src={item.image[0]["$"].href}
                  alt={item.title}
                  loading="lazy"
                  width="100%"
                  height="auto"
                />
                <h2>{item.title}</h2>
                <p><Moment date={item.isoDate} format="DD.MM.YYYY" /> &bull; Tuotantokausi {item.season} &bull; Jakso {item.episode}</p>
              </Grid>
            ))}
          </Grid>

          {(showNumber < feed.items.length) ?
            <Button variant="contained" onClick={increaseShowNumber}>Lataa lisää</Button>  : ''
          }
          
          <Copyright />
        </Box>
      </Container>
    </>
  );
}

async function getFeed(feedUrl) {
  let parser = new Parser({
    customFields: {
      item: [
        ["description", "content"],
        ["itunes:explicit", "explicit"],
        ["itunes:duration", "duration"],
        ["itunes:image", "image", { keepArray: true }],
        ["itunes:season", "season"],
        ["itunes:episode", "episode"],
        ["itunes:episodeType", "episodeType"],
      ],
    },
  });
  let feed = await parser.parseURL(feedUrl);
  return feed;
}

export async function getStaticProps() {
  const feedName = process.env.PODCAST_NAME
  const detailedFeed = await getFeed(process.env.PODCAST_RSS_URL);

  return {
    props: {
      feed: detailedFeed,
      name: feedName
    },
    revalidate: 60,
  };
}
