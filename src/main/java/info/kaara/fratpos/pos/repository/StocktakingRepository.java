package info.kaara.fratpos.pos.repository;

import info.kaara.fratpos.pos.model.Stocktaking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StocktakingRepository extends JpaRepository<Stocktaking, Long> {
}
