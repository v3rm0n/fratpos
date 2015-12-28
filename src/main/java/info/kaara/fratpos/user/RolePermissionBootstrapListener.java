package info.kaara.fratpos.user;

import info.kaara.fratpos.PosConfig;
import info.kaara.fratpos.user.model.Permission;
import info.kaara.fratpos.user.model.Role;
import info.kaara.fratpos.user.repository.PermissionRepository;
import info.kaara.fratpos.user.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Arrays;
import java.util.List;

import static info.kaara.fratpos.user.Permissions.*;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;

/**
 * Creates some initial roles and permissions if there are none.
 */
@Slf4j
public class RolePermissionBootstrapListener implements ApplicationListener<ApplicationReadyEvent> {

	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		ConfigurableApplicationContext context = event.getApplicationContext();
		RoleRepository roleRepository = context.getBean(RoleRepository.class);
		PermissionRepository permissionRepository = context.getBean(PermissionRepository.class);
		String posRole = getPosRole(event.getApplicationContext());
		if (roleRepository.findOneByName(posRole) != null && permissionRepository.count() > 0) {
			log.info("Permissions bootstrap not needed");
			return;
		}
		if (permissionRepository.count() == 0) {
			log.info("Permissions don't exist, creating");
			createAllPermissions(context);
		}
		if (roleRepository.findOneByName(posRole) == null) {
			log.info("Pos role doesn't exist, creating");
			createPosRole(event.getApplicationContext());
		}
	}

	private List<Permission> createAllPermissions(ConfigurableApplicationContext context) {
		PermissionRepository permissionRepository = context.getBean(PermissionRepository.class);
		return Arrays.stream(Permissions.values())
				.map(Permissions::name)
				.map(Permission::new)
				.map(permissionRepository::save)
				.collect(toList());
	}

	private void createPosRole(ConfigurableApplicationContext context) {
		RoleRepository roleRepository = context.getBean(RoleRepository.class);
		String posRole = getPosRole(context);
		Role role = new Role();
		role.setName(posRole);
		role.setPermissions(getPosPermissions(context));
		roleRepository.save(role);
	}

	private List<Permission> getPosPermissions(ConfigurableApplicationContext context) {
		PermissionRepository permissionRepository = context.getBean(PermissionRepository.class);
		List<String> permissionNames = asList(USERS_VIEW, USERS_MODIFY, POS_VIEW, POS_MODIFY).stream()
				.map(Permissions::name).collect(toList());
		return permissionRepository.findByNameIn(permissionNames);
	}

	private String getPosRole(ConfigurableApplicationContext context) {
		PosConfig posConfig = getPosConfig(context);
		return posConfig.getRole();
	}

	private PosConfig getPosConfig(ConfigurableApplicationContext context) {
		return context.getBean(PosConfig.class);
	}
}
