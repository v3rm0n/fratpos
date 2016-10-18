package info.kaara.fratpos;

import info.kaara.fratpos.bookeeping.model.Account;
import info.kaara.fratpos.bookeeping.model.AccountType;
import info.kaara.fratpos.bookeeping.repository.AccountRepository;
import info.kaara.fratpos.bookeeping.repository.AccountTypeRepository;
import info.kaara.fratpos.pos.repository.StatusRepository;
import info.kaara.fratpos.security.model.Role;
import info.kaara.fratpos.security.repository.PermissionRepository;
import info.kaara.fratpos.security.repository.RoleRepository;
import info.kaara.fratpos.user.model.Status;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.model.UserProfile;
import info.kaara.fratpos.user.repository.UserProfileRepository;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Collections;

@Slf4j
public class DevelopmentBootstrapListener implements ApplicationListener<ApplicationReadyEvent> {
	@Override
	public void onApplicationEvent(ApplicationReadyEvent event) {
		if (event.getApplicationContext().getEnvironment().acceptsProfiles("development")) {
			log.info("In development mode, creating test user if no users");
			createTestUser(event.getApplicationContext());
		}
	}

	private void createTestUser(ConfigurableApplicationContext applicationContext) {
		UserRepository userRepository = applicationContext.getBean(UserRepository.class);
		if (userRepository.count() == 0) {
			User user = new User();
			user.setFirstName("Test");
			user.setLastName("User");
			user.setStatus(createTestStatus(applicationContext));
			user.setPassword("$2a$04$lC5W.f0p5AG1kKezgNKlxeBTO97eBGTeMqO0F6q7mKI0nxZQtI2XO");//q1w2e3r4
			user.setRoles(Collections.singletonList(createAdminRole(applicationContext)));
			user.setAccount(createTestUserAccount(user, applicationContext));
			userRepository.save(user);
			createUserProfile(applicationContext, user);
		}
	}

	private void createUserProfile(ConfigurableApplicationContext applicationContext, User user) {
		UserProfileRepository userProfileRepository = applicationContext.getBean(UserProfileRepository.class);
		UserProfile userProfile = new UserProfile();
		userProfile.setUser(user);
		userProfile.setEmail("test@mailinator.com");
		userProfileRepository.save(userProfile);
	}

	private Status createTestStatus(ConfigurableApplicationContext applicationContext) {
		StatusRepository statusRepository = applicationContext.getBean(StatusRepository.class);
		Status status = new Status();
		status.setName("TestStatus");
		return statusRepository.save(status);
	}

	private Account createTestUserAccount(User user, ConfigurableApplicationContext applicationContext) {
		AccountRepository accountRepository = applicationContext.getBean(AccountRepository.class);
		AccountTypeRepository accountTypeRepository = applicationContext.getBean(AccountTypeRepository.class);
		AccountType accountType = new AccountType();
		accountType.setName("Kasutajakonto");
		accountTypeRepository.save(accountType);
		Account account = new Account();
		account.setName(user.getLabel());
		account.setAccountType(accountType);
		return accountRepository.save(account);
	}

	private Role createAdminRole(ConfigurableApplicationContext applicationContext) {
		RoleRepository roleRepository = applicationContext.getBean(RoleRepository.class);
		PermissionRepository permissionRepository = applicationContext.getBean(PermissionRepository.class);
		Role role = new Role();
		role.setName("Admin");
		role.setPermissions(permissionRepository.findAll());
		return roleRepository.save(role);
	}
}
