//package otg.k.kurs.config;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.env.Environment;
//import org.springframework.security.crypto.encrypt.Encryptors;
//import org.springframework.social.UserIdSource;
//import org.springframework.social.config.annotation.ConnectionFactoryConfigurer;
//import org.springframework.social.config.annotation.EnableSocial;
//import org.springframework.social.config.annotation.SocialConfigurer;
//import org.springframework.social.connect.ConnectionFactoryLocator;
//import org.springframework.social.connect.UsersConnectionRepository;
//import org.springframework.social.connect.jdbc.JdbcUsersConnectionRepository;
//import org.springframework.social.facebook.connect.FacebookConnectionFactory;
//import org.springframework.social.security.AuthenticationNameUserIdSource;
//import org.springframework.social.twitter.connect.TwitterConnectionFactory;
//import org.springframework.social.vkontakte.connect.VKontakteConnectionFactory;
//import otg.k.kurs.service.AccountConnectionSignUpService;
//
//import javax.sql.DataSource;
//
//@Configuration
//@EnableSocial
//public class SocialConfig implements SocialConfigurer {
//
//    @Autowired
//    private DataSource dataSource;
//
//    @Override
//    public void addConnectionFactories(ConnectionFactoryConfigurer configurer, Environment env) {
//        configurer.addConnectionFactory(new TwitterConnectionFactory(
//                env.getProperty("spring.social.twitter.app-id"),
//                env.getProperty("spring.social.twitter.app-secret")
//        ));
//        configurer.addConnectionFactory(new FacebookConnectionFactory(
//                env.getProperty("spring.social.facebook.app-id"),
//                env.getProperty("spring.social.facebook.app-secret")
//        ));
//        configurer.addConnectionFactory(new VKontakteConnectionFactory(
//                env.getProperty("spring.social.vk.app-id"),
//                env.getProperty("spring.social.vk.app-secret")
//        ));
//    }
//
//    @Override
//    public UserIdSource getUserIdSource() {
//        return new AuthenticationNameUserIdSource();
//    }
//
//    @Override
//    public UsersConnectionRepository getUsersConnectionRepository(ConnectionFactoryLocator connectionFactoryLocator) {
//        JdbcUsersConnectionRepository repository =
//                new JdbcUsersConnectionRepository(dataSource, connectionFactoryLocator, Encryptors.noOpText());
//        repository.setConnectionSignUp(new AccountConnectionSignUpService());
//        return repository;
//    }
//}
