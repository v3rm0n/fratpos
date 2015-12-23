package ee.leola.kassa.user.repository;

import ee.leola.kassa.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	List<User> findByBalanceNot(BigDecimal balance);

	@Query("SELECT u FROM User u JOIN u.userProfile up WHERE up.email = :email")
	User findByEmail(@Param("email") String email);
}
