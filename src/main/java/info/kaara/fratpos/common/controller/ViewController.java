package info.kaara.fratpos.common.controller;

import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.security.Principal;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class ViewController {

	@Autowired
	private UserRepository userRepository;

	@RequestMapping(value = "/", method = GET)
	public ModelAndView index(Principal principal) {
		User user = null;
		if (principal != null) {
			user = userRepository.findByEmail(principal.getName());
		}
		return new ModelAndView("index", "user", user);
	}

	@RequestMapping(value = "/dialog/{modal}", method = GET)
	public String modal(@PathVariable("modal") String modal) {
		return "dialog/" + modal;
	}


	@RequestMapping(value = "/admin/{page}", method = GET)
	public String page(@PathVariable("page") String page) {
		return "admin/" + page;
	}
}
