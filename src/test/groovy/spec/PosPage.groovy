package spec

import geb.Page

class PosPage extends Page {

    static at = { title == "Kassa" }

    static content = {
        user { $("input", id: "usernotselected") }
    }
}
