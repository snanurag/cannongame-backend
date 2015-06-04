package sn.cannon;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class RetrieveScore extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		
    	resp.setHeader("Access-Control-Allow-Origin","http://pune869");
//        resp.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setContentType("application/json");
		
		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		Key key = KeyFactory.createKey(Constants.version,
				req.getParameter("email"));

		Entity entity;

		String json = "{";

		try {
			entity = datastore.get(key);
		} catch (EntityNotFoundException e) {
			json += "}";
			resp.getOutputStream().print(json);
			resp.getOutputStream().close();
			return;
		}

		Map scoreMap = entity.getProperties();

		for (Object name : scoreMap.keySet()) {
			json += "\""+name + "\":" + scoreMap.get(name) + ",";
		}
		int endIndex = json.lastIndexOf(",");
		json = json.substring(0, endIndex);
		json += "}";

		resp.getOutputStream().print(json);
		resp.getOutputStream().close();
	}
	
}
