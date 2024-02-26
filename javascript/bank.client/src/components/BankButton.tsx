import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Bank } from "../banks/Types";
import { bankOverviewPage } from "../banks/API";

type propType = { bank: Bank };

export default function BankButton({ bank }: propType) {
  const navigate = useNavigate();
  const { spotColor, label, icon } = bank;

  return (
    <Button
      style={{
        fill: spotColor,
        borderColor: spotColor,
        color: spotColor,
        background: "white",
        height: "fit-content",
        fontSize: "35px",
      }}
      variant="outlined"
      size="large"
      endIcon={icon({ size: "35px" })}
      onClick={() => {
        navigate(bankOverviewPage(bank));
      }}
    >
      {label}
    </Button>
  );
}
