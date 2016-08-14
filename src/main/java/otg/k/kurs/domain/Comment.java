package otg.k.kurs.domain;

import lombok.Data;
import lombok.ToString;
import org.hibernate.search.annotations.Field;

import javax.persistence.*;
import java.util.Date;

@Data
@ToString(exclude = {"user", "site"})
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue
    private long commentId;

    @ManyToOne
    @JoinColumn(name = "username")
    private User user;

    @ManyToOne
    @JoinColumn(name = "site_name")
    private Site site;

    @Field
    private String comment;

    private Date date;

    public Comment(){}

}