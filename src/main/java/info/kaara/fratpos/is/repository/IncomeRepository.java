package info.kaara.fratpos.is.repository;

import info.kaara.fratpos.is.model.Income;
import info.kaara.fratpos.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {

	List<Income> findByUser(User user);
}
