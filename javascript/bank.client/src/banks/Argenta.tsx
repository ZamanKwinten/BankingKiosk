import { Bank, IconStep, LoginStep, LoginStepReturn, TextStep } from "./Types";
import ArgentaLogo from "../resources/icon/ArgentaLogo";
import ArgentaCardReader from "../resources/images/argenta/cardreader.png";
import ArgentaM1 from "../resources/images/argenta/M1.png";
import ArgentaOK from "../resources/images/argenta/OK.png";

class ArgentaChallengeStep extends LoginStep {
  render(): Promise<LoginStepReturn> {
    return new Promise((resolve) => {
      (async () => {
        const response = await fetch("api/argenta/challenge");
        const json = await response.json();
        const result = json as ChallengeResponse;

        resolve({
          display: (
            <>
              <span>Toets de Challenge</span>
              <span
                style={{
                  margin: "0 5px",
                  padding: "5px",
                  background: "lightgrey",
                  borderRadius: "5px",
                }}
              >
                {result.challenge.substring(0, 4) +
                  " " +
                  result.challenge.substring(4)}
              </span>
              <span> in op de Kaart Lezer</span>
            </>
          ),
          metadataForLogin: { challenge: result },
        });
      })();
    });
  }
}

export const Argenta: Bank = {
  label: "Argenta",
  icon: ArgentaLogo,
  spotColor: "#00a160",
  loginSteps: [
    new TextStep("Neem uw Argenta Kaart Lezer"),
    new TextStep("Steek uw bankkaart in de Kaart Lezer"),
    new IconStep("Druk op M1", ArgentaM1),
    new ArgentaChallengeStep(),
    new IconStep("Druk op OK", ArgentaOK),
    new TextStep("Geef uw Pincode in op de Kaart Lezer"),
    new IconStep("Druk op OK", ArgentaOK),
    new TextStep("Vul de Response code hieronder in"),
  ],
  cardReader: ArgentaCardReader,
};

type ChallengeResponse = {
  challenge: string;
  csrfToken: string;
  cookie: string;
  reference: string;
};
