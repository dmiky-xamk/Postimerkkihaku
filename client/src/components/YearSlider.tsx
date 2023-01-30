import { FormControl, FormLabel, Slider, Stack } from "@mui/material";
import React, { useState } from "react";

const marks = [
  {
    value: 1856,
    label: "1856",
  },
  {
    value: 2020,
    label: "2020",
  },
];

function valuetext(value: number) {
  return `Vuosi ${value}`;
}

interface Props {
  years: number[];
  onYearsChange: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function YearSlider({ years, onYearsChange }: Props) {
  const [yearsVisual, setYearsVisual] = useState<number[]>([1856, 2020]);

  const handleActualChange = (event: any, newValue: number | number[]) => {
    onYearsChange(yearsVisual);
  };
  const handleVisualChange = (event: Event, newValue: number | number[]) => {
    setYearsVisual(newValue as number[]);
  };

  return (
    <Stack>
      <FormControl>
        <FormLabel>Vuodet</FormLabel>
        <Slider
          getAriaLabel={() => "Vuosien etäisyys"}
          value={yearsVisual}
          onChange={handleVisualChange}
          onChangeCommitted={handleActualChange}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          marks={marks}
          step={1}
          min={1856}
          max={2020}
        />
      </FormControl>
    </Stack>
  );
}
