package bank.util;

import java.net.http.HttpResponse;
import java.util.function.Function;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.ws.rs.core.Response;

public class GSON {

	public static Gson gson = new GsonBuilder().create();

	public static <T> Function<HttpResponse<String>, T> toObject(Class<T> clazz) {
		return response -> gson.fromJson(response.body(), clazz);
	}

	public static Response jsonResponse(Object o) {
		return Response.ok(gson.toJson(o)).build();
	}
}
