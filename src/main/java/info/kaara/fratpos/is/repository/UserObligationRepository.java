package info.kaara.fratpos.is.repository;

import info.kaara.fratpos.is.model.UserObligation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserObligationRepository extends JpaRepository<UserObligation, Long> {
}
