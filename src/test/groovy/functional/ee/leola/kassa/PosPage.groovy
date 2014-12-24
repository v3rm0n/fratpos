package functional.ee.leola.kassa

import geb.Page

class PosPage extends Page {

    static url = "/"

    static at = { title == "Kassa" }

    static content = {
        user { $("input", id: "usernotselected") }
        feedback { module FeedbackModal, buttonId: "feedback-btn" }
    }
}
