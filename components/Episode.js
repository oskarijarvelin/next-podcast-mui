import * as React from 'react'
import Image from 'next/image'
import { Grid, Typography } from '@mui/material'
import parse from 'html-react-parser'
import Moment from 'react-moment'

export default function Episode({ item }) {
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Image
        src={item.image[0]["$"].href}
        alt={item.title}
        height={1246}
        width={1246}
      />
      <Typography variant="h5">{item.title}</Typography>
      <Typography variant="body2" color="text.secondary">
        <Moment date={item.isoDate} format="DD.MM.YYYY" /> &bull; Tuotantokausi{" "}
        {item.season} &bull; Jakso {item.episode}
      </Typography>
    </Grid>
  );
}
