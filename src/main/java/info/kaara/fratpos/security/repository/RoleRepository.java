package info.kaara.fratpos.security.repository;

import info.kaara.fratpos.security.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

	Role findOneByName(String name);

}
