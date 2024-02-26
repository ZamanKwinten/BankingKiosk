package bank.util;

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandler;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.function.Function;

public class HTTP<T> {

	public static HTTP<String> stringBody(String label, HttpRequest call, int... additionalAcceptedStatusCodes) {
		return new HTTP<>(label, call, BodyHandlers.ofString(), additionalAcceptedStatusCodes);
	}

	private final String label;
	private final HttpRequest call;
	private final BodyHandler<T> bodyHandler;
	private final int[] acceptedStatusCodes;

	public HTTP(String label, HttpRequest call, BodyHandler<T> bodyHandler, int... additionalAcceptedStatusCodes) {
		this.label = label;
		this.call = call;
		this.bodyHandler = bodyHandler;
		this.acceptedStatusCodes = additionalAcceptedStatusCodes;
	}

	public <R> R call(Function<HttpResponse<T>, R> handleSuccess) {

		try {
			var result = HttpClient.newHttpClient().send(call, bodyHandler);

			var statusCode = result.statusCode();
			if (statusCode == 200 || inAdditionalStatusCodes(statusCode)) {
				return handleSuccess.apply(result);
			}

			throw new UnexpectedStatusCode(label, statusCode);
		} catch (IOException | InterruptedException e) {
			throw new UnknownException(label, e);
		}
	}

	private boolean inAdditionalStatusCodes(int statusCode) {
		if (acceptedStatusCodes == null) {
			return false;
		}

		for (var additional : acceptedStatusCodes) {
			if (statusCode == additional) {
				return true;
			}
		}

		return false;
	}
}
