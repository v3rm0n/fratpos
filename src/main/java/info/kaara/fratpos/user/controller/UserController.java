package info.kaara.fratpos.user.controller;

import info.kaara.fratpos.common.controller.RestBaseController;
import info.kaara.fratpos.security.model.Role;
import info.kaara.fratpos.security.repository.RoleRepository;
import info.kaara.fratpos.user.model.User;
import info.kaara.fratpos.user.model.UserProfile;
import info.kaara.fratpos.user.repository.UserProfileRepository;
import info.kaara.fratpos.user.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping(value = "/users")
public class UserController extends RestBaseController<User, Long> {

  private final RoleRepository roleRepository;

  private final UserRepository userRepository;

  private final UserProfileRepository userProfileRepository;

  private final Object UPDATE_LOCK = new Object();

  @Autowired
  public UserController(UserRepository userRepository, RoleRepository roleRepository, UserProfileRepository userProfileRepository) {
    super(userRepository, "ROLE_USERS");
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.userProfileRepository = userProfileRepository;
  }

  @RequestMapping(value = "/me", method = RequestMethod.GET)
  @ResponseBody
  public ResponseEntity<User> get(SecurityContextHolderAwareRequestWrapper request) {
    if (canRead(request)) {
      String email = request.getRemoteUser();
      if ("leola@leola.ee".equalsIgnoreCase(email)) {
        log.info("Navigating from pos, invalidating session");
        request.getSession().invalidate();
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
      }
      User me = userRepository.findByEmail(email);
      if (me != null) {
        return new ResponseEntity<>(me, HttpStatus.OK);
      }
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }

  @RequestMapping(value = "/{id}", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE})
  @ResponseBody
  public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User json, SecurityContextHolderAwareRequestWrapper request) {
    log.info("update() of id {} with body {}", id, json);
    log.info("T json is of type {}", json.getClass());
    if (canModify(request)) {
      User entity = repo.findOne(id);
      try {
        BeanUtils.copyProperties(json, entity, "password", "roles", "userProfile");
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
      User updated = repo.save(entity);
      log.info("updated entity: {}", updated);
      return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }

  @RequestMapping(value = "/{id}/roles/{roleId}", method = RequestMethod.POST)
  @ResponseBody
  public ResponseEntity<User> addRole(@PathVariable("roleId") Long roleId, @PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
    if (canModify(request)) {
      synchronized (UPDATE_LOCK) {
        User user = repo.findOne(id);
        Role role = roleRepository.findOne(roleId);
        if (!user.getRoles().contains(role)) {
          log.info("Adding role {} to user {}", role.getName(), user.getLabel());
          user.getRoles().add(role);
          repo.save(user);
        }
      }
      return new ResponseEntity<>(HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }

  @RequestMapping(value = "/{id}/roles/{roleId}", method = RequestMethod.DELETE)
  @ResponseBody
  public ResponseEntity<Role> removeRole(@PathVariable("roleId") Long roleId, @PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
    if (canModify(request)) {
      synchronized (UPDATE_LOCK) {
        User user = repo.findOne(id);
        Role role = roleRepository.findOne(roleId);
        if (user.getRoles().contains(role)) {
          log.info("Removing role {} from user {}", role.getName(), user.getLabel());
          user.getRoles().remove(role);
          repo.save(user);
        }
      }
      return new ResponseEntity<>(HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }

  @RequestMapping(value = "/{id}/profile", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
  @ResponseBody
  public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfile json, @PathVariable("id") Long id, SecurityContextHolderAwareRequestWrapper request) {
    log.info("create() with body {} of type {}", json, json.getClass());
    if (canModify(request)) {
      User user = repo.findOne(id);
      if (user.getUserProfile() != null) {
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
      }
      json.setUser(user);
      UserProfile userProfile = userProfileRepository.save(json);
      return new ResponseEntity<>(userProfile, HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }

  @RequestMapping(value = "/{id}/profile/{userProfileId}", method = RequestMethod.PUT, consumes = {MediaType.APPLICATION_JSON_VALUE})
  @ResponseBody
  public ResponseEntity<UserProfile> update(@PathVariable("userProfileId") Long userProfileId, @PathVariable("id") Long id, @RequestBody UserProfile json, SecurityContextHolderAwareRequestWrapper request) {
    log.info("update() of id {} with body {}", id, json);
    log.info("T json is of type {}", json.getClass());
    if (canModify(request)) {
      UserProfile entity = userProfileRepository.findOne(userProfileId);
      try {
        BeanUtils.copyProperties(json, entity, "user");
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
      UserProfile updated = userProfileRepository.save(entity);
      log.info("updated entity: {}", updated);
      return new ResponseEntity<>(updated, HttpStatus.OK);
    }
    return new ResponseEntity<>(HttpStatus.FORBIDDEN);
  }
}
