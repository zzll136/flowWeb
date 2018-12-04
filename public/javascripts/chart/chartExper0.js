var chartWeight;
var chartFlow;
var chartInverter;
$(function () {
    chartWeight = new Highcharts.Chart({
        credits: //版权标签，去掉版权标签
            {
                enabled: false
            },
        title: {
            text: '容器质量曲线'
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
                max: 30,
                minPadding: 0,
                startOnTick: false,
                title: {
                    text: '质量/kg',
                    color: '#5555aa'
                }
            },
        // {
        //     min: 30,
        //     max: 60,
        //     minPadding:0,
        //     startOnTick:false,
        //     title: {
        //         text: '频率/Hz',
        //         color:'#808080'
        //     }
        // }

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
            // 引用到id为divChartWeight中
            renderTo: 'divChartWeight',
            events: {}
        },
        series: [createEmptySeries()]
    });
});

$(function () {
    chartFlow = new Highcharts.Chart({
        credits: {
            enabled: false
        },

        title: {
            text: '涡街流量计流量曲线'
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
            minPadding: 0,
            startOnTick: false,
            min: 0,
            max: 3,
            title: {
                text: '流量(m^3/h)'
            }
        },
        tooltip: {
            shared: true,
            xDateFormat: '%M:%S',
        },
        legend: {
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
            renderTo: 'divChartVortex',
            events: {}

        },
        series: [createEmptySeries()]
    });
});

$(function () {
    chartInverter = new Highcharts.Chart({
        credits: //版权标签，去掉版权标签
            {
                enabled: false
            },
        title: {
            text: '变频器频率曲线'
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
                max: 50,
                minPadding: 0,
                startOnTick: false,
                title: {
                    text: '频率/Hz',
                    color: '#5555aa'
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
            // 引用到id为divChartWeight中
            renderTo: 'divChartInverter',
            events: {}
        },
        series: [createEmptySeries()]
    });
});
// function createEmptySeriess() {
//     var series = new Array();
//     series[0].pointInterval = 1000;
//     series[0].pointStart = 0;
//     series[0].data = [];
//     series[0].color = '#5555aa';
//     for (i = 0; i <= 100; i += 1) {
//         series[0].data.push({
//             x: 0,
//             y: 0
//         });
//     }
//     series[1].pointInterval = 1000;
//     series[1].pointStart = 0;
//     series[1].data = [];
//     series[1].color = '#808080';
//     for (i = 0; i <= 100; i += 1) {
//         series[1].data.push({
//             x: 0,
//             y: 0
//         });
//     }
//     return series;
// };

function createEmptySeries() {
    var series = new Array();
    series.pointInterval = 1000;
    series.pointStart = 0;
    series.data = [];
    series.color = '#5555aa';
    for (i = 0; i <= 100; i += 1) {
        series.data.push({
            x: 0,
            y: 0
        });
    }
    return series;
};

// function createEmptySeries1() {
//     var series = new Array();
//     series.pointInterval = 1000;
//     series.pointStart = 0;
//     series.data = [];
//     series.color = '#808080';
//     for (i = 0; i <= 100; i += 1) {
//         series.data.push({
//             x: 0,
//             y: 0
//         });
//     }
//     return series;
// };