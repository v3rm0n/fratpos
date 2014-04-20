package ee.leola.kassa.controllers.rest;

import com.google.common.collect.Sets;
import ee.leola.kassa.models.*;

import javax.ws.rs.Path;
import java.util.Set;

/**
 * Created by vermon on 12/04/14.
 */
public class Rest {

    public static Set<Class<?>> controllers = Sets.newHashSet(Feedbacks.class, Paytypes.class, Products.class, Statuses.class, Users.class);

    @Path("/feedback")
    public static class Feedbacks extends RestController<Feedback> {
        @Override
        protected Class<Feedback> getModelClass() {
            return Feedback.class;
        }
    }

    @Path("/paytype")
    public static class Paytypes extends RestController<Paytype> {
        @Override
        protected Class<Paytype> getModelClass() {
            return Paytype.class;
        }
    }

    @Path("/product")
    public static class Products extends RestController<Product> {
        @Override
        protected Class<Product> getModelClass() {
            return Product.class;
        }
    }

    @Path("/status")
    public static class Statuses extends RestController<Status> {
        @Override
        protected Class<Status> getModelClass() {
            return Status.class;
        }
    }

    @Path("/user")
    public static class Users extends RestController<User> {
        @Override
        protected Class<User> getModelClass() {
            return User.class;
        }
    }
}
