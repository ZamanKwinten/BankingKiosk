package bank.api.ing;

import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.BodyPublishers;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import bank.api.Account;
import bank.api.AccountType;
import bank.api.Transaction;
import bank.util.GSON;
import bank.util.HTTP;

public class INGAPI {
	private static final String ING_CARD = System.getProperty("ing.card");
	private static final String ING_ID = System.getProperty("ing.id");
	private static final String CLIENT_ID = System.getProperty("ing.clientid", "ceccd325-b3cc-48cb-b8ef-faca5dee4512");

	private static final String SET_COOKIE_HEADER = "Set-Cookie";
	private static final String XSRF_TOKEN = "XSRF-TOKEN=";

	private record XSRFResponse(String xsrfToken, String cookie) {

	}

	private static XSRFResponse getLogin() {
		var call = URL.Login.builder().GET().build();

		return new HTTP<>("ING::getLogin", call, BodyHandlers.discarding()).call(response -> {
			var cookies = response.headers().allValues(SET_COOKIE_HEADER);
			var xsrfToken = cookies.stream().filter(cookie -> cookie.startsWith(cookie)).findFirst()
					.map(cookie -> cookie.substring(XSRF_TOKEN.length(), cookie.indexOf(";")))
					.orElseThrow(() -> new RuntimeException("Unable to find the XSRF Token"));

			return new XSRFResponse(xsrfToken, XSRF_TOKEN + xsrfToken);
		});
	}

	private record AccessToken(String accessToken) {

	}

	private record IntermediateAccessToken(List<AccessToken> accessTokens) {

	}

	private record AuthenticateBody(IntermediateAccessToken accessToken) {

	}

	record LoginResponse(String accessToken, String cookie) {

	}

	public static LoginResponse login(String responseCode) {
		var xsrf = getLogin();

		var requestBody = String.format(
				"{\"ingId\":\"%s\",\"cardId\":\"%s\",\"responseCode\":\"%s\",\"authenticationContext\":{\"identifyeeType\":\"customer\",\"scopes\":[\"personal_data\"],\"clientId\":\"%s\",\"requiredLevelOfAssurance\":5,\"clientDetails\":{\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0\"}}}",
				ING_ID, ING_CARD, responseCode, CLIENT_ID);

		var call = URL.Authenticate.builder().header("X-Xsrf-Token", xsrf.xsrfToken())
				.header("Content-Type", "application/json").header("cookie", xsrf.cookie())
				.POST(BodyPublishers.ofString(requestBody)).build();

		return HTTP.stringBody("ING::login", call).call(response -> {
			var responseBody = GSON.gson.fromJson(response.body(), AuthenticateBody.class);

			return new LoginResponse(responseBody.accessToken().accessTokens().get(0).accessToken(),
					response.headers().allValues(SET_COOKIE_HEADER).stream().collect(Collectors.joining("; ")));
		});
	}

	public record AuthenticationHeader(String accessToken, String cookie) {

	}

	private record AgreementsBody(List<AgreementItem> agreements) {

	}

	private record AgreementItem(String type, CommercialID commercialId, String productName, Balance balance,
			Balance availableBalance, List<Link> _links) {

		public Account toGenericAccount() {

			var type = switch (this.type().toUpperCase()) {
			case "SAVINGS" -> AccountType.SAVINGS;
			case "CURRENT" -> AccountType.CURRENT;
			default -> AccountType.UNKNOWN;
			};

			var iban = iban();
			var b = balance() != null ? balance().value() : null;
			var ab = availableBalance() != null ? availableBalance().value() : null;

			return new Account(productName, iban, type, b, ab);
		}

		boolean hasIBAN() {
			return Objects.equals("IBAN", commercialId.type());
		}

		String iban() {
			return hasIBAN() ? commercialId.value() : null;
		}
	}

	private record Link(String rel, String href) {

	}

	private record CommercialID(String value, String type) {

	}

	private record Balance(double value) {

	}

	public static List<Account> accounts(AuthenticationHeader header) {
		return getAgreements(header).stream().map(AgreementItem::toGenericAccount).collect(Collectors.toList());
	}

	record TransactionRequest(AuthenticationHeader auth, String iban) {

	}

	private record TransactionBody(List<INGTransaction> transactions) {

	}

	private record INGTransaction(String executionDate, String subject, CounterAccount counterAccount, Amount amount) {

		Transaction toGeneric() {
			var split = subject.split("\\n");

			var counterPartyName = split[0];

			var comment = split.length > 1 && !split[1].contains("bijlage") ? split[1] : "";

			return new Transaction(executionDate.replaceAll("-", ""), counterPartyName, counterPartyIBAN(),
					amount.value(), comment);
		}

		String counterPartyIBAN() {
			return counterAccount != null ? counterAccount().accountNumber().value() : null;
		}
	}

	private record CounterAccount(AccountNumber accountNumber) {

	}

	private record AccountNumber(String value) {

	}

	private record Amount(double value) {

	}

	public static List<Transaction> transactions(TransactionRequest request) {
		var agreement = getAgreements(request.auth()).stream()
				.filter(item -> Objects.equals(item.iban(), request.iban())).findFirst()
				.orElseThrow(() -> new RuntimeException("IBAN was not found!"));

		var transactionRelLink = agreement._links.stream().filter(link -> Objects.equals(link.rel(), "transactions"))
				.map(Link::href).findFirst().orElseThrow(() -> new RuntimeException("Could not find transaction link"));

		var call = withAuthenticationCookies(
				() -> HttpRequest.newBuilder(URI.create("https://api.ebanking.ing.be" + transactionRelLink)),
				request.auth()).GET().build();

		return HTTP.stringBody("ING::transactions", call, 206).call(GSON.toObject(TransactionBody.class))//
				.transactions().stream().map(INGTransaction::toGeneric).collect(Collectors.toList());

	}

	private static List<AgreementItem> getAgreements(AuthenticationHeader header) {
		var call = withAuthenticationCookies(URL.Agreements::builder, header).GET().build();

		return HTTP.stringBody("ING::getAgreements", call).call(GSON.toObject(AgreementsBody.class)).agreements();
	}

	private static HttpRequest.Builder withAuthenticationCookies(Supplier<HttpRequest.Builder> builder,
			AuthenticationHeader header) {
		return builder.get().header("Cookie", header.cookie()).header("Authorization",
				"Bearer " + header.accessToken());
	}
}
