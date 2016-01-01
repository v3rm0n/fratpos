package info.kaara.fratpos.helper;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;

@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PermissionChecker {

	protected String permissionPrefix;

	public boolean canRead(SecurityContextHolderAwareRequestWrapper request) {
		return permissionPrefix == null || request.isUserInRole(permissionPrefix + "_VIEW");
	}

	public boolean canModify(SecurityContextHolderAwareRequestWrapper request) {
		return permissionPrefix == null || request.isUserInRole(permissionPrefix + "_MODIFY");
	}
}
