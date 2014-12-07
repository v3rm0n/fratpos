import org.openqa.selenium.phantomjs.PhantomJSDriver

environments {

    phantomJs {
        driver = { new PhantomJSDriver() }
    }

}

baseUrl = "http://localhost:8080"