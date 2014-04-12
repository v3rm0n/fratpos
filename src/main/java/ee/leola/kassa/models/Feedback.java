package ee.leola.kassa.models;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.Query;

import javax.persistence.Entity;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by vermon on 23/03/14.
 */
@Entity
public class Feedback extends Model {

    private String content;

    private Date created = new Date();

    public String getFormattedTime() {
        DateFormat df = new SimpleDateFormat("hh:mm dd.MM.YYYY");
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

}
