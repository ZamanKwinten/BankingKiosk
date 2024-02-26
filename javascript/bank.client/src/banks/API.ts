/* eslint-disable no-throw-literal */
import { getAuth, setAuth } from "../util/LocalStorageUtil";
import { Bank, Account, Transaction } from "./Types";

function lowerCaseLabel(bank: Bank){
    return bank.label.toLocaleLowerCase();
}

export function bankHomePage(bank: Bank) {
  return "/" + lowerCaseLabel(bank);
}

export function bankOverviewPage(bank: Bank){
    return bankHomePage(bank)+"/overview";
}

export function transactionOverviewPage(bank: Bank, iban: string){
    return bankHomePage(bank)+"/transactions/"+iban;
}

function apiCall(bank: Bank, call: string) : string{
    return "/api/"+lowerCaseLabel(bank)+call;
}

export async function doLogin(bank: Bank, body: string): Promise<void> {
    const result =  await fetch(apiCall(bank,"/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body
    });

    if(result.ok){
        const json = await result.json();
        setAuth(bank, json);
    }else{
        throw "Failed to execute API call doLogin";
    }
}

export async function getAccounts(bank: Bank): Promise<Account[]>{
  
    const auth =  getAuth(bank);

    const result = await fetch(apiCall(bank,"/accounts"), {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(auth),
    })

    if(result.ok){
        const json = await result.json();
        return json;
    }else{
        throw "Failed to execute API call getAccounts"
    }
}

export async function getAccount(bank: Bank, iban:string) : Promise<Account>{
    const auth =  getAuth(bank);

    const result = await fetch(apiCall(bank,"/account/"+iban), {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body: JSON.stringify(auth),
    })

    if(result.ok){
        const json = await result.json();
        return json;
    }else{
        throw "Failed to execute API call getAccounts"
    }
}

export async function getTransactions(bank: Bank, iban: string): Promise<Transaction[]>{
    const auth = getAuth(bank);

    const result = await fetch(apiCall(bank, "/transactions"), {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({auth, iban})
    });

    if(result.ok){
        const json = await result.json();
        return json;
    }else{
        throw "Failed to execute API call getTransactions"
    }
}