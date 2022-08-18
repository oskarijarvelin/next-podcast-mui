import * as React from "react";
import { Typography } from "@mui/material";

export default function Copyright({ copyright, year, player }) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      marginTop={8}
      marginBottom={player ? 20 : 2}
    >
      {"Copyright © "}
      {year}
      {": "}
      {copyright}
    </Typography>
  );
}
