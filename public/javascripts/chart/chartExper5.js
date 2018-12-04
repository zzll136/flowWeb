// var chartWeight;
// var chartVortex;
// var chartInverter;
var chartLevel;
var chartULevel;
$(function() {
    chartLevel = new Highcharts.Chart({
        credits: //版权标签，去掉版权标签
        {
            enabled: false
        },
        title: {
            text: '实际液位曲线'
        },
        xAxis: {
            // 设置x轴为时间轴
            type: 'datetime',
            gridLineWidth: 1,
            // min:0,
            // max:900000,
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
        yAxis: 
        {
            min: 0,
            max: 300,
            minPadding:0,
            startOnTick:false,
            title: {
                text: '液位/mm',
                color:'#5555aa'
            }
        },
        tooltip: { // 数据提示框
            shared: true,
            xDateFormat: '%M:%S',
        },
        legend: {
            // 图例
            enabled: false
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
        series: [createEmptySeries()]
    });
});


$(function() {
    chartULevel = new Highcharts.Chart({
        credits: //版权标签，去掉版权标签
        {
            enabled: false
        },
        title: {
            text: '超声波液位曲线'
        },
        xAxis: {
            // 设置x轴为时间轴
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
        yAxis: 
        {
            min: 0,
            max: 300,
            title: {
                text: '液位/mm'
            }
        },
        tooltip: { // 数据提示框
            shared: true,
            xDateFormat: '%M:%S',
        },
        legend: {
            // 图例
            enabled: false
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
            renderTo: 'divChartUltrasonicLevel',
            events: {}
        },
        series: [createEmptySeries()]
    });
});

function createEmptySeries() {
    var series = new Array();
    series.pointInterval = 1000;
    series.pointStart = 0;
    series.data = [];
    for (i = 0; i <= 100; i += 1) {
        series.data.push({
            x: 0,
            y: 0
        });
    }
    return series;
};