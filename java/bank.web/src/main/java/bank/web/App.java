package bank.web;

import java.nio.file.Paths;

import org.jboss.resteasy.plugins.server.undertow.UndertowJaxrsServer;

import bank.web.jaxrs.BankWebApplication;
import io.undertow.Undertow;
import io.undertow.server.handlers.error.FileErrorPageHandler;
import io.undertow.server.handlers.resource.PathResourceManager;
import io.undertow.server.handlers.resource.ResourceHandler;
import io.undertow.util.StatusCodes;

public class App {

	public static void main(String[] args) {

		var p = Paths.get(System.getProperty("bank.web.static.path"));
		var staticHandler = new ResourceHandler(new PathResourceManager(p),
				new FileErrorPageHandler(p.resolve("index.html"), StatusCodes.NOT_FOUND))
				.setDirectoryListingEnabled(true);

		var server = new UndertowJaxrsServer().deployOldStyle(BankWebApplication.class);
		server.addResourcePrefixPath("/", staticHandler);
		server.start(Undertow.builder().addHttpListener(9070, "0.0.0.0"));
	}
}
