package otg.k.kurs.event;

import otg.k.kurs.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Locale;

@Component
public class RegistrationListener implements ApplicationListener<OnRegistrationCompleteEvent> {

    @Autowired
    private MessageSource messages;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    @Async
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        new Thread( () -> {confirmRegistration(event);} ).start();
    }

    @Async
    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        try {
            mailSender.send(createMessage(event));
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    @Async
    private MimeMessage createMessage(OnRegistrationCompleteEvent event) throws MessagingException {
        User user = event.getUser();
        String name = user.getFirstname();
        String email = user.getEmail();
        String token = event.getToken();
        String url = event.getApplicationUrl();
        Locale locale = event.getLocale();

        String subject = messages.getMessage("registration.confirmSubject", null, locale);
        String confirmationUrl = url
                + "/confirm?confirm_token=" + token;
        String message = messages.getMessage("registration.confirmMessage", new Object[] {name, confirmationUrl}, locale);
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(message, true);
        return mimeMessage;
    }
}