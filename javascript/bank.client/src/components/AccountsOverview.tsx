import { Card } from "@mui/material";
import { useMountEffect } from "../util/ReactUtil";
import { useState } from "react";
import { Bank, Account } from "../banks/Types";
import { getAccounts, transactionOverviewPage } from "../banks/API";
import AccountCard from "./AccountCard";
import { LoadingIndicator } from "./LoadingIndicator";
import { useNavigate } from "react-router-dom";

type headerProps = { bank: Bank; text: string };
function Header({ bank, text }: headerProps) {
  return <h1 style={{ color: bank.spotColor }}>{text}</h1>;
}

type AccountSectionProps = {
  bank: Bank;
  header: string;
  accounts: Account[];
  onAccountClick?: (account: Account) => void;
};
function AccountSection({
  bank,
  accounts,
  header,
  onAccountClick,
}: AccountSectionProps) {
  return (
    <>
      <Header bank={bank} text={header} />
      {accounts.map((account, i) => {
        return (
          <div style={{ marginBottom: "25px", marginRight: "35px" }}>
            <AccountCard
              bank={bank}
              account={account}
              key={i}
              onClick={onAccountClick}
            />
          </div>
        );
      })}
    </>
  );
}

type props = { bank: Bank };

export default function AccountOverview({ bank }: props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useMountEffect(() => {
    async function loadData() {
      const accounts = await getAccounts(bank);

      setAccounts(accounts);
      setLoading(false);
    }

    loadData();
  });

  const currentAccounts = accounts.filter((acc) => {
    return acc.type === "CURRENT";
  });

  const savingsAccounts = accounts.filter((acc) => {
    return acc.type === "SAVINGS";
  });

  const unknownAccounts = accounts.filter((acc) => {
    return acc.type === "UNKNOWN";
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  const accountClicked = (acc: Account) => {
    if (acc.iban) {
      navigate(transactionOverviewPage(bank, acc.iban));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ padding: "0 35px" }}>
        <>
          {currentAccounts.length > 0 && (
            <AccountSection
              accounts={currentAccounts}
              bank={bank}
              header="Zichtrekeningen"
              onAccountClick={accountClicked}
            />
          )}
          {savingsAccounts.length > 0 && (
            <AccountSection
              accounts={savingsAccounts}
              bank={bank}
              header="Spaarrekeningen"
              onAccountClick={accountClicked}
            />
          )}
          {unknownAccounts.length > 0 && (
            <AccountSection
              accounts={unknownAccounts}
              bank={bank}
              header="Andere Rekeningen"
            />
          )}
        </>
      </Card>
    </div>
  );
}
