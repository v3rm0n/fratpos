package functional.ee.leola.kassa

import geb.Module

class FeedbackModal extends Module {

    def buttonId

    def open() {
        open.click()
    }

    def leave(String feedback) {
        text.value(feedback)
        submit.click()
    }

    static content = {
        open { $("button", id: buttonId) }
        text { $("textarea#content") }
        submit { $("button#feedback-save") }
    }
}
