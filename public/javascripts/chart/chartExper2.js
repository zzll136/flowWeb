// var chartWeight;
// var chartVortex;
var chartInverter;
var chartLevel;
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
                    text: '频率/Hz'
                    // color: '#5555aa'
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

$(function () {
    chartLevel = new Highcharts.Chart({
        credits: //版权标签，去掉版权标签
            {
                enabled: false
            },
        title: {
            text: '液位曲线'
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
                },
            },
        tooltip: { // 数据提示框
            shared: true,
            xDateFormat: '%M:%S',
        },
        legend: {
            // 图例
            enabled: true,
            borderWidth: 1,
            borderRadius: 3,
            layout: 'vertical',
            x: 180,
            y: -20
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
        series: [createEmptySeries('#5555aa', '实际液位'), createEmptySeries('#aaaa55', '超声波液位')]
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
//     series.name="超声波液位";
//     for (i = 0; i <= 100; i += 1) {
//         series.data.push({
//             x: 0,
//             y: 0
//         });
//     }
//     return series;
// };
// $(function() {
//     chartVortex = new Highcharts.Chart({
//         credits: {
//             enabled: false
//         },

//         title: {
//             text: '超声波液位曲线'
//         },
//         xAxis: {
//             type: 'datetime',
//             gridLineWidth: 1,

//             dateTimeLabelFormats: {
//                 second: '%M:%S',
//                 minute: '%M:%S',
//                 hour: '%M:%S',
//                 day: '%M:%S',
//                 week: '%M:%S',
//                 month: '%M:%S',
//                 year: '%M:%S'
//             },
//             title: {
//                 text: '时间'
//             }
//         },
//         yAxis: {
//             min: 0,
//             max: 300,
//             title: {
//                 text: '液位（mm）'
//             }
//         },
//         tooltip: {
//             shared: true,
//             xDateFormat: '%M:%S',
//         },
//         legend: {
//             enabled: false
//         },
//         plotOptions: {
//             area: {
//                 fillColor: {
//                     linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//                     stops: [
//                         [0, Highcharts.getOptions().colors[0]],
//                         [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
//                     ]
//                 },
//                 lineWidth: 1,
//                 marker: {
//                     enabled: false
//                 },
//                 shadow: false,
//                 states: {
//                     hover: {
//                         lineWidth: 1
//                     }
//                 },
//                 threshold: null
//             }
//         },

//         chart: {
//             zoomType: 'x',
//             spacingRight: 20,
//             marginBottom: 20,
//             renderTo: 'divChartUltrasonicLevel',
//             events: {}

//         },

//         series: [createEmptySeries()]
//     });

// });

