package ee.leola.kassa.controllers.rest;

import ee.leola.kassa.models.Product;

import javax.ws.rs.Path;

/**
 * Created by vermon on 06/04/14.
 */
@Path("/product")
public class Products extends RestController<Product> {
    @Override
    protected Class<Product> getModelClass() {
        return Product.class;
    }
}
