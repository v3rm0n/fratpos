package info.kaara.fratpos.security.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.security.model.Permission;
import info.kaara.fratpos.security.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/permission")
public class PermissionController extends RestBaseController<Permission, Long> {

	@Autowired
	public PermissionController(PermissionRepository repository) {
		super(repository, "ROLE_ROLES");
	}
}
