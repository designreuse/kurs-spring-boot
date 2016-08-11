package otg.k.kurs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import otg.k.kurs.domain.Site;
import otg.k.kurs.domain.User;

public interface SiteRepository extends JpaRepository<Site, String> {

    Site findByUser(User User);

    Site findBySiteName(String siteName);

}
