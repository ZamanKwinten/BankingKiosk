package bank.api;

public record Account(String accountName, String iban, AccountType type, Double balance, Double availableBalance) {

}
