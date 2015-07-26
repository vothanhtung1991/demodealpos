$(document).ready(function () {
    var options = {
        chart: {
            renderTo: 'LineChart',
            borderWidth: 0,
            height: 260,
            spacingTop: -20,
            spacingRight: 15,
        },
        legend: {
            enabled: false
        },
        title: {
            text: '<br/>'
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                Month: '%b \'%y',
            },
            minTickInterval: 24 * 3600 * 1000,
            plotBands: []
        },
        yAxis: {
            gridLineColor: '#f4f4f4',
            min: 0,
            title: {
                text: ''
            },
            labels: {
                formatter: function () {
                    return Formatter.NumberAbbreviate(this.value);
                }
            }
        },
        tooltip: {
            //xDateFormat: '%d %b %Y', //format tooltip Date
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            series: {
                pointStart: '',
                pointInterval: 24 * 3600 * 1000, // one day interval
                lineWidth: 1,
                shadow: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }

            },
            area: 
                {
  
            }
        },
        series: []
    };

    // Load the data from the XML file 
    var xml = $("#Line_hfDataURL").val();
    GenerateLineChart(xml, options);

});


function GenerateLineChart(xml, options) {
    // Split the lines
    var xmlObj = $(xml);

    //push DateTime
    var dataElm = xmlObj.find('data');
    var from = dataElm.attr("from");

    options.plotOptions.series.pointStart = Date.UTC(from.substring(0, 4), from.substring(4, 6) - 1, from.substring(6, 8));
    //push series
    xmlObj.find('series').each(function (i, series) {
        if ($(series).find('name').text() == "Sales") {
            var seriesOptions = {
                name: $(series).find('name').text(),
                type: 'area',
                fillColor: 'rgba(166,201,101,0.3)',
                data: []
            };
        }
        else {
            var seriesOptions = {
                name: $(series).find('name').text(),
                type: 'area',
                fillOpacity: 0.3,
                data: []
            };
        }

        // push data points
        $(series).find('data point').each(function (i, point) {
            seriesOptions.data.push(
               eval($(point).text())
			    );
        });

        // add it to the options
        options.series.push(seriesOptions);
    });

    var chart = new Highcharts.Chart(options);
}
