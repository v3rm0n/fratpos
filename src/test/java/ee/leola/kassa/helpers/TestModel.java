package ee.leola.kassa.helpers;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.Data;

@Data
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class TestModel {
  private String string = "value";
  private Integer integer = 10;
  private List<String> list = new ArrayList<>(Arrays.asList("value1", "value2"));
}
