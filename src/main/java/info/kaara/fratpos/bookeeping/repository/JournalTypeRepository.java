package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.JournalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalTypeRepository extends JpaRepository<JournalType, Long> {
}
