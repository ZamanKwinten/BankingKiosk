package bank.api.argenta;

import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.util.List;
import java.util.stream.Collectors;

import bank.api.Account;
import bank.api.AccountType;
import bank.api.Transaction;
import bank.util.GSON;
import bank.util.HTTP;

class ArgentaAPI {
	private static final String CARD_NUMBER = System.getProperty("argenta.card");

	private static final String CSRFTOKENCOOKIE = "csrf-token-homebank=";
	private static final String SET_COOKIE_HEADER = "Set-Cookie";

	private record AuthorizeArgentaResponse(String reference) {

	}

	private record AuthorizeResult(String cookie, String csrfToken, String reference) {

	}

	static AuthorizeResult authorize() {
		var call = URL.AUTHORIZE.builder().POST(BodyPublishers.noBody()).build();

		return HTTP.stringBody("Argenta::authorize", call).call(response -> {
			var resp = GSON.gson.fromJson(response.body(), AuthorizeArgentaResponse.class);

			var cookies = response.headers().allValues("Set-Cookie");

			var csrfToken = cookies.stream().filter(val -> val.startsWith(CSRFTOKENCOOKIE))
					.map(val -> val.substring(CSRFTOKENCOOKIE.length(), val.indexOf(";", CSRFTOKENCOOKIE.length())))
					.findFirst()
					.orElseThrow(() -> new RuntimeException("Unable to find CSRF token in argenta authorize"));

			var cookie = cookies.stream().collect(Collectors.joining("; "));

			return new AuthorizeResult(cookie, csrfToken, resp.reference);
		});
	}

	private record ChallengeArgentaResponse(String challenge) {

	}

	public record Challenge(String challenge, String csrfToken, String cookie, String reference) {
		public Challenge(String challenge, AuthorizeResult authorize) {
			this(challenge, authorize.csrfToken(), authorize.cookie(), authorize.reference());
		}
	}

	public static Challenge getChallenge() {
		var authorize = authorize();

		var call = prepareAuthenticationCall(URL.CHALLENGE, authorize.cookie(), authorize.csrfToken())
				.POST(BodyPublishers.ofString(String.format(
						"{\"context\":{\"reference\":\"%s\",\"signingMethod\":\"DIGIPASS\"}}", authorize.reference())))
				.build();

		return HTTP.stringBody("Argenta::getChallenge", call).call(response -> {
			var body = GSON.gson.fromJson(response.body(), ChallengeArgentaResponse.class);

			return new Challenge(body.challenge(), authorize.csrfToken(), authorize.cookie(), authorize.reference());
		});
	}

	record LoginRequest(String responseCode, Challenge challenge) {

	}

	record LoginResponse(String cookie) {

	}

	public static LoginResponse login(LoginRequest request) {
		var call = prepareAuthenticationCall(URL.LOGIN, request.challenge().cookie(), request.challenge().csrfToken())
				.POST(BodyPublishers.ofString(String.format(
						"{\"response\":\"%s\",\"reference\":\"%s\",\"signingMethod\":\"DIGIPASS\",\"cardNumber\":\"%s\"}",
						request.responseCode, request.challenge().reference(), CARD_NUMBER)))
				.build();

		return HTTP.stringBody("Argenta::login", call).call(response -> {
			if (response.body().contains("error")) {
				throw new RuntimeException("Login returned error");
			}

			var headers = response.headers().allValues(SET_COOKIE_HEADER);
			return new LoginResponse(headers.stream().collect(Collectors.joining("; ")));
		});
	}

	private static HttpRequest.Builder prepareAuthenticationCall(URL url, String cookie, String csrfToken) {
		var builder = url.builder();
		builder.header("Cookie", cookie)//
				.header("X-XSRF-TOKEN-2", csrfToken)//
				.header("Content-Type", "application/json");

		return builder;
	}

	public record CookieCarrier(String cookie) {

	}

	private record AccountResponse(List<ArgentaAccount> accounts) {

	}

	private record ArgentaAccount(String iban, String alias, String shortCommercialName, Double balance,
			Double availableBalance) {

		public Account toGenericAccount() {

			var type = switch (shortCommercialName.toUpperCase()) {
			case "GREEN" -> AccountType.CURRENT;
			case "MAXIREKENING", "E-SPAAR" -> AccountType.SAVINGS;
			default -> AccountType.UNKNOWN;
			};

			return new Account(alias, iban, type, balance, availableBalance);
		}
	}

	public static List<Account> accounts(CookieCarrier carrier) {

		var call = URL.ACCOUNTS.builder().header("Cookie", carrier.cookie()).GET().build();
		var response = HTTP.stringBody("Argenta::accounts", call).call(GSON.toObject(AccountResponse.class));

		return response.accounts().stream().map(ArgentaAccount::toGenericAccount).collect(Collectors.toList());

	}

	record TransactionRequest(CookieCarrier auth, String iban) {

	}

	private record ArgentaTransaction(String accountingDate, String counterpartyName, String counterPartyAccountNumber,
			double movementAmount, String communicationPart1, String communicationPart2) {

		Transaction toGenericTransaction() {
			var comment = communicationPart1.trim() + " " + communicationPart2.trim();

			return new Transaction(accountingDate, counterpartyName, counterPartyAccountNumber, movementAmount,
					comment);
		}
	}

	private record ArgentaTransactionResponse(List<ArgentaTransaction> result) {

	}

	public static List<Transaction> transactions(TransactionRequest request) {
		var call = URL.TRANSACTIONS.builder(request.iban()).header("Cookie", request.auth().cookie()).GET().build();
		return HTTP.stringBody("Argenta::transactions", call).call(GSON.toObject(ArgentaTransactionResponse.class))
				.result().stream().map(ArgentaTransaction::toGenericTransaction).collect(Collectors.toList());

	}
}
