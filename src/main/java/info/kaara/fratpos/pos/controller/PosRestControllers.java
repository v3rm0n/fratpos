package info.kaara.fratpos.pos.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.pos.model.Feedback;
import info.kaara.fratpos.pos.model.Paytype;
import info.kaara.fratpos.pos.model.Product;
import info.kaara.fratpos.pos.model.Status;
import info.kaara.fratpos.pos.repository.FeedbackRepository;
import info.kaara.fratpos.pos.repository.PaytypeRepository;
import info.kaara.fratpos.pos.repository.ProductRepository;
import info.kaara.fratpos.pos.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

public class PosRestControllers {

	@RestController
	@RequestMapping(value = "/feedback")
	public static class Feedbacks extends RestBaseController<Feedback, Long> {

		@Autowired
		public Feedbacks(FeedbackRepository feedbackRepository) {
			super(feedbackRepository, "ROLE_POS");
		}
	}

	@RestController
	@RequestMapping(value = "/paytype")
	public static class Paytypes extends RestBaseController<Paytype, Long> {

		@Autowired
		public Paytypes(PaytypeRepository paytypeRepository) {
			super(paytypeRepository, "ROLE_POS");
		}
	}

	@RestController
	@RequestMapping(value = "/product")
	public static class Products extends RestBaseController<Product, Long> {

		@Autowired
		public Products(ProductRepository productRepository) {
			super(productRepository, "ROLE_POS");
		}
	}

	@RestController
	@RequestMapping(value = "/status")
	public static class Statuses extends RestBaseController<Status, Long> {

		@Autowired
		public Statuses(StatusRepository statusRepository) {
			super(statusRepository, "ROLE_POS");
		}
	}

}
