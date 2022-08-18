import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from 'next/router'
import {
  Container,
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  Drawer,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { SiAnchor } from "react-icons/si";
import { FaPlay } from "react-icons/fa";
import Link from "../src/Link";
import Footer from "../components/Footer";
import Parser from "rss-parser";
import Moment from "react-moment";
import parse from "html-react-parser";
import AudioPlayer from "react-h5-audio-player";

export default function Index({ feed, year }) {
  const [showNumber, setShowNumber] = React.useState(6);
  const [showDrawer, setDrawer] = React.useState(false);
  const [currentEpisode, selectEpisode] = React.useState(feed?.items[0]);
  const [track, setTrack] = React.useState(feed?.items[0]);
  const [player, showPlayer] = React.useState(false);

  const router = useRouter()
  const route = router.query

  console.log(route)

  let category = feed?.category[0]["$"].text;
  let subcategory = feed?.category[0]["itunes:category"][0]["$"].text;

  function playPreviousTrack() {
    let trackIndex = feed?.items.indexOf(track);
    let prevIndex = ( trackIndex === 0 ) ? feed?.items.length - 1 : trackIndex - 1;
    setTrack(feed?.items[prevIndex]);
  };

  function playNextTrack() {
    let trackIndex = feed?.items.indexOf(track);
    let nextIndex = ( trackIndex === feed?.items.length - 1 ) ? 0 : trackIndex + 1;
    setTrack(feed?.items[nextIndex]);
  };

  function playThisTrack(t) {
    showPlayer(true);
    setTrack(t);
    toggleDrawer();
  };

  function increaseShowNumber() {
    setShowNumber(showNumber + 6);
  }

  function toggleDrawer() {
    setDrawer(!showDrawer);
  }

  function updateEpisode(item, index) {
    selectEpisode(item);
    toggleDrawer();
  }

  return (
    <>
      <Head>
        <title>{feed?.title}</title>
      </Head>

      <Container maxWidth="xl">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Grid
            container
            alignItems={{ xs: "end", lg: "center" }}
            spacing={{ xs: 2, md: 4, lg: 8 }}
            sx={{ mb: { xs: 2, md: 4, lg: 8 } }}
          >
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
                priority
              />
            </Grid>
          </Grid>

          <Grid container spacing={{ xs: 2, md: 4, lg: 8 }}>
            {feed?.items
              .filter((item, index) => (index < showNumber ? true : false))
              .map((item, index) => (
                <Grid
                  item
                  key={item?.guid}
                  xs={6}
                  md={4}
                  lg={4}
                  onClick={() => updateEpisode(item, index)}
                  sx={{ cursor: "pointer" }}
                >
                  <Image
                    src={item?.image[0]["$"]?.href}
                    alt={item?.title}
                    height={1246}
                    width={1246}
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII="
                    placeholder="blur"
                  />
                </Grid>
              ))}
          </Grid>

          {showNumber < feed?.items?.length ? (
            <Box align="center" sx={{ mt: 8 }}>
              <Button
                variant="contained"
                endIcon={<MoreHorizIcon />}
                onClick={increaseShowNumber}
                size="large"
                sx={{ pt: 1 }}
              >
                {"Lataa lisää"}
              </Button>
            </Box>
          ) : (
            ""
          )}

          <Footer copyright={feed?.copyright} year={year} player={player} />
        </Box>
      </Container>

      <Drawer anchor="right" open={showDrawer} onClose={toggleDrawer}>
        <Box width={440} maxWidth="90vw">
          <Image
            src={currentEpisode?.image[0]["$"].href}
            alt={currentEpisode?.title}
            height={1246}
            width={1246}
          />
          <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {currentEpisode?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Moment date={currentEpisode?.isoDate} format="DD.MM.YYYY" />{" "}
              &bull; Tuotantokausi {currentEpisode?.season} &bull; Jakso{" "}
              {currentEpisode?.episode}
            </Typography>
            <Box sx={{ wordBreak: "break-word" }}>
              {parse(currentEpisode?.content)}
            </Box>
            <Box sx={{ pt: 2 }}>
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  color="success"
                  sx={{ pt: 1 }}
                  startIcon={<FaPlay />}
                  onClick={() =>
                    playThisTrack(currentEpisode)
                  }
                >
                  {"Kuuntele"}
                </Button>
                <Link
                  href={currentEpisode?.link}
                  target="_blank"
                  rel="noopener"
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
          </Box>
        </Box>
      </Drawer>

      <AudioPlayer
        style={
          player
            ? { position: "fixed", left: "0", bottom: "0" }
            : { position: "fixed", left: "0", bottom: "-120px" }
        }
        src={player ? track?.enclosure?.url : false}
        showSkipControls={true}
        showJumpControls={false}
        showFilledVolume={true}
        header={player ? `${track.title} - Tuotantokausi ${track.season}` : ""}
        onClickPrevious={playPreviousTrack}
        onClickNext={playNextTrack}
        onEnded={playNextTrack}
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
