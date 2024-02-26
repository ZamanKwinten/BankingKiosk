import { Account, Bank } from "../banks/Types";
import CurrentIcon from "../resources/icon/CurrentIcon";
import SavingsIcon from "../resources/icon/SavingsIcon";

function formatIban(account: Account) {
  const iban = account.iban;
  if (!iban) {
    return "";
  }

  return (
    iban.substring(0, 4) +
    " " +
    iban.substring(4, 8) +
    " " +
    iban.substring(8, 12) +
    " " +
    iban.substring(12)
  );
}

type props = {
  account: Account;
  bank: Bank;
  onClick?: (account: Account) => void;
};
export default function AccountCard({ account, bank, onClick }: props) {
  let icon;
  if (account.type === "CURRENT") {
    icon = <CurrentIcon />;
  } else if (account.type === "SAVINGS") {
    icon = <SavingsIcon />;
  }
  return (
    <div
      style={{
        display: "flex",
        flexFlow: "row",
        background: "white",
        padding: "15px",
        borderRadius: "10px",
        fill: bank.spotColor,
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        cursor: onClick ? "pointer" : "default",
        width: "100%",
      }}
      onClick={() => {
        onClick && onClick(account);
      }}
    >
      <div
        style={{
          aspectRatio: "1/1",
          width: "15%",
          marginRight: "15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {icon && icon}
      </div>
      <div style={{ whiteSpace: "nowrap", width: "100%" }}>
        <div style={{ fontWeight: "bold" }}>{account.accountName}</div>
        <div style={{ whiteSpace: "nowrap" }}>{formatIban(account)}</div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div></div>
          <div style={{ fontWeight: "bold", color: bank.spotColor }}>
            {account.balance}
          </div>
        </div>
      </div>
    </div>
  );
}
