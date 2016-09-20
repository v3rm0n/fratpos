package info.kaara.fratpos.security.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.security.model.Permission;
import info.kaara.fratpos.security.repository.PermissionRepository;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/permissions")
public class PermissionController extends RestBaseController<Permission, Long> {

	private final MessageSource messageSource;

	public PermissionController(PermissionRepository repository, MessageSource messageSource) {
		super(repository, "ROLE_ROLES");
		this.messageSource = messageSource;
	}

	@Override
	@RequestMapping
	@ResponseBody
	public ResponseEntity<Iterable<Permission>> listAll(SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			List<Permission> all = repo.findAll();
			all.forEach(this::setDescription);
			return new ResponseEntity<>(all, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	private void setDescription(Permission permission) {
		String description = messageSource
				.getMessage("permission." + permission.getName(),
						null, permission.getName(), LocaleContextHolder.getLocale());
		permission.setDescription(description);
	}
}
