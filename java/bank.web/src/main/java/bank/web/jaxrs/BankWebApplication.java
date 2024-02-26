package bank.web.jaxrs;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import bank.api.argenta.ArgentaServlet;
import bank.api.ing.INGServlet;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("api")
public class BankWebApplication extends Application {

	@Override
	public Set<Class<?>> getClasses() {
		return new HashSet<>(Arrays.asList(GsonJerseyProvider.class, ExceptionHandler.class, ArgentaServlet.class,
				INGServlet.class));
	}

}
