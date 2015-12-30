package info.kaara.fratpos.pos.model;

import lombok.Data;

@Data
public class PopularProduct {

	private TransactionProduct product;

	private Long count;

	public PopularProduct(TransactionProduct product, Long count) {
		this.product = product;
		this.count = count;
	}

}
