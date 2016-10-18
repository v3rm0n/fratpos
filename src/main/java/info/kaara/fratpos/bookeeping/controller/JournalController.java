package info.kaara.fratpos.bookeeping.controller;

import info.kaara.fratpos.bookeeping.model.Journal;
import info.kaara.fratpos.bookeeping.repository.JournalRepository;
import info.kaara.fratpos.common.controller.RestBaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/journals")
@Slf4j
public class JournalController extends RestBaseController<Journal, Long> {

	public JournalController(JournalRepository repo) {
		super(repo);
	}

	@RequestMapping(method = RequestMethod.POST, consumes = {MediaType.APPLICATION_JSON_VALUE})
	@ResponseBody
	public ResponseEntity<Journal> create(@RequestBody Journal json, SecurityContextHolderAwareRequestWrapper request) {
		log.info("create() with body {} of type {}", json, json.getClass());
		if (canModify(request)) {
			if (json.isBalanced()) {
				json.getPostings().forEach(posting -> posting.setJournal(json));
				return new ResponseEntity<>(repo.save(json), HttpStatus.OK);
			}
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
}
