package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.Obligation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObligationRepository extends JpaRepository<Obligation, Long> {
}
