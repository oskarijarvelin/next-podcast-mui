import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Container, Typography, Box, Grid, Stack, Button } from "@mui/material";
import { SiAnchor } from "react-icons/si";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import Link from "../../src/Link";
import Footer from "../../components/Footer";
import Parser from "rss-parser";
import Moment from "react-moment";
import parse from "html-react-parser";
import AudioPlayer from "react-h5-audio-player";

export default function Index({ feed, year }) {
  const [track, setTrack] = React.useState(feed?.items[0]);
  const [player, showPlayer] = React.useState(false);

  const router = useRouter();
  const { id } = router.query;

  const itemIndex = feed?.items.findIndex((i) => i.episode == id);

  function playThisTrack(t) {
    showPlayer(true);
    setTrack(t);
  }

  function createMetaDescription(string) {
    string = string.replace(/(?:https?|ftp):\/\/[\S]+/g, '[linkki]').replace(/(?:\r\n|\r|\n)/g, ' ');
    string = string.substr(0, 160);
    string = string.substr(0, Math.min(string.length, string.lastIndexOf(" ")))
    return string;
  }

  return (
    <>
      <Head>
        <title>{feed?.items[itemIndex]?.title + " - " + feed?.title}</title>
        <meta name="description" content={createMetaDescription(feed?.items[itemIndex]?.contentSnippet)}></meta>
      </Head>

      <Container maxWidth="xl">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Grid
            container
            alignItems="start"
            spacing={{ xs: 2, md: 4, lg: 8 }}
            sx={{ mb: { xs: 2, md: 4, lg: 8 } }}
          >
            <Grid item xs={12} sm={6} lg={8}>
              <Typography variant="h2" component="h1" sx={{ mb: 4 }}>
                {feed?.items[itemIndex]?.title}
              </Typography>

              <Box sx={{ py: 2 }}>
                <Stack spacing={2} direction="row">
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ pt: 1 }}
                      startIcon={<FaArrowLeft />}
                    >
                      {"Takaisin etusivulle"}
                    </Button>
                  </Link>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ pt: 1 }}
                    startIcon={<FaPlay />}
                    onClick={() => playThisTrack(feed?.items[itemIndex])}
                  >
                    {"Kuuntele"}
                  </Button>
                  <Link
                    href={feed?.items[itemIndex]?.link}
                    target="_blank"
                    rel="noopener"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      sx={{ pt: 1 }}
                      startIcon={<SiAnchor />}
                    >
                      {"Avaa Anchorissa"}
                    </Button>
                  </Link>
                </Stack>
              </Box>

              {feed?.items[itemIndex]?.content ? (
                <Typography variant="div" fontSize={22} sx={{ mb: 4 }}>
                  {parse(feed?.items[itemIndex]?.content)}
                </Typography>
              ) : (
                ""
              )}

              {feed?.items[itemIndex]?.isoDate ? (
                <Typography variant="h6" color="grey.600" sx={{ mb: 0 }}>
                  {"Julkaistu: "}
                  <Typography variant="span" sx={{ fontWeight: "bold" }}>
                    <Moment
                      date={feed?.items[itemIndex]?.isoDate}
                      format="DD.MM.YYYY"
                    />
                  </Typography>
                </Typography>
              ) : (
                ""
              )}

              {feed?.items[itemIndex]?.season ? (
                <Typography variant="h6" color="grey.600" sx={{ mb: 0 }}>
                  {"Tuotantokausi: "}
                  <Typography variant="span" sx={{ fontWeight: "bold" }}>
                    {feed?.items[itemIndex]?.season}
                  </Typography>
                </Typography>
              ) : (
                ""
              )}

              {feed?.items[itemIndex]?.episode ? (
                <Typography variant="h6" color="grey.600" sx={{ mb: 4 }}>
                  {"Jakso: "}
                  <Typography variant="span" sx={{ fontWeight: "bold" }}>
                    {feed?.items[itemIndex]?.season}
                  </Typography>
                </Typography>
              ) : (
                ""
              )}
            </Grid>
            <Grid item display="flex" xs={12} sm={6} lg={4}>
              <Image
                src={feed?.items[itemIndex]?.image[0]["$"].href}
                alt={feed?.items[itemIndex]?.title}
                height={1246}
                width={1246}
                priority
              />
            </Grid>
          </Grid>

          <Footer copyright={feed?.copyright} year={year} player={player} />
        </Box>
      </Container>

      <AudioPlayer
        style={
          player
            ? { position: "fixed", left: "0", bottom: "0", zIndex: 9999 }
            : { position: "fixed", left: "0", bottom: "-120px", zIndex: 9999 }
        }
        src={player ? track?.enclosure?.url : "false"}
        showSkipControls={false}
        showJumpControls={false}
        showFilledVolume={true}
        header={player ? `${track.title} - Tuotantokausi ${track.season}` : ""}
      />
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
  const detailedFeed = await getFeed(process.env.PODCAST_RSS_URL);

  return {
    props: {
      feed: detailedFeed,
      year: new Date().getFullYear(),
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const detailedFeed = await getFeed(process.env.PODCAST_RSS_URL);
  const paths = detailedFeed?.items.map((item, index) => ({
    params: { id: (index + 1).toString() },
  }));
  return {
    paths,
    fallback: false,
  };
}
