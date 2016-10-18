package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.Raport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RaportRepository extends JpaRepository<Raport, Long> {
}
