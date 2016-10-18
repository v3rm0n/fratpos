package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
}
