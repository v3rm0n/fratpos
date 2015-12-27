package info.kaara.fratpos.pos.model;

import com.fasterxml.jackson.databind.JsonNode;
import info.kaara.fratpos.helper.Json;
import lombok.Data;

@Data
public class PopularProduct {

	private TransactionProduct product;

	private Long count;

	public PopularProduct(TransactionProduct product, Long count) {
		this.product = product;
		this.count = count;
	}

	public JsonNode toJson() {
		return Json.toJson(this);
	}

}
