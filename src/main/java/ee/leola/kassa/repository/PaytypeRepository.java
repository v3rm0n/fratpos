package ee.leola.kassa.repository;

import ee.leola.kassa.models.Paytype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaytypeRepository extends JpaRepository<Paytype, Long> {
}
