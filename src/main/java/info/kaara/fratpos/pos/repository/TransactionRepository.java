package info.kaara.fratpos.pos.repository;

import info.kaara.fratpos.pos.model.PopularProduct;
import info.kaara.fratpos.pos.model.Transaction;
import info.kaara.fratpos.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	List<Transaction> findByInvalidFalse();

	List<Transaction> findByUser(User user);

	@Query("SELECT new info.kaara.fratpos.pos.model.PopularProduct(tp, sum(tp.quantity)) FROM Transaction t JOIN t.products tp WHERE t.user = :user AND t.invalid = FALSE group by tp.product order by sum(tp.quantity) desc")
	List<PopularProduct> findPopularProductsByUser(@Param("user") User user);
}
