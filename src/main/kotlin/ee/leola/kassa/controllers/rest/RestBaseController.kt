package ee.leola.kassa.controllers.rest

import org.slf4j.LoggerFactory
import org.springframework.beans.BeanUtils
import org.springframework.data.repository.CrudRepository
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.Serializable

abstract class RestBaseController<T : Any, ID : Serializable>(protected val repo: CrudRepository<T, ID>) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    @RequestMapping
    @ResponseBody
    fun listAll(): Iterable<T> = repo.findAll()

    @ResponseBody
    @PostMapping(consumes = [MediaType.APPLICATION_JSON_VALUE])
    open fun create(@RequestBody json: T): T = repo.save(json).also {
        logger.info("create() with body {} of type {}", json, json::class)
    }

    @ResponseBody
    @GetMapping("/{id}")
    fun get(@PathVariable id: ID): T = repo.findById(id).orElseThrow()

    @ResponseBody
    @PostMapping("/{id}", consumes = [MediaType.APPLICATION_JSON_VALUE])
    open fun update(@PathVariable id: ID, @RequestBody json: T): ResponseEntity<T> {
        logger.info("update() of id {} with body {}", id, json)
        logger.info("T json is of type {}", json::class)
        val entity = repo.findById(id).orElseThrow()
        BeanUtils.copyProperties(json, entity)
        val updated = repo.save(entity)
        logger.info("updated entity: {}", updated)
        return ResponseEntity(updated, HttpStatus.OK)
    }

    @ResponseBody
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: ID) = repo.deleteById(id)
}