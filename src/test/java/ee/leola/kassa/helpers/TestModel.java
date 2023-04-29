package ee.leola.kassa.helpers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.Data;

@Data
class TestModel {
  private String string = "value";
  private Integer integer = 10;
  private List<String> list = new ArrayList<>(Arrays.asList("value1", "value2"));
}
