import {
  Bank,
  IconStep,
  LoginStep,
  LoginStepReturn,
  MaskObservable,
  TextStep,
} from "./Types";
import INGLogo from "../resources/icon/INGLogo";
import INGIdentify from "../resources/images/ing/identify.png";
import INGOK from "../resources/images/ing/ok.png";
import INGCardReader from "../resources/images/ing/cardreader.png";
import { MenuItem, Select } from "@mui/material";
import { useState } from "react";

function MaskSelect({ observable }: { observable: MaskObservable }) {
  const [selected, setSelected] = useState(8);

  return (
    <>
      <span>Selecteer het aantal cijfers dat je op de Kaart Lezer ziet</span>
      <Select
        value={selected}
        sx={{ marginLeft: "5px" }}
        onChange={(event) => {
          const value = Number.parseInt(event.target.value as string);

          let mask = "";
          for (let i = 0; i < value; i++) {
            if (i % 4 === 0) {
              mask = " " + mask;
            }
            mask = "#" + mask;
          }

          observable.notify(mask);
          setSelected(value);
        }}
      >
        <MenuItem value={4}>4</MenuItem>
        <MenuItem value={5}>5</MenuItem>
        <MenuItem value={6}>6</MenuItem>
        <MenuItem value={7}>7</MenuItem>
        <MenuItem value={8}>8</MenuItem>
      </Select>
    </>
  );
}

class ResponseCodeSizeStep extends LoginStep {
  render(): Promise<LoginStepReturn> {
    return new Promise((resolve) => {
      const observable = new MaskObservable();
      resolve({
        maskObservable: observable,
        display: <MaskSelect observable={observable} />,
      });
    });
  }
}

export const ING: Bank = {
  label: "ING",
  icon: INGLogo,
  spotColor: "#FF6200",
  loginSteps: [
    new TextStep("Neem uw ING Kaart Lezer"),
    new TextStep("Steek uw bankkaart in de Kaart Lezer"),
    new IconStep("Druk op Identify", INGIdentify),
    new TextStep("Geef uw Pincode in op de Kaart Lezer"),
    new IconStep("Druk ok OK", INGOK),
    new ResponseCodeSizeStep(),
    new TextStep("Vul de Response code hieronder in"),
  ],
  cardReader: INGCardReader,
};
