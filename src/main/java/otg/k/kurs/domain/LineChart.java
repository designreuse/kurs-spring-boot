package otg.k.kurs.domain;

import lombok.Data;
import lombok.ToString;
import otg.k.kurs.dto.LineChartDto;

import javax.persistence.*;

@Data
@ToString(exclude = "site")
@Entity
@Table(name = "line_charts")
public class LineChart {

    @Id
    @GeneratedValue
    private long id;

    private int position;

    private String chartTitle;

    private String[][] data;

    @ManyToOne
    @JoinColumn(name = "site_id")
    private Site site;

    public LineChart() {
    }

    public LineChart(LineChartDto lineChartDto, Site site) {
        this.id = lineChartDto.getId();
        this.position = lineChartDto.getPosition();
        this.chartTitle = lineChartDto.getChartTitle();
        this.data = lineChartDto.getData();
        this.site = site;
    }
}
