package bank.api.ing;

import java.util.Scanner;

import bank.api.ing.INGAPI.AuthenticationHeader;
import bank.api.ing.INGAPI.TransactionRequest;
import bank.util.GSON;

public class INGAPITester {

	public static void main(String[] args) throws Exception {
		try (Scanner sc = new Scanner(System.in)) {
			System.out.println("Identify:");

			String response = sc.nextLine().trim();

			var login = INGAPI.login(response);

			var auth = new AuthenticationHeader(login.accessToken(), login.cookie());
			INGAPI.accounts(auth).forEach(acc -> {
				System.out.println(acc);

				if (acc.iban() != null) {
					System.out.println(GSON.gson.toJson(INGAPI.transactions(new TransactionRequest(auth, acc.iban()))));
				}
			});
		}
	}

}
