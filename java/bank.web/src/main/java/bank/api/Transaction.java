package bank.api;

public record Transaction(String date, String counterPartyName, String counterPartyIBAN, double amount,
		String comment) {

}
