package info.kaara.fratpos.user.repository;

import info.kaara.fratpos.user.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
	List<Permission> findByNameIn(List<String> names);
}
