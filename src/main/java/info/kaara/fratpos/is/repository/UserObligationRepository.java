package info.kaara.fratpos.is.repository;

import info.kaara.fratpos.is.model.Obligation;
import info.kaara.fratpos.is.model.UserObligation;
import info.kaara.fratpos.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserObligationRepository extends JpaRepository<UserObligation, Long> {

	List<UserObligation> findByUser(User user);

	List<UserObligation> findByObligation(Obligation obligation);
}
