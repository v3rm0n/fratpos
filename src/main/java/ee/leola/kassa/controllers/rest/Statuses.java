package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.Status;

import javax.ws.rs.Path;

/**
 * Created by vermon on 06/04/14.
 */
@Path("/status")
public class Statuses extends RestController<Status> {
    @Override
    protected Class<Status> getModelClass() {
        return Status.class;
    }
}
