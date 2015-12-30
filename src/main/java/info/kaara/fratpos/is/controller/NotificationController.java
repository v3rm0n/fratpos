package info.kaara.fratpos.is.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.is.model.Notification;
import info.kaara.fratpos.is.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notification")
public class NotificationController extends RestBaseController<Notification, Long> {

	@Autowired
	public NotificationController(NotificationRepository repo) {
		super(repo, "ROLE_NOTIFICATIONS");
	}
}
