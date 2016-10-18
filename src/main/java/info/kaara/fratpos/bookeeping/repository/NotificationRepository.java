package info.kaara.fratpos.bookeeping.repository;

import info.kaara.fratpos.bookeeping.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
