package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountTypeRepository extends JpaRepository<AccountType, Long> {
}
