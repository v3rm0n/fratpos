package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.User;

import javax.ws.rs.Path;

/**
 * Created by vermon on 30/03/14.
 */
@Path("/user")
public class Users extends RestController<User> {
    @Override
    protected Class<User> getModelClass() {
        return User.class;
    }
}
