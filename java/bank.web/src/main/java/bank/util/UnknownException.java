package bank.util;

public class UnknownException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public UnknownException(String label, Exception e) {
		super(String.format("An unknown exception occurred in %s: %s", label, e.getMessage()));
	}
}
