package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.Paytype;

import javax.ws.rs.Path;

/**
 * Created by vermon on 06/04/14.
 */
@Path("/paytype")
public class Paytypes extends RestController<Paytype> {
    protected Class<Paytype> getModelClass() {
        return Paytype.class;
    }
}
