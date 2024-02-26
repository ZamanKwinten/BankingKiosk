package bank.api.argenta;

import java.util.Scanner;

import bank.api.argenta.ArgentaAPI.CookieCarrier;
import bank.api.argenta.ArgentaAPI.LoginRequest;
import bank.api.argenta.ArgentaAPI.TransactionRequest;

class ArgentaAPITester {
	public static void main(String[] args) throws Exception {

		try (Scanner sc = new Scanner(System.in)) {
			var challenge = ArgentaAPI.getChallenge();
			System.out.println(challenge.challenge());

			String response = sc.nextLine().trim();

			var cookie = new CookieCarrier(ArgentaAPI.login(new LoginRequest(response, challenge)).cookie());

			ArgentaAPI.accounts(cookie).stream().forEach(account -> {
				System.out.println(account);
				if (account.iban() != null) {
					System.out.println(ArgentaAPI.transactions(new TransactionRequest(cookie, account.iban())));
				}
			});

		}

	}
}
