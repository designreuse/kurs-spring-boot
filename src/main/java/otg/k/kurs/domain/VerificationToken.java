package otg.k.kurs.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tokens")
public class VerificationToken {

    private static final int EXPIRATION = 60 * 24;

    @Id
    @GeneratedValue
    private Long id;

    private String token;

    @ManyToOne
    @JoinColumn(name = "username")
    private User user;

    private Date expiryDate;

    public VerificationToken(User user) {
        this.token = UUID.randomUUID().toString();;
        this.user = user;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    public void refreshToken(){
        this.token = UUID.randomUUID().toString();;
        this.expiryDate = calculateExpiryDate(EXPIRATION);
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Timestamp(calendar.getTime().getTime()));
        calendar.add(Calendar.MINUTE, expiryTimeInMinutes);
        return new Date(calendar.getTime().getTime());
    }

}
