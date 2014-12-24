package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
public class Feedback extends Model {

    @NotNull
    private String content;

    private Date created = new Date();

    public String getFormattedTime() {
        DateFormat df = new SimpleDateFormat("HH:mm dd.MM.YYYY");
        return df.format(created);
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public static Query<Feedback> find() {
        return Ebean.find(Feedback.class);
    }

}
