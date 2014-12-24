package ee.leola.kassa.controllers.rest;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude
public class RestException extends RuntimeException {

    public RestException(String message, Throwable cause) {
        super(message, cause);
    }
}
