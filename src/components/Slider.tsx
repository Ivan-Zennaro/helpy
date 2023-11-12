import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import styles, { layout } from "../style";

interface Props {
  handlerFunction: (value: number) => void;
  minValue: number;
  maxValue: number;
}

const SimpleSlider: React.FC<Props> = ({
  handlerFunction,
  minValue,
  maxValue,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(minValue);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      handlerFunction(newValue);
      setSliderValue(newValue);
    }
  };

  return (
    <div className={`${layout.sectionColSmallPad} `}>
      <div className={layout.sectionCenter}>
        <p
          className={`${styles.paragraph} flex flex-row `}
        >{`Min: ${minValue} - Max: ${maxValue}`}</p>
        <Slider
          aria-label="Temperature"
          className="flex flex-row p-2 mt-10"
          value={sliderValue}
          min={minValue}
          max={maxValue}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          sx={{
            width: 300,
            color: "white",
          }}
        />

        <p>{sliderValue}</p>
      </div>
    </div>
  );
};

export default SimpleSlider;
