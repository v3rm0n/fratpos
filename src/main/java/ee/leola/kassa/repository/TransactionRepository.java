package ee.leola.kassa.repository;

import ee.leola.kassa.models.PopularProduct;
import ee.leola.kassa.models.Transaction;
import ee.leola.kassa.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

  List<Transaction> findByInvalidFalse();

  List<Transaction> findByUser(User user);

  @Query(
      "SELECT new ee.leola.kassa.models.PopularProduct(tp, sum(tp.quantity)) FROM Transaction t JOIN t.products tp WHERE t.user = :user AND t.invalid = FALSE group by tp.product order by sum(tp.quantity) desc")
  List<PopularProduct> findPopularProductsByUser(@Param("user") User user);
}
