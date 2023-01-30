import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useCallback, useState } from "react";
import ScrollTop from "./components/ScrollTop";
import StampItem from "./components/StampItem";
import YearSlider from "./components/YearSlider";
import useFetch from "./hooks/useFetch";

interface Result {
  stamps: [];
  message?: string;
  error?: string;
}

const API_URL = "/api/postimerkit";

function App() {
  const [stamps, setStamps] = useState([]);
  const { isLoading, fetchData } = useFetch();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [queryString, setQueryString] = useState<string>("");
  const [years, setYears] = useState<number[]>([1856, 2020]);
  const [queryError, setQueryError] = useState<string>("");
  const [activeRadioBtn, setActiveRadioBtn] = useState<string>("asiasanat");

  const handlePostimerkitResponse = useCallback(
    (result: Result): void => {
      // Palvelimelta tulee viesti yli 40 tulosta --> päivitetään viesti käyttäjälle
      // Palvelimelta ei tule viestiä --> nollataan vanha viesti jos sellainen on
      result.message ? setMessage(result.message) : message && setMessage("");

      if (result.error) {
        setStamps([]);
        return setError(result.error);
      }

      setStamps(result.stamps);
    },
    [message]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (queryString.trim().length < 2)
      return setQueryError("Hakusanan on oltava vähintään kaksi merkkiä pitkä");

    setQueryError("");

    const url: string = `${API_URL}?hakusana=${queryString}&kohde=${activeRadioBtn}&vuosi=${years[0]}-${years[1]}`;

    await fetchData(url, setError, handlePostimerkitResponse);
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", flexDirection: "column", gap: 8, py: 4 }}
      >
        <Stack gap={4} component="form" onSubmit={handleSubmit}>
          <Typography variant="h5">Postimerkkihaku</Typography>
          <Card
            sx={{
              p: 2,
              alignSelf: "center",
            }}
          >
            <CardContent>
              <Stack direction="row" gap={1.2} mb={2}>
                <TextField
                  placeholder="Hakusana..."
                  size="small"
                  error={Boolean(queryError)}
                  helperText={queryError}
                  value={queryString}
                  onChange={(e) => setQueryString(e.target.value)}
                />
                <Button variant="contained" type="submit">
                  Hae
                </Button>
              </Stack>
              <FormControl sx={{ mb: 1 }}>
                <FormLabel>Haun kohde</FormLabel>
                <RadioGroup row name="target" defaultValue="asiasanat">
                  <FormControlLabel
                    value="asiasanat"
                    control={
                      <Radio
                        onChange={(e) => setActiveRadioBtn(e.target.value)}
                      />
                    }
                    label="Asiasanat"
                    defaultChecked
                  />
                  <FormControlLabel
                    value="merkinnimi"
                    control={
                      <Radio
                        onChange={(e) => setActiveRadioBtn(e.target.value)}
                      />
                    }
                    label="Merkin nimi"
                  />
                  <FormControlLabel
                    value="taiteilija"
                    control={
                      <Radio
                        onChange={(e) => setActiveRadioBtn(e.target.value)}
                      />
                    }
                    label="Taiteilija"
                  />
                </RadioGroup>
              </FormControl>
              <YearSlider years={years} onYearsChange={setYears} />
            </CardContent>
          </Card>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2} rowSpacing={6}>
          {stamps.map((stamp: any) => {
            return (
              <StampItem
                key={Math.random().toString()}
                nimi={stamp.merkinNimi}
                nimellisarvo={stamp.nimellisarvo}
                painoslkm={stamp.painosmaara}
                taiteilija={stamp.taiteilija}
                valuutta={stamp.valuutta}
                kuvanUrl={stamp.kuvanUrl}
              />
            );
          })}
        </Grid>

        {message && <Alert severity="warning">{message}</Alert>}
      </Container>
      <ScrollTop />
    </>
  );
}

export default App;
