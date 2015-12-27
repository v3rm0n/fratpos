package info.kaara.fratpos.security

import org.springframework.mock.web.MockHttpServletRequest
import spock.lang.Specification

import javax.servlet.http.HttpServletRequest


class SubjectDNHeaderAuthenticationFilterSpec extends Specification {

	private static final String DN = '/C=EE/ST=Harjumaa/L=Tallinn/O=Leola/CN=Kassa/emailAddress=leola@leola.ee'

	def 'Using CN by default'() {
		given:
			SubjectDNHeaderAuthenticationFilter filter = new SubjectDNHeaderAuthenticationFilter()
			HttpServletRequest request = new MockHttpServletRequest()
			request.addHeader('SM_USER', DN)
		when:
			String principal = filter.getPreAuthenticatedPrincipal(request)
		then:
			principal == 'Kassa'
	}

	def 'Possible to override'() {
		given:
			SubjectDNHeaderAuthenticationFilter filter = new SubjectDNHeaderAuthenticationFilter()
			filter.subjectDnRegex = 'emailAddress=(.*?)(?:/|$)'
			HttpServletRequest request = new MockHttpServletRequest()
			request.addHeader('SM_USER', DN)
		when:
			String principal = filter.getPreAuthenticatedPrincipal(request)
		then:
			principal == 'leola@leola.ee'
	}

}