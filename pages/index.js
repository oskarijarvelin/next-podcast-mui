import * as React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Container, Typography, Box, Grid, Button } from '@mui/material'
import AppBar from '../components/AppBar'
import Episode from '../components/Episode'
import Footer from '../components/Footer'
import Parser from 'rss-parser'

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
        <Box sx={{ mt: 8, mb: 4 }}>

          <Grid container alignItems="center" spacing={4} sx={{mb: 4}}>
            <Grid item xs={12} sm={6} lg={8}>
              <Typography variant="h2" component="h1" gutterBottom>
                {feed.title}
              </Typography>
              <Typography fontSize={22} sx={{ mr: 24, mb: 8 }}>
                {feed.description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <Image
                src={feed.image.url}
                alt={feed.title}
                height={1246}
                width={1246}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {feed.items
              .filter((item, index) => (index < showNumber ? true : false))
              .map((item) => (
                <Episode item={item} key={item.link} />
            ))}
          </Grid>

          {showNumber < feed.items.length ? (
            <Box align="center" sx={{mt: 8}}>
              <Button variant="contained" onClick={increaseShowNumber}>
                Lataa lisää
              </Button>
            </Box>
          ) : (
            ""
          )}

          <Footer name={name} />
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
  const feedName = process.env.PODCAST_NAME;
  const detailedFeed = await getFeed(process.env.PODCAST_RSS_URL);

  return {
    props: {
      feed: detailedFeed,
      name: feedName,
    },
    revalidate: 60,
  };
}
