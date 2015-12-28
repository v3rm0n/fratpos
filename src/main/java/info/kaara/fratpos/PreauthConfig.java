package info.kaara.fratpos;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Data
@ConfigurationProperties("preauth")
public class PreauthConfig {
	private String principal;
	private String role;
	private String header;
}
