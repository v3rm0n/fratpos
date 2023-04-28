package ee.leola.kassa.repository;

import ee.leola.kassa.models.User;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  List<User> findByBalanceNot(BigDecimal balance);
}
