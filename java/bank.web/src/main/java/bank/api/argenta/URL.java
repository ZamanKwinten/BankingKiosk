package bank.api.argenta;

import java.net.URI;
import java.net.http.HttpRequest;

enum URL {
	AUTHORIZE("https://homebank.argenta.be/direct/authentication/authorize"), //
	CHALLENGE("https://homebank.argenta.be/direct/authentication/universal-signing/select-method"), //
	LOGIN("https://homebank.argenta.be/direct/authentication/sign"), //
	ACCOUNTS("https://homebank.argenta.be/accounts?criteria=ALL_ACCOUNTS"), //
	TRANSACTIONS("https://homebank.argenta.be/accounts/accountingmovements?accountNumber=%s&maxResults=50&start=0"),//
	;

	private final String url;

	private URL(String url) {
		this.url = url;

	}

	/**
	 * Create the request builder for the given URL
	 * 
	 * @param parameters - Assumes the URL is written using formatting characters
	 * @return
	 */
	HttpRequest.Builder builder(Object... parameters) {
		return HttpRequest.newBuilder(URI.create(String.format(url, parameters)));
	}
}
