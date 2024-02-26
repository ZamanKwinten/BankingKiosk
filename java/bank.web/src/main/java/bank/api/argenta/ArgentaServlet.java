package bank.api.argenta;

import java.util.Objects;

import bank.api.argenta.ArgentaAPI.CookieCarrier;
import bank.api.argenta.ArgentaAPI.LoginRequest;
import bank.api.argenta.ArgentaAPI.TransactionRequest;
import bank.util.GSON;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("argenta")
public class ArgentaServlet {

	@GET
	@Path("challenge")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getChallengeAndCSRF() {
		return GSON.jsonResponse(ArgentaAPI.getChallenge());
	}

	@POST
	@Path("login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(LoginRequest request) {
		return GSON.jsonResponse(ArgentaAPI.login(request));
	}

	@POST
	@Path("accounts")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response accounts(CookieCarrier cookie) {
		return GSON.jsonResponse(ArgentaAPI.accounts(cookie));
	}

	@POST
	@Path("account/{iban}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response account(@PathParam("iban") String iban, CookieCarrier cookie) {
		var account = ArgentaAPI.accounts(cookie).stream().filter(acc -> Objects.equals(acc.iban(), iban)).findFirst()
				.orElseThrow(() -> new RuntimeException("Can't find accound for IBAN " + iban));
		return GSON.jsonResponse(account);
	}

	@POST
	@Path("transactions")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response transactions(TransactionRequest request) {
		return GSON.jsonResponse(ArgentaAPI.transactions(request));
	}
}
