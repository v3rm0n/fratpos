package info.kaara.fratpos.security;

import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.SpringSecurityMessageSource;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SubjectDNHeaderAuthenticationFilter extends RequestHeaderAuthenticationFilter {

	private Pattern subjectDnPattern;
	protected MessageSourceAccessor messages = SpringSecurityMessageSource.getAccessor();

	public SubjectDNHeaderAuthenticationFilter() {
		setSubjectDnRegex("CN=(.*?)(?:/|$)");
	}

	@Override
	protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
		Object principal = super.getPreAuthenticatedPrincipal(request);
		return extractPrincipal(principal.toString());
	}

	private Object extractPrincipal(String subjectDN) {

		logger.debug("Subject DN is '" + subjectDN + "'");

		Matcher matcher = subjectDnPattern.matcher(subjectDN);

		if (!matcher.find()) {
			throw new BadCredentialsException(messages.getMessage(
					"SubjectDNHeaderAuthenticationFilter.noMatching",
					new Object[]{subjectDN},
					"No matching pattern was found in subject DN: {0}"));
		}

		if (matcher.groupCount() != 1) {
			throw new IllegalArgumentException(
					"Regular expression must contain a single group ");
		}

		String username = matcher.group(1);

		logger.debug("Extracted Principal name is '" + username + "'");

		return username;
	}

	public void setSubjectDnRegex(String subjectDnRegex) {
		Assert.hasText(subjectDnRegex, "Regular expression may not be null or empty");
		subjectDnPattern = Pattern.compile(subjectDnRegex, Pattern.CASE_INSENSITIVE);
	}
}
