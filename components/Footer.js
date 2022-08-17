import * as React from "react";
import { Typography } from "@mui/material";

export default function Copyright({ copyright, year }) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      marginTop={8}
    >
      {"Copyright © "}
      {year}
      {": "}
      {copyright}
    </Typography>
  );
}
