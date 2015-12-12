package ee.leola.kassa.repository;

import ee.leola.kassa.models.Stocktaking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StocktakingRepository extends JpaRepository<Stocktaking, Long> {
}
