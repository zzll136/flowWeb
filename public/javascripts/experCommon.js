window.onload = function () {
    updateFrequencyValue();
    recordExpLog('进入实验');
}

$(document).on("click", "#buttonStartExperiment", function (e) {
    // $('#buttonStartExperiment').click(function (e) {
    if (experimentStatus == 0) //目前是停止实验的状态，现在要开始实验
    {
        var status;
        var expTime = new Date();
        var y = expTime.getFullYear();
        var m = addZero(expTime.getMonth() + 1);
        var d = addZero(expTime.getDate());
        var h = addZero(expTime.getHours());
        var min = addZero(expTime.getMinutes());
        var t = y + "-" + m + "-" + d;
        h = h + ":00";
        // $.post('/experiment/judgeTime', {
        //     // courseid: 0
        // }, function (results) {
        //     var result_str = [];
        //     result_str = results.split(",");
        //     for (i = 0; i < result_str.length; i++) {
        //         if (result_str[i] == t)
        //             break;
        //     }
        //     if (i == result_str.length) alert("今天实验不开放");
        //     else {
        if (role == "s") {
            $.post('/experiment/judgeOrder', {
                t: t,
                h: h
            }, function (time) {
                if (time.num == 0)
                    alert("未预约该时间段" + h + "的实验"); 
                else if (min > 30) {alert("已迟到30min以上，不能继续做实验"); return;}
                else {
                    $.post('/experiment/courseInfo', { orderYear: time.year }, function (result) {
                        if (result != "none") {
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].courseID == courseid)
                                    status = result[i].status;
                            }
                            switch (status) {
                                case 0:
                                    if (confirm('你即将开始实验，继续请按确认'))
                                        break;
                                    else return;
                                case 1:
                                    if (confirm('您已完成此实验,重做会覆盖之前的实验记录,继续请按确认。'))
                                        break;
                                    else return;
                                case 2:
                                    alert('您已提交报告,不能重新进行此实验');
                                    return;
                            }
                        }
                        $.post('/experiment/tableMatch', {
                            courseid: courseid,
                            min: min,
                            t: t,
                            h: h,
                        }, function (data) {
                            tableid = data;
                            if (tableid == 7) {
                                alert("实验桌临时故障，很抱歉，请重新预约！");
                            }
                            else {
                                experimentStatus = 1; //实验状态设置为已经开始实验
                                //Create_socket();
                                socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
                                // chartWeight.series[0].remove();
                                // chartWeight.addSeries(createEmptySeries());
                                // chartVortex.series[0].remove();
                                // chartVortex.addSeries(createEmptySeries());
                                time = 0;
                                recordExpLog('开始实验');
                                setButtonsByStatus();//按钮的字变成结束实验
                                openCamera(tableid);
                                //buttonSet();
                            }
                        });
                    });
                }
            });
        }
        else if (role == "t") {
            $.post('/experiment/judgeOrder', {
                t: t,
                h: h
            }, function (time) {
                if (time.num == 0)
                    alert("未预约该时间段" + h + "的实验");
                else {
                    $.post('/experiment/tableMatch', {
                        courseid: courseid,
                        min: min,
                        t: t,
                        h: h
                    }, function (data) {
                        tableid = data;
                        if (tableid == 7) {
                            alert("实验桌临时故障，很抱歉，请重新预约！");
                        }
                        else {
                            experimentStatus = 1; //1是运行状态，socket.emit('emitEvent',data),socket.on('emitEvent',function(data){});
                            //Create_socket();
                            socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
                            // chartWeight.series[0].remove();
                            // chartWeight.addSeries(createEmptySeries());
                            // chartVortex.series[0].remove();
                            // chartVortex.addSeries(createEmptySeries());
                            time = 0;
                            recordExpLog('开始实验');
                            setButtonsByStatus();
                            openCamera(tableid);
                            //buttonSet();
                        }
                    });
                }
            });
        }
        else if (role == "m") {
            tableid = document.getElementsByTagName("select")[0].value;
            $.post('/experiment/setstatus', {
                tableid: tableid
            }, function (data) {
                if (!tableid) alert("无可用实验桌");
                else if (data !== "1") {
                    alert("实验桌被占用,请重新选择");
                }
                else {
                    experimentStatus = 1; //1是运行状态，socket.emit('emitEvent',data),socket.on('emitEvent',function(data){});
                    //Create_socket();
                    socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
                    // chartWeight.series[0].remove();
                    // chartWeight.addSeries(createEmptySeries());
                    // chartVortex.series[0].remove();
                    // chartVortex.addSeries(createEmptySeries());
                    time = 0;
                    recordExpLog('开始实验');
                    setButtonsByStatus();
                    openCamera(tableid);
                    //buttonSet();
                }
            });
        }
        else if (role == "n") {
            alert("请先登陆");
            return;
        }
    }
    else if (experimentStatus == 1) {  //说明是已经开始实验的状态，现在要结束实验
        if (confirm('是否确认结束实验？')) {
            if (courseid == 6 || courseid == 7 || courseid == 8) {
                $.post('/experiment/codeReset', {
                    codeid: courseid
                }, function (data) { });
            }
            $.post('/experiment/tableFree', {
                tableid: tableid
            }, function (data) { });
            // 将实验状态改为结束实验的状态
            experimentStatus = 0;
            socket.emit('stopExperiment', tableid);
            recordExpLog('结束实验');
            setButtonsByStatus();
            window.location.href = location.href;
        }
        // buttonSet();
    }
    else {
        // 说明此事状态值为2，表示重置后开始实验
        experimentStatus = 1; //1是运行状态，socket.emit('emitEvent',data),socket.on('emitEvent',function(data){});
        document.getElementById('frequencySlider').value = 30;
        socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
        chartReset();
        time = 0;
        recordExpLog('重置后开始实验');
        setButtonsByStatus();
        //buttonSet();
    }
    //setButtonsByStatus();
});

//重置实验,停止水泵,打开出水阀
$(document).on("click", "#buttonResetExperiment", function (e) {
    // $('#buttonResetExperiment').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        experimentStatus = 2;//设置为2 表示重置实验
        setButtonsByStatus();
        socket.emit('resetExperiment', tableid);
        recordExpLog('重置实验');
    }
});

// if(role == "m")
// {
//  $.get('/experiment/getstatus', {    
//  },function(data)
//  {
// var choose=$("#choose");
// for(var i=0;i<data.length;i++){
//     if(data[i].status==1)
//     choose.append("<option>"+data[i].tableid+"号实验桌</option>");
// }
// });
// }

// 实验记录
function addZero(n) {
    if (n < 10) return "0" + n;
    return n;
}
var courseid;
var urlstr = window.location.href;
courseid = urlstr.substring(urlstr.length, urlstr.length - 1);
// function judgetime(courseid) {
//     var expTime =new Date();
//     var y = expTime.getFullYear();
//     var m = addZero(expTime.getMonth() + 1);
//     var d = addZero(expTime.getDate());
//     var t = y + "-" + m + "-" + d;
//     var i = 7;
//     $.post('/experiment/judgeTime', {
//         courseid: courseid
//     }, function (results) {
//         var result_str = [];
//         result_str = results.split(",");
//         for (i = 0; i < result_str.length; i++) {
//             if (result_str[i] == t)
//             break;
//         }
//         return i;
//     });
//     return i;
// }

function openCamera(tableid) {
    switch (tableid) {
        case "0":
            {
                document.getElementById("v1").src = "rtmp://rtmp.open.ys7.com/openlive/73933847faa847cbba01a05314d59e09";
                document.getElementById("v2").src = "http://hls.open.ys7.com/openlive/73933847faa847cbba01a05314d59e09.m3u8";
            }
            break;
        case "1":
            {
                document.getElementById("v1").src = "rtmp://rtmp.open.ys7.com/openlive/ac6f44e94cd448328e9df3e21d2f0ae8";
                document.getElementById("v2").src = "http://hls.open.ys7.com/openlive/ac6f44e94cd448328e9df3e21d2f0ae8.m3u8";
            }
            break;
        case "2":
            {
                document.getElementById("v1").src = "rtmp://rtmp.open.ys7.com/openlive/f59d741b2206415c8be80e93fc5ad75a";
                document.getElementById("v2").src = "http://hls.open.ys7.com/openlive/f59d741b2206415c8be80e93fc5ad75a.m3u8";
            }
            break;
        case "3":
            {
                document.getElementById("v1").src = "rtmp://rtmp.open.ys7.com/openlive/97ae5cf773d944ed8b7049feed9eb7a4.hd";
                document.getElementById("v2").src = "http://hls.open.ys7.com/openlive/97ae5cf773d944ed8b7049feed9eb7a4.m3u8";
            }
            break;
        case "4":
            {
                document.getElementById("v1").src = "rtmp://rtmp.open.ys7.com/openlive/f418b31e6d704987a17a45ac6e543625";
                document.getElementById("v2").src = "http://hls.open.ys7.com/openlive/f418b31e6d704987a17a45ac6e543625.m3u8";
            }
            break;
    }
    var player = new EZUIPlayer('video-canvas');
    //player.emit('play');
    player.on('error', function () {
        console.log('error');
    });
    player.on('play', function () {
        console.log('play');
    });
    player.on('pause', function () {
        console.log('pause');
    });
}
function recordExpLog(text) {
    var date = new Date();
    var y = date.getFullYear();
    var m = addZero(date.getMonth() + 1);
    var d = addZero(date.getDate());
    var h = addZero(date.getHours());
    var min = addZero(date.getMinutes());
    var s = addZero(date.getSeconds());

    document.getElementById('expLog').innerText += y + "-" + m + "-" + d + "  " + h + ":" + min + ":" + s + "\r\n";
    document.getElementById('expLog').innerText += "<" + text + ">\r\n";

    //滚至最底部
    document.getElementById("expLog").scrollTop = document.getElementById("expLog").scrollHeight;
}
function getTableContent(id) {
    var mytable = document.getElementById(id);
    var data = [];
    for (var i = 0, rows = mytable.rows.length; i < rows; i++) {
        for (var j = 0, cells = mytable.rows[i].cells.length; j < cells; j++) {
            if (!data[i]) {
                data[i] = new Array();
            }
            data[i][j] = mytable.rows[i].cells[j].innerHTML;
        }
    }
    return data;
}

function WeightError() {
    document.getElementById("WeightError").style.visibility = "visible";
    document.getElementById("WeightError").style.opacity = "0.8";
    document.getElementById("WeightError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
    document.getElementById("WeightError").style.zIndex = "1000";
    recordExpLog('错误:电子秤采集数据失败');
}

function VortexError() {
    document.getElementById("VortexError").style.visibility = "visible";
    document.getElementById("VortexError").style.opacity = "0.8";
    document.getElementById("VortexError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
    document.getElementById("VortexError").style.zIndex = "1000";
    recordExpLog('错误:涡街流量计采集数据失败');
}

function LevelError() {
    document.getElementById("LevelError").style.visibility = "visible";
    document.getElementById("LevelError").style.opacity = "0.8";
    document.getElementById("LevelError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
    document.getElementById("LevelError").style.zIndex = "1000";
    recordExpLog('错误:超声波液位计采集数据失败');
}
function HeatError() {
    document.getElementById("HeatError").style.visibility = "visible";
    document.getElementById("HeatError").style.opacity = "0.8";
    document.getElementById("HeatError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
    document.getElementById("HeatError").style.zIndex = "1000";
    recordExpLog('错误:超声波流量计(热能表)采集数据失败');
}

//--主实验界面鼠标事件-->





function hideInstrumnts() {
    document.getElementById("UltraSonicFlowmeterLive").style.display = "none";
    document.getElementById("VortexLive").style.display = "none";
}

function hideInstrumentIntroductions() {
    //隐藏所有信息显示窗口
    document.getElementById("UltraSonicFlowmeter").style.visibility = "hidden";
    document.getElementById("UltraSonicFlowmeter").style.opacity = "0";
    document.getElementById("UltraSonicFlowmeter").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("UltraSonicFlowmeter").style.zIndex = "500";

    document.getElementById("UltraSonicDistance").style.visibility = "hidden";
    document.getElementById("UltraSonicDistance").style.opacity = "0";
    document.getElementById("UltraSonicDistance").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("UltraSonicDistance").style.zIndex = "500";

    document.getElementById("VortexMeter").style.visibility = "hidden";
    document.getElementById("VortexMeter").style.opacity = "0";
    document.getElementById("VortexMeter").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("VortexMeter").style.zIndex = "500";

    // document.getElementById("experimentIntroduction").style.visibility = "hidden";
    // document.getElementById("experimentIntroduction").style.opacity = "0";
    // document.getElementById("experimentIntroduction").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    // document.getElementById("experimentIntroduction").style.zIndex = "500";

}

function setButtonsByStatus() {
    // 状态1是开始试验
    switch (experimentStatus) {
        case 0:
            document.getElementById("buttonStartExperiment").innerText = "开始实验";
            break;
        case 1:
            document.getElementById("buttonStartExperiment").innerText = "结束实验";
            break;
        case 2:
            document.getElementById("buttonStartExperiment").innerText = "开始实验";
            break;
        // case 3:
        //     document.getElementById("buttonStartExperiment").innerText = "开始实验";
        //     break;
        default:
            document.getElementById("buttonStartExperiment").innerText = "开始实验";
            experimentStatus = 0;
    }
};

const ULTRAFLOW_X1 = 310;
const ULTRAFLOW_X2 = 370;
const ULTRAFLOW_Y1 = 260;
const ULTRAFLOW_Y2 = 305;//超声波流量计

const ULTRADIST_X1 = 640;
const ULTRADIST_X2 = 680;
const ULTRADIST_Y1 = 90;
const ULTRADIST_Y2 = 140;//超声波液位计

const VORTEX_X1 = 420;
const VORTEX_X2 = 480;
const VORTEX_Y1 = 220;
const VORTEX_Y2 = 300;//涡街流量计

//鼠标移动至相应传感器位置时,显示放大的传感器实时画面
// $("#experiment").mousemove(function(e) {}
$(document).on("mousemove", "#experiment", function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    // var x = e.clientX;
    // var y = e.clientY;
    // var x = e.screenX;
    // var y = e.screenY;
    // var x = e.pageX;
    // var y = e.pageY;
    var m_x = x - document.getElementById("experiment").offsetLeft;
    //var m_y=y - document.getElementById("experiment").offsetTop; //当浏览器窗口宽度比页面宽度大时,中间的内容会有偏差,需要校正
    // console.log("x:" + m_x + "  y:" + y);

    if (m_x > ULTRAFLOW_X1 && m_x < ULTRAFLOW_X2 && y > ULTRAFLOW_Y1 && y < ULTRAFLOW_Y2) {
        document.getElementById("experiment").style.cursor = "Pointer";//鼠标箭头变成小手

        //实时仪器跟踪鼠标
        document.getElementById("UltraSonicFlowmeterLive").style.display = "block";//超声波流量计
        document.getElementById("UltraSonicFlowmeterLive").style.left = (parseInt(x) + 20) + "px";
        document.getElementById("UltraSonicFlowmeterLive").style.top = (parseInt(y) + 20) + "px";
    } else if (m_x > ULTRADIST_X1 && m_x < ULTRADIST_X2 && y > ULTRADIST_Y1 && y < ULTRADIST_Y2) {
        document.getElementById("experiment").style.cursor = "Pointer";

    } else if (m_x > VORTEX_X1 && m_x < VORTEX_X2 && y > VORTEX_Y1 && y < VORTEX_Y2) {//涡街流量计
        document.getElementById("experiment").style.cursor = "Pointer";

        document.getElementById("VortexLive").style.display = "block";
        document.getElementById("VortexLive").style.left = (parseInt(x) + 20) + "px";
        document.getElementById("VortexLive").style.top = (parseInt(y) - 100) + "px";
    } else {
        hideInstrumnts();
        document.getElementById("experiment").style.cursor = "Default";

    }
});

// 点击实验界面相应位置时,弹框显示传感器原理界面
// $('#experiment').click(function(e) {
$(document).on("click", "#experiment", function (e) {
    var x = e.offsetX;
    var y = e.offsetY;
    x = x - document.getElementById("experiment").offsetLeft;
    // var x = e.pageX - document.getElementById("experiment").offsetLeft;
    // var y = e.pageY;
    //console.log("x1:" + x + "  y1:" + y);
    if (x > ULTRAFLOW_X1 && x < ULTRAFLOW_X2 && y > ULTRAFLOW_Y1 && y < ULTRAFLOW_Y2) {
        hideInstrumnts();
        hideInstrumentIntroductions();
        document.getElementById("UltraSonicFlowmeter").style.visibility = "visible";
        document.getElementById("UltraSonicFlowmeter").style.opacity = "1";
        document.getElementById("UltraSonicFlowmeter").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
        document.getElementById("UltraSonicFlowmeter").style.zIndex = "1000";
    } else if (x > ULTRADIST_X1 && x < ULTRADIST_X2 && y > ULTRADIST_Y1 && y < ULTRADIST_Y2) {
        hideInstrumnts();
        hideInstrumentIntroductions();
        document.getElementById("UltraSonicDistance").style.visibility = "visible";
        document.getElementById("UltraSonicDistance").style.opacity = "1";
        document.getElementById("UltraSonicDistance").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
        document.getElementById("UltraSonicDistance").style.zIndex = "1000";

    } else if (x > VORTEX_X1 && x < VORTEX_X2 && y > VORTEX_Y1 && y < VORTEX_Y2) {
        hideInstrumnts();
        hideInstrumentIntroductions();
        document.getElementById("VortexMeter").style.visibility = "visible";
        document.getElementById("VortexMeter").style.opacity = "1";
        document.getElementById("VortexMeter").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
        document.getElementById("VortexMeter").style.zIndex = "1000";

    } else {
        hideInstrumentIntroductions();
    }
});

//警告确认按钮
// $('#OverflowOK').click(function(e) {
function overflow() {
    document.getElementById("WarningOverflow").style.visibility = "hidden";
    document.getElementById("WarningOverflow").style.opacity = "0";
    document.getElementById("WarningOverflow").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("WarningOverflow").style.zIndex = "500";
};

//电子秤采集失败确认按钮
$(document).on("click", "#WeightOK", function (e) {
    // $('#WeightOK').click(function(e) { 
    document.getElementById("WeightError").style.visibility = "hidden";
    document.getElementById("WeightError").style.opacity = "0";
    document.getElementById("WeightError").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("WeightError").style.zIndex = "500";
});
//涡街流量计采集失败确认按钮
$(document).on("click", "#VortexOK", function (e) {
    // $('#VortexOK').click(function(e) {
    document.getElementById("VortexError").style.visibility = "hidden";
    document.getElementById("VortexError").style.opacity = "0";
    document.getElementById("VortexError").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("VortexError").style.zIndex = "500";
});
//超声波液位计采集失败确认按钮
$(document).on("click", "#LevelOK", function (e) {
    // $('#LevelOK').click(function(e) {
    document.getElementById("LevelError").style.visibility = "hidden";
    document.getElementById("LevelError").style.opacity = "0";
    document.getElementById("LevelError").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("LevelError").style.zIndex = "500";
});
//热能表采集数据失败确认按钮
$(document).on("click", "#HeatOK", function (e) {
    // $('#HeatOK').click(function(e) {
    document.getElementById("HeatError").style.visibility = "hidden";
    document.getElementById("HeatError").style.opacity = "0";
    document.getElementById("HeatError").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("HeatError").style.zIndex = "500";
});
//变频器故障确认按钮
// $('#FreqOK').click(function(e) {
//     document.getElementById("FreqError").style.visibility = "hidden";
//     document.getElementById("FreqError").style.opacity = "0";
//     document.getElementById("FreqError").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
//     document.getElementById("FreqError").style.zIndex = "500";
// });

//提示确认按钮
$(document).on("click", "#resetFinishedOK", function (e) {
    // $('#resetFinishedOK').click(function(e) {
    document.getElementById("WarningResetFinished").style.visibility = "hidden";
    document.getElementById("WarningResetFinished").style.opacity = "0";
    document.getElementById("WarningResetFinished").style.transition = "visibility 0s ease-in-out 0.2s,opacity 0.2s ease-in-out";
    document.getElementById("WarningResetFinished").style.zIndex = "500";
});

// 实验介绍弹窗
// $(document).on("click","#menuLesson",function(e) {
// $("#buttonExpIntro").click(function(e) {
// hideInstrumnts();
// hideInstrumentIntroductions();
// var isVisible = document.getElementById("experimentIntroduction").style.visibility;
// if( isVisible === "visible"){
//     document.getElementById("experimentIntroduction").style.visibility ="hidden";
// }else{
// document.getElementById("experimentIntroduction").style.visibility = "visible";
// document.getElementById("experimentIntroduction").style.opacity = "1";
// document.getElementById("experimentIntroduction").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
// document.getElementById("experimentIntroduction").style.zIndex = "500";
// }
// });


// 实时视频显示窗口              
var max = false;
$(document).on("click", "#liveVideo", function (e) {
    max = !max;
    if (max) {
        document.getElementById("liveVideo").style.width = "1112px";
        document.getElementById("liveVideo").style.height = "800px";
        document.getElementById("liveVideo").style.left = "234px";

    } else {
        document.getElementById("liveVideo").style.width = "293px";
        document.getElementById("liveVideo").style.height = "181px";
        document.getElementById("liveVideo").style.left = "1053px";

    }
});
var sw1Status = 0, sw2Status = 0, sw3Status = 0;
// 记录按键的动作 socket.emit发送命令和数据，另一端用socket.on接收
$(document).on("click", "#sw1", function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        sw1Status = 1;
        socket.emit('controlValves', 'in', tableid, !document.getElementById('sw1').checked);//阀A 被选中返回真 即数据1 
        recordExpLog(document.getElementById('sw1').checked ? '打开进水阀' : '关闭进水阀');
    }
});
$(document).on("click", "#sw2", function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        sw2Status = 1;
        socket.emit('controlValves', 'side', tableid, !document.getElementById('sw2').checked);//阀门C
        recordExpLog(document.getElementById('sw2').checked ? '打开侧阀' : '关闭侧阀');
    }
});
// $(document).on("click","#sw3",function(e) {
//     socket.emit('controlValves', 'out', document.getElementById('sw3').checked);
//     recordExpLog(document.getElementById('sw3').checked ? '打开出水阀' : '关闭出水阀');//阀门B
// });
$(document).on("click", "#sw3", function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        sw3Status = 1;
        socket.emit('controlValves', 'out', tableid, !document.getElementById('sw3').checked);
        recordExpLog(document.getElementById('sw3').checked ? '打开出水阀' : '关闭出水阀');
    }//阀门B
});

function updateFrequencyValue() {
    //改变滑动条外观
    document.getElementById("sValidRange").style.width = document.getElementById("frequencySlider").value * 3 + "px";
    document.getElementById('labelFrequency').innerHTML = document.getElementById('frequencySlider').value + ' Hz';
    document.getElementById('labelFrequencySide').innerHTML = document.getElementById('frequencySlider').value + ' Hz';

}

function chartReset() {
    if (courseid == 0 || courseid == 1) {
        chartWeight.series[0].remove();
        chartFlow.series[0].remove();
        chartInverter.series[0].remove();
        chartWeight.addSeries(createEmptySeries());
        chartFlow.addSeries(createEmptySeries());
        chartInverter.addSeries(createEmptySeries());
    }
    if (courseid == 2) {
        chartLevel.series[0].remove();
        chartLevel.series[0].remove();
        chartInverter.series[0].remove();
        chartLevel.addSeries(createEmptySeries('#5555aa', '实际液位'));
        chartLevel.addSeries(createEmptySeries('#aaaa55', '超声波液位'));
        chartInverter.addSeries(createEmptySeries());
    }
    if (courseid == 3) {
        chartFlow.series[0].remove();
        chartFlow.series[0].remove();
        chartInverter.series[0].remove();
        chartFlow.addSeries(createEmptySeries('#5555aa', '实际流量'));
        chartFlow.addSeries(createEmptySeries('#aaaa55', '涡街流量计流量'));
        chartInverter.addSeries(createEmptySeries());
    }
    if (courseid == 4) {
        chartFlow.series[0].remove();
        chartFlow.series[0].remove();
        chartInverter.series[0].remove();
        chartFlow.addSeries(createEmptySeries('#5555aa', '实际流量'));
        chartFlow.addSeries(createEmptySeries('#aaaa55', '超声波流量'));
        chartInverter.addSeries(createEmptySeries());
    }
    if (courseid == 5) {
        chartLevel.series[0].remove();
        chartULevel.series[0].remove();
        chartLevel.addSeries(createEmptySeries());
        chartULevel.addSeries(createEmptySeries());
    }
    if (courseid == 6 || courseid == 7) {
        chartLevel.series[0].remove();
        chartLevel.series[0].remove();
        chartLevel.addSeries(createEmptySeries('#5555aa', '实际瞬时流量'));
        chartLevel.addSeries(createEmptySeries('#aaaa55', '二次仪表计算流量'));
    }
    if (courseid == 8) {
        chartLevel.series[0].remove();
        chartLevel.series[0].remove();
        chartLevel.addSeries(createEmptySeries('#5555aa', '实际液位'));
        chartLevel.addSeries(createEmptySeries('#aaaa55', '二次仪表计算液位'));
    }
}

function LeastSquare(x, y) {
    var t1 = 0;
    var t2 = 0;
    var t3 = 0;
    var t4 = 0;
    for (var i = 0; i < x.length; i++) {
        console.log(x[i]);
        t1 += x[i] * x[i];
        t2 += Number(x[i]);
        t3 += x[i] * y[i];
        t4 += Number(y[i]);
    }
    a = (t3 * (x.length) - t2 * t4) / (t1 * (x.length) - t2 * t2);
    b = (t1 * t4 - t2 * t3) / (t1 * x.length - t2 * t2);
    return Number(a);
}