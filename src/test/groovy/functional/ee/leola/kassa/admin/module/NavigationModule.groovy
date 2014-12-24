package functional.ee.leola.kassa.admin.module

import geb.Module

class NavigationModule extends Module {

    def isActive(String title) {
        menu.find("li.active a").text() == title
    }

    static content = {
        menu { $("ul[ng-controller=NavController]") }
    }
}
