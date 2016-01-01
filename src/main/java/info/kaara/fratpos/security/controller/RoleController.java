package info.kaara.fratpos.security.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.security.model.Permission;
import info.kaara.fratpos.security.model.Role;
import info.kaara.fratpos.security.repository.PermissionRepository;
import info.kaara.fratpos.security.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/roles")
@Slf4j
public class RoleController extends RestBaseController<Role, Long> {

	private final Object UPDATE_LOCK = new Object();

	@Autowired
	private PermissionRepository permissionRepository;

	@Autowired
	public RoleController(RoleRepository roleRepository) {
		super(roleRepository, "ROLE_ROLES");
	}

	@RequestMapping(value = "/{roleId}/permissions/{permissionId}", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Role> addPermission(@PathVariable("roleId") Long roleId, @PathVariable("permissionId") Long permissionId, SecurityContextHolderAwareRequestWrapper request) {
		if (canModify(request)) {
			synchronized (UPDATE_LOCK) {
				Role role = repo.findOne(roleId);
				Permission permission = permissionRepository.findOne(permissionId);
				if (!role.getPermissions().contains(permission)) {
					log.info("Adding permission {} to role {}", permission.getName(), role.getName());
					role.getPermissions().add(permission);
					repo.save(role);
				}
			}
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{roleId}/permissions/{permissionId}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Role> removePermission(@PathVariable("roleId") Long roleId, @PathVariable("permissionId") Long permissionId, SecurityContextHolderAwareRequestWrapper request) {
		if (canModify(request)) {
			synchronized (UPDATE_LOCK) {
				Role role = repo.findOne(roleId);
				Permission permission = permissionRepository.findOne(permissionId);
				if (role.getPermissions().contains(permission)) {
					log.info("Removing permission {} from role {}", permission.getName(), role.getName());
					role.getPermissions().remove(permission);
					repo.save(role);
				}
			}
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
}
