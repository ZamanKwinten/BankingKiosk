package bank.api.ing;

import java.util.Objects;

import bank.api.ing.INGAPI.AuthenticationHeader;
import bank.api.ing.INGAPI.TransactionRequest;
import bank.util.GSON;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("ing")
public class INGServlet {

	private record LoginRequest(String responseCode) {

	}

	@POST
	@Path("login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(LoginRequest request) {
		return GSON.jsonResponse(INGAPI.login(request.responseCode()));
	}

	@POST
	@Path("accounts")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response accounts(AuthenticationHeader auth) {
		return GSON.jsonResponse(INGAPI.accounts(auth));
	}

	@POST
	@Path("account/{iban}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response account(@PathParam("iban") String iban, AuthenticationHeader auth) {
		var account = INGAPI.accounts(auth).stream().filter(acc -> Objects.equals(acc.iban(), iban)).findFirst()
				.orElseThrow(() -> new RuntimeException("Can't find accound for IBAN " + iban));
		return GSON.jsonResponse(account);
	}

	@POST
	@Path("transactions")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response transactions(TransactionRequest request) {
		return GSON.jsonResponse(INGAPI.transactions(request));
	}
}
