package info.kaara.fratpos.is.repository;

import info.kaara.fratpos.is.model.IncomeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeTypeRepository extends JpaRepository<IncomeType, Long> {
}
