import { useState } from "react";
import { useMountEffect } from "../util/ReactUtil";
import { Account, Bank, Transaction } from "../banks/Types";
import { LoadingIndicator } from "./LoadingIndicator";
import { Collapse, Divider, List, ListItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { getAccount, getTransactions } from "../banks/API";
import AccountCard from "./AccountCard";

const MONT_TRANSLATOR: { [key: string]: string } = {
  "01": "Januari",
  "02": "Februari",
  "03": "Maart",
  "04": "April",
  "05": "Mei",
  "06": "Juni",
  "07": "Juli",
  "08": "Augustus",
  "09": "September",
  "10": "Oktober",
  "11": "November",
  "12": "December",
};

function prettifyDate(date: string) {
  //date is formatted as: YYYYMMDD
  const year = date.substring(0, 4);
  const month = MONT_TRANSLATOR[date.substring(4, 6)];
  const day = date.substring(6);

  return day + " " + month + " " + year;
}

type props = { bank: Bank };
export default function TransactionOverview({ bank }: props) {
  const { iban } = useParams();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<Account | null>(null);

  useMountEffect(() => {
    async function loadData() {
      if (iban) {
        const account = await getAccount(bank, iban);
        const transactions = await getTransactions(bank, iban);

        setAccount(account);
        setTransactions(transactions);
        setLoading(false);
      }
    }
    loadData();
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  let dates: string[] = [];
  let map = new Map<string, Transaction[]>();
  transactions.forEach((trans) => {
    if (!map.has(trans.date)) {
      map.set(trans.date, []);
      dates.push(trans.date);
    }
    map.get(trans.date)?.push(trans);
  });
  map.keys();
  const sortedDates = dates.sort().reverse();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {account && (
        <div style={{ marginBottom: "15px" }}>
          <AccountCard bank={bank} account={account} />
        </div>
      )}
      <List
        sx={{
          background: "white",
          minWidth: "512px",
        }}
      >
        {sortedDates.map((date, i) => {
          return (
            <>
              {i !== 0 && <Divider sx={{ marginTop: "5px" }} />}
              <ListItem>
                <div>{prettifyDate(date)}</div>
              </ListItem>
              <Collapse in timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {map.get(date)?.map((transaction) => {
                    return (
                      <ListItem sx={{ pl: 4, display: "block" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            border: bank.spotColor,
                            borderStyle: "solid",
                            borderRadius: "5px",
                            padding: "15px",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              {transaction.counterPartyName}
                            </div>
                            <div>{transaction.counterPartyIBAN}</div>
                            <div style={{ marginTop: "15px" }}>
                              {transaction.comment}
                            </div>
                          </div>
                          <div
                            style={{
                              background: "lightgrey",
                              height: "fit-content",
                              borderRadius: "10px",
                              padding: "5px",
                            }}
                          >
                            {(transaction.amount > 0 ? "+" : "") +
                              (
                                Math.round(transaction.amount * 100) / 100
                              ).toFixed(2)}
                          </div>
                        </div>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </>
          );
        })}
      </List>
    </div>
  );
}
