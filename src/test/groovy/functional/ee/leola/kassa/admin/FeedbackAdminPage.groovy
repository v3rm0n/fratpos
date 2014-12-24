package functional.ee.leola.kassa.admin

import functional.ee.leola.kassa.admin.module.NavigationModule
import geb.Page

class FeedbackAdminPage extends Page {

    static url = "/admin#/feedback"

    static at = { nav.isActive("Tagasiside") }

    def verify(String content) {
        last.text() == content
    }

    static content = {
        last { $("div[ng-controller=FeedbackController] table tr:last-of-type td:nth-of-type(2)") }
        nav { module NavigationModule }
    }

}
