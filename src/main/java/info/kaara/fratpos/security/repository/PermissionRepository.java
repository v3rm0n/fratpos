package info.kaara.fratpos.security.repository;

import info.kaara.fratpos.security.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
	List<Permission> findByNameIn(List<String> names);
}
