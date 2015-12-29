package info.kaara.fratpos.common.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;

@Slf4j
public abstract class RestBaseController<T, ID extends Serializable> {

	protected JpaRepository<T, ID> repo;

	protected String permissionPrefix;

	public RestBaseController(JpaRepository<T, ID> repo) {
		this.repo = repo;
	}

	public RestBaseController(JpaRepository<T, ID> repo, String permissionPrefix) {
		this(repo);
		this.permissionPrefix = permissionPrefix;
	}

	@RequestMapping
	@ResponseBody
	public ResponseEntity<Iterable<T>> listAll(SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			return new ResponseEntity<>(repo.findAll(), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public ResponseEntity<T> create(@RequestBody T json, SecurityContextHolderAwareRequestWrapper request) {
		log.info("create() with body {} of type {}", json, json.getClass());
		if (canModify(request)) {
			return new ResponseEntity<>(repo.save(json), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<T> get(@PathVariable ID id, SecurityContextHolderAwareRequestWrapper request) {
		if (canRead(request)) {
			T t = repo.findOne(id);
			if (t != null) {
				return new ResponseEntity<>(t, HttpStatus.OK);
			}
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T json, SecurityContextHolderAwareRequestWrapper request) {
		log.info("update() of id {} with body {}", id, json);
		log.info("T json is of type {}", json.getClass());
		if (canModify(request)) {
			T entity = repo.findOne(id);
			try {
				BeanUtils.copyProperties(json, entity);
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
			T updated = repo.save(entity);
			log.info("updated entity: {}", updated);
			return new ResponseEntity<>(updated, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<T> delete(@PathVariable ID id, SecurityContextHolderAwareRequestWrapper request) {
		if (canModify(request)) {
			repo.delete(id);
			return new ResponseEntity<>(HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}

	protected boolean canRead(SecurityContextHolderAwareRequestWrapper request) {
		return permissionPrefix == null || request.isUserInRole(permissionPrefix + "_VIEW");
	}

	protected boolean canModify(SecurityContextHolderAwareRequestWrapper request) {
		return permissionPrefix == null || request.isUserInRole(permissionPrefix + "_MODIFY");
	}
}