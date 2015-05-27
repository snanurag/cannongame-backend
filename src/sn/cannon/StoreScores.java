package sn.cannon;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

public class StoreScores extends HttpServlet{

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
   
    	Map paramMap =    	req.getParameterMap();	
    	 
    	
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    	Entity entity = new Entity("version_1_0", req.getParameter("email"));

    	for(Object name : paramMap.keySet())
    	{
    		if(name == null)
    		{
    			//TODO : print error and show message that game has encountered an error please wait for a few minutes. 
    		}
    		else if(name.toString().equals("email"))
    		{
    			continue;
    		}
    		else
    		{
    	    	entity.setProperty(name.toString(), req.getParameter(name.toString()));
    		}
    	}
    	datastore.put(entity);
    }
    
    
}
