package info.kaara.fratpos.is.repository;

import info.kaara.fratpos.is.model.Obligation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObligationRepository extends JpaRepository<Obligation, Long> {
}
