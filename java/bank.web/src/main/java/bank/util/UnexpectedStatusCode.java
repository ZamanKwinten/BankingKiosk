package bank.util;

public class UnexpectedStatusCode extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public UnexpectedStatusCode(String label, int statusCode) {
		super(String.format("Received unexpected status code from %s: %s", label, statusCode));
	}
}
