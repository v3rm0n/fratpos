package info.kaara.fratpos.is.repository;

import info.kaara.fratpos.is.model.ObligationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObligationTypeRepository extends JpaRepository<ObligationType, Long> {
}
