package bank.api.ing;

import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpRequest;

enum URL {
	Login("https://ebanking.ing.be/login/"), //
	Authenticate("https://api.ebanking.ing.be/ucrmeans/authenticate"), //
	Agreements("https://api.ebanking.ing.be/agreements"),//
	;

	private final URI uri;

	private URL(String url) {
		try {
			uri = new URI(url);
		} catch (URISyntaxException e) {
			// should not happen;
			throw new RuntimeException(e);
		}
	}

	public HttpRequest.Builder builder() {
		return HttpRequest.newBuilder(uri);
	}
}
