import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React from "react";

interface Props {
  nimi?: string;
  nimellisarvo?: number;
  valuutta?: string;
  painoslkm: string;
  taiteilija?: string;
  kuvanUrl?: string;
}

export default function StampItem({
  nimi,
  nimellisarvo,
  valuutta,
  painoslkm,
  taiteilija,
  kuvanUrl,
}: Props) {
  const arvo: string | undefined = nimellisarvo?.toFixed(2);
  const valuuttaLastLetterA: boolean =
    valuutta?.slice(-1).toLocaleLowerCase() === "a";

  const PropertyLabel = styled(Typography)(({ theme }) => ({
    ...theme.typography.body2,
    color: "GrayText",
  }));

  return (
    <Grid item lg={3}>
      <Card sx={{ height: "100%" }}>
        {kuvanUrl && (
          <CardMedia
            component="img"
            height="250"
            image={kuvanUrl}
            alt="Postimerkin kuva"
          />
        )}
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box>
            <PropertyLabel>Nimi</PropertyLabel>
            <Typography>{nimi || "–"}</Typography>
          </Box>
          <Box>
            <PropertyLabel>Taiteilija: </PropertyLabel>
            <Typography>{taiteilija || "–"} </Typography>
          </Box>
          <Box>
            <PropertyLabel>Nimellisarvo:</PropertyLabel>
            <Typography>
              {arvo || "–"}{" "}
              {arvo && valuuttaLastLetterA ? `${valuutta}a` : valuutta}
            </Typography>
          </Box>
          <Box>
            <PropertyLabel>Painettu:</PropertyLabel>
            <Typography>{painoslkm || "0"} kpl</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
}
