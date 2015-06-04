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

public class StoreScores extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		resp.setHeader("Access-Control-Allow-Origin", "http://pune869");

		Map paramMap = req.getParameterMap();

		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();

		Key key = KeyFactory.createKey(Constants.version,
				req.getParameter("email"));

		Entity entity;

		try {
			entity = datastore.get(key);
		} catch (EntityNotFoundException e) {
			entity = new Entity("version_1_0", req.getParameter("email"));
		}

		if(entity == null)
		{
			entity = new Entity("version_1_0", req.getParameter("email"));
		}

		for (Object name : paramMap.keySet()) {
		
			if (name == null) {
				// TODO : print error and show message that game has encountered
				// an error please wait for a few minutes.
			} else if (name.toString().equals("email")) {
				continue;
			} else {
				entity.setProperty(name.toString(),
						req.getParameter(name.toString()));
			}
		}
		datastore.put(entity);
	}

}
