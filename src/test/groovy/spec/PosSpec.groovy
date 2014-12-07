package spec

import geb.spock.GebSpec

class PosSpec extends GebSpec {

    def "first result for wikipedia search should be wikipedia"() {
        given:
        to PosPage

        expect:
        at PosPage

        when:
        user.value("Maido")

        then:
        waitFor { at GoogleResultsPage }

    }
}