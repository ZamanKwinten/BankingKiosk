package bank.web.jaxrs;

import bank.util.GSON;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ExceptionHandler implements ExceptionMapper<Throwable> {

	private record Error(String error) {

	}

	@Override
	public Response toResponse(Throwable exception) {
		return Response.serverError().entity(GSON.gson.toJson(new Error(exception.getMessage()))).build();
	}

}
