package info.kaara.fratpos.pos.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.pos.model.Feedback;
import info.kaara.fratpos.pos.model.Paytype;
import info.kaara.fratpos.pos.model.Product;
import info.kaara.fratpos.user.model.Status;
import info.kaara.fratpos.pos.repository.FeedbackRepository;
import info.kaara.fratpos.pos.repository.PaytypeRepository;
import info.kaara.fratpos.pos.repository.ProductRepository;
import info.kaara.fratpos.pos.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

public class PosRestControllers {

	@RestController
	@RequestMapping(value = "/feedbacks")
	public static class Feedbacks extends RestBaseController<Feedback, Long> {

		@Autowired
		public Feedbacks(FeedbackRepository feedbackRepository) {
			super(feedbackRepository, "ROLE_POS");
		}
	}

	@RestController
	@RequestMapping(value = "/paytypes")
	public static class Paytypes extends RestBaseController<Paytype, Long> {

		@Autowired
		public Paytypes(PaytypeRepository paytypeRepository) {
			super(paytypeRepository, "ROLE_POS");
		}
	}

	@RestController
	@RequestMapping(value = "/products")
	public static class Products extends RestBaseController<Product, Long> {

		@Autowired
		public Products(ProductRepository productRepository) {
			super(productRepository, "ROLE_POS");
		}
	}

}
