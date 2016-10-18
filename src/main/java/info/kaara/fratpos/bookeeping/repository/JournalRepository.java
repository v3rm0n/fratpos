package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
}
