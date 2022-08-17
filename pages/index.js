import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { Container, Typography, Box, Grid, Button } from "@mui/material";
import Episode from "../components/Episode";
import Footer from "../components/Footer";
import Parser from "rss-parser";

export default function Index({ feed, name, year }) {
  const [showNumber, setShowNumber] = React.useState(6);
  let category = feed?.category[0]["$"].text;
  let subcategory = feed?.category[0]["itunes:category"][0]["$"].text;

  function increaseShowNumber() {
    setShowNumber(showNumber + 6);
  }

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>

      <Container maxWidth="xl">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Grid container alignItems="center" spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={8}>
              {feed?.title ? (
                <Typography variant="h2" component="h1" sx={{ mb: 4 }}>
                  {feed?.title}
                </Typography>
              ) : (
                ""
              )}

              {feed?.description ? (
                <Typography fontSize={22} sx={{ mb: 4 }}>
                  {feed?.description}
                </Typography>
              ) : (
                ""
              )}

              {feed?.author ? (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 0 }}>
                  {"Julkaisija: "}
                  <Typography variant="span" sx={{ fontWeight: "bold" }}>
                    {feed?.author}
                  </Typography>
                </Typography>
              ) : (
                ""
              )}

              {category || subcategory ? (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  {"Kategoria: "}
                  <Typography variant="span" sx={{ fontWeight: "bold" }}>
                    {category}
                    {subcategory ? (
                      <>
                        {" / "}
                        {subcategory}
                      </>
                    ) : (
                      ""
                    )}
                  </Typography>
                </Typography>
              ) : (
                ""
              )}

            </Grid>
            <Grid item display="flex" xs={12} sm={6} lg={4}>
              <Image
                src={feed?.image.url}
                alt={feed?.title}
                height={1246}
                width={1246}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {feed?.items
              .filter((item, index) => (index < showNumber ? true : false))
              .map((item) => (
                <Episode item={item} key={item.quid} />
              ))}
          </Grid>

          {showNumber < feed?.items?.length ? (
            <Box align="center" sx={{ mt: 8 }}>
              <Button variant="contained" onClick={increaseShowNumber}>
                {"Lataa lisää"}
              </Button>
            </Box>
          ) : (
            ""
          )}

          <Footer copyright={feed?.copyright} year={year} />
        </Box>
      </Container>
    </>
  );
}

async function getFeed(feedUrl) {
  let parser = new Parser({
    customFields: {
      feed: [["itunes:category", "category", { keepArray: true }]],
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
      year: new Date().getFullYear(),
    },
    revalidate: 60,
  };
}
