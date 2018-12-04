var chartLevel;
$(function() {
    chartLevel = new Highcharts.Chart({
        credits: {
            enabled: false
        },

        title: {
            text: '液位曲线'
        },
        xAxis: {
            type: 'datetime',
            gridLineWidth: 1,

            dateTimeLabelFormats: {
                second: '%M:%S',
                minute: '%M:%S',
                hour: '%M:%S',
                day: '%M:%S',
                week: '%M:%S',
                month: '%M:%S',
                year: '%M:%S'
            },
            title: {
                text: '时间'
            }
        },
        yAxis: {
            min: 0,
            max: 250,
            title: {
                text: '液位(mm)'
            }
        },
        tooltip: {
            shared: true,
            xDateFormat: '%M:%S',
        },
        legend: {
            enabled: true,
            borderWidth: 1,
            borderRadius: 3,
            layout: 'vertical',
            x: 30,
            y: -180
        },

        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                lineWidth: 1,
                marker: {
                    enabled: false
                },
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        chart: {
            zoomType: 'x',
            spacingRight: 20,
            marginBottom: 20,
            renderTo: 'divChartLevel',
            events: {}

        },

        series: [createEmptySeries('#5555aa', '实际液位'), createEmptySeries('#aaaa55', '二次仪表计算液位')]
    });

});

function createEmptySeries(color, name) {
    var series = new Array();
    series.pointInterval = 1000;
    series.pointStart = 0;
    series.data = [];
    if (name) series.name = name;

    if (color) series.color = color;
    else series.color = '#5555aa';
    for (var i = 0; i <= 100; i += 1) {
        series.data.push({
            x: 0,
            y: 0
        });
    }
    return series;
};