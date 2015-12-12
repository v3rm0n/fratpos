package ee.leola.kassa.repository;

import ee.leola.kassa.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	List<User> findByBalanceNot(BigDecimal balance);
}
