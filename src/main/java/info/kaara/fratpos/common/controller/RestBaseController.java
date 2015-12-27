package info.kaara.fratpos.common.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.repository.CrudRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;

@Slf4j
public abstract class RestBaseController<T, ID extends Serializable> {

	protected CrudRepository<T, ID> repo;

	public RestBaseController(CrudRepository<T, ID> repo) {
		this.repo = repo;
	}

	@RequestMapping
	@ResponseBody
	public Iterable<T> listAll() {
		return repo.findAll();
	}

	@RequestMapping(method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public T create(@RequestBody T json) {
		log.info("create() with body {} of type {}", json, json.getClass());
		return repo.save(json);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<T> get(@PathVariable ID id) {
		T t = repo.findOne(id);
		if (t != null) {
			return new ResponseEntity<>(t, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public ResponseEntity<T> update(@PathVariable ID id, @RequestBody T json) {
		log.info("update() of id {} with body {}", id, json);
		log.info("T json is of type {}", json.getClass());

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

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	@ResponseBody
	public void delete(@PathVariable ID id) {
		repo.delete(id);
	}
}