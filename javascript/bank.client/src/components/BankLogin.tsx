import { Alert, Button, Card, CardContent, Divider, Grid } from "@mui/material";
import { Box, Container } from "@mui/system";
import { Bank, LoginStepReturn } from "../banks/Types";
import { ReactElement, useState } from "react";
import MaskedTextField from "./MaskedTextField";
import { useMountEffect } from "../util/ReactUtil";
import { useNavigate } from "react-router-dom";
import { bankOverviewPage, doLogin } from "../banks/API";

type props = { bank: Bank };

const Step = function ({
  index,
  children,
}: {
  index: number;
  children: ReactElement;
}) {
  return (
    <Box
      key={index}
      sx={{
        display: "flex",
        paddingTop: "10px",
        alignItems: "center",
      }}
    >
      <span style={{ paddingRight: "5px" }}>{index + 1 + "."}</span> {children}
    </Box>
  );
};

export default function BankLogin({ bank }: props) {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<LoginStepReturn[]>([]);
  const [mask, setMask] = useState<string>("#### ####");
  const [loading, setLoading] = useState<boolean>(true);
  const [responseCode, setResponseCode] = useState<string>("");
  const [loginBusy, setLoginBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadSteps = () => {
    Promise.all(
      bank.loginSteps.map((step) => {
        return step.render();
      })
    ).then((result) => {
      setSteps(result);
      setLoading(false);
    });
  };

  useMountEffect(() => {
    loadSteps();
  });

  steps.forEach((step) => {
    if (step.maskObservable) {
      step.maskObservable.addObserver((mask) => {
        setMask(mask);
      });
    }
  });

  const login = async () => {
    let body = {
      responseCode,
    };

    steps.forEach((step) => {
      if (step.metadataForLogin) {
        Object.assign(body, step.metadataForLogin);
      }
    });

    try {
      await doLogin(bank, JSON.stringify(body));
      navigate(bankOverviewPage(bank));
    } catch (error) {
      setLoginBusy(false);
      setError(
        "Er is een fout opgetreden tijdens het inloggen, probeer opnieuw"
      );
      loadSteps();
      setResponseCode("");
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card sx={{ paddingLeft: "15px", paddingRight: "15px" }}>
          <CardContent>
            <Grid container spacing={15}>
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={bank.cardReader} alt="Kaart Lezer" />
              </Grid>

              <Grid item>
                <h1
                  style={{
                    display: "flex",
                    color: bank.spotColor,
                    fill: bank.spotColor,
                  }}
                >
                  {"Aanmelden bij " + bank.label}{" "}
                  <span style={{ paddingLeft: "25px" }}>
                    {bank.icon({ size: "default" })}
                  </span>
                </h1>
                {loading && <>Bezig met Laden...</>}
                {!loading && (
                  <>
                    {steps.map((step, i) => {
                      return <Step index={i}>{step.display}</Step>;
                    })}
                    <Divider sx={{ margin: "10px 0" }} />
                    <MaskedTextField
                      disabled={loginBusy}
                      autoFocus
                      label="Response Code"
                      mask={mask}
                      replacement={{ "#": /\d/ }}
                      maskCompleteCallback={(value) => {
                        setResponseCode(value);
                      }}
                      maskIncompleteCallback={() => {
                        setResponseCode("");
                      }}
                    />
                    {responseCode && (
                      <>
                        <Step index={steps.length}>
                          <span>Klik op de knop hieronder</span>
                        </Step>
                        <div style={{ marginTop: "10px" }}>
                          <Button
                            disabled={loginBusy}
                            sx={{
                              background: bank.spotColor,
                              marginRight: "50px",
                            }}
                            variant="contained"
                            onClick={(event) => {
                              setLoginBusy(true);

                              login();
                            }}
                          >
                            Aanmelden
                          </Button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
