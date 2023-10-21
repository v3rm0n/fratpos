package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.*;
import ee.leola.kassa.repository.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

public class RestControllers {

    @RestController
    @RequestMapping(value = "/feedback")
    public static class Feedbacks extends RestBaseController<Feedback, Long> {
        public Feedbacks(FeedbackRepository feedbackRepository) {
            super(feedbackRepository);
        }
    }

    @RestController
    @RequestMapping(value = "/paytype")
    public static class Paytypes extends RestBaseController<Paytype, Long> {
        public Paytypes(PaytypeRepository paytypeRepository) {
            super(paytypeRepository);
        }
    }

    @RestController
    @RequestMapping(value = "/product")
    public static class Products extends RestBaseController<Product, Long> {
        public Products(ProductRepository productRepository) {
            super(productRepository);
        }
    }

    @RestController
    @RequestMapping(value = "/status")
    public static class Statuses extends RestBaseController<Status, Long> {
        public Statuses(StatusRepository statusRepository) {
            super(statusRepository);
        }
    }

    @RestController
    @RequestMapping(value = "/user")
    public static class Users extends RestBaseController<User, Long> {
        public Users(UserRepository userRepository) {
            super(userRepository);
        }
    }
}
