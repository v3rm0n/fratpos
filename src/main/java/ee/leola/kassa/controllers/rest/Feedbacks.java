package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.Feedback;

import javax.ws.rs.Path;

/**
 * Created by vermon on 30/03/14.
 */
@Path("/feedback")
public class Feedbacks extends RestController<Feedback> {
    @Override
    protected Class<Feedback> getModelClass() {
        return Feedback.class;
    }
}
