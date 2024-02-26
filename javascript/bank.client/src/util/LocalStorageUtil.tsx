import { Bank } from "../banks/Types";

const AUTH_KEY = "_auth";

export function setAuth(bank: Bank, authObj: Object) {
  localStorage.setItem(bank.label + AUTH_KEY, JSON.stringify(authObj));
}

export function getAuth(bank: Bank): Object | null {
  const json = localStorage.getItem(bank.label + AUTH_KEY);
  return json ? JSON.parse(json) : null;
}
