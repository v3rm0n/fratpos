package info.kaara.fratpos.pos.repository;

import info.kaara.fratpos.pos.model.Paytype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaytypeRepository extends JpaRepository<Paytype, Long> {
}
