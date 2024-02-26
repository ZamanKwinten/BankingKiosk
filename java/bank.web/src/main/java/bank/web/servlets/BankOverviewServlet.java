package bank.web.servlets;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("banks")
public class BankOverviewServlet {

	@GET
	@Path("all")
	@Produces(MediaType.TEXT_PLAIN)
	public Response getAll() {

		return Response.ok("Hello world!").build();
	}
}
