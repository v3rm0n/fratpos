package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.bookeeping.model.Notification;
import info.kaara.fratpos.bookeeping.repository.NotificationRepository;
import info.kaara.fratpos.common.controller.RestBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController extends RestBaseController<Notification, Long> {

	public NotificationController(NotificationRepository repo) {
		super(repo, "ROLE_NOTIFICATIONS");
	}
}
