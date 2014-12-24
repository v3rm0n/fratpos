package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.*;

import javax.ws.rs.Path;

public class Rest {

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
