package functional

import functional.ee.leola.kassa.PosPage
import functional.ee.leola.kassa.admin.FeedbackAdminPage
import geb.spock.GebSpec

class PosSpec extends GebSpec {

    def "can leave feedback"() {
        given:
        to PosPage

        expect:
        at PosPage

        when:
        feedback.open()

        and:
        feedback.leave("This is feedback")

        then:
        at PosPage

        when:
        to FeedbackAdminPage

        then:
        at FeedbackAdminPage

        and:
        verify("This is feedback")

    }
}