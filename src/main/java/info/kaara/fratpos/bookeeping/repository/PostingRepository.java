package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.Posting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostingRepository extends JpaRepository<Posting, Long> {
}
