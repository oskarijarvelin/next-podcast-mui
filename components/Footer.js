import * as React from 'react'
import { Typography } from '@mui/material'

export default function Copyright({ name }) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" marginTop={8}>
      {'Copyright © '}
      {new Date().getFullYear()}{': '}
      {name}
    </Typography>
  );
}