import { Route, Routes } from "react-router-dom";
import AccountOverview from "./components/AccountsOverview";
import AuthWrapper from "./auth/AuthWrapper";
import { Argenta } from "./banks/Argenta";
import { ING } from "./banks/ING";
import BankLogin from "./components/BankLogin";
import { bankHomePage } from "./banks/API";
import TransactionOverview from "./components/TransactionsOverview";

export default function App() {
  const banks = [Argenta, ING];

  return (
    <>
      <Routes>
        <Route path="/" element={<div />} />
        {banks.map((bank) => {
          const bankRoot = bankHomePage(bank);
          return (
            <>
              <Route path={bankRoot} element={<BankLogin bank={bank} />} />
              <Route
                path={bankRoot + "/overview"}
                element={<AuthWrapper bank={bank} />}
              >
                <Route
                  path={bankRoot + "/overview"}
                  element={<AccountOverview bank={bank} />}
                ></Route>
              </Route>
              <Route
                path={bankRoot + "/transactions/:iban"}
                element={<AuthWrapper bank={bank} />}
              >
                <Route
                  path={bankRoot + "/transactions/:iban"}
                  element={<TransactionOverview bank={bank} />}
                ></Route>
              </Route>
            </>
          );
        })}
      </Routes>
    </>
  );
}
