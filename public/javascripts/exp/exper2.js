//在即将离开当前页面(刷新或关闭)时执行 JavaScript 
window.onbeforeunload = function () {
    return 1;
    //阻止意外关闭实验页
}

//窗口关闭时,使用ajax上传实验日志?????????没有exper0的路径
window.onunload = function () {
    recordExpLog('退出实验');
    $.ajax({
        type: 'POST',
        async: false,
        url: '/experiment/tablefree',
        data: 'tableid=' + tableid,
        success: function (data) {
        }
    });
};
//-----------------misc event--------------------------------
var tableid = 7;
//开始实验,清空表格,打开进水阀,关闭出水阀/侧阀,开启变频器
// $('#buttonStartExperiment').click(function (e) {
//     if (experimentStatus == 0) //停止状态
//     {
//         var status;
//         var expTime = new Date();
//         var y = expTime.getFullYear();
//         var m = addZero(expTime.getMonth() + 1);
//         var d = addZero(expTime.getDate());
//         var h = addZero(expTime.getHours());
//         var min = addZero(expTime.getMinutes());
//         var t = y + "-" + m + "-" + d;
//         h = h + ":00";
//         $.post('/experiment/judgeTime', {
//             courseid: 2
//         }, function (results) {
//             var result_str = [];
//             result_str = results.split(",");
//             for (i = 0; i < result_str.length; i++) {
//                 if (result_str[i] == t)
//                     break;
//             }
//             if (i == result_str.length) alert("今天该实验不开放");
//             else {
//                 $.post('/experiment/judgeOrder', {
//                     courseid: 2,
//                     t: t,
//                     h: h
//                 }, function (time) {
//                     if (time.num==0)
//                         alert("未预约该时间段" + h + "的实验");
//                     else if (min > 59) alert("已迟到20min以上，不能继续做实验");
//                     else {
//                         $.get('/experiment/courseInfo', function (result) {
//                             if (result != "none") {
//                                 for (var i = 0; i < result.length; i++) {
//                                     if (result[i].courseID == 0)
//                                         status = result[i].status;
//                                 }
//                                 switch (status) {
//                                     case 0:
//                                         if (confirm('你即将开始实验，继续请按确认'))
//                                             break;
//                                         else return;
//                                     case 1:
//                                         if (confirm('您已完成此实验,重做会覆盖之前的实验记录,继续请按确认。'))
//                                             break;
//                                         else return;
//                                     case 2:
//                                         alert('您已提交报告,不能重新进行此实验');
//                                         return;
//                                 }
//                             }
//                             $.post('/experiment/tableMatch', {
//                                 courseid: 2
//                             }, function (data) {
//                                 tableid = data;
//                                 if (tableid == 7) {
//                                     alert("暂无空闲实验桌，请提前预约");
//                                 }
//                                 else {
//                                     experimentStatus = 1; //1是运行状态，socket.emit('emitEvent',data),socket.on('emitEvent',function(data){});
//                                     //Create_socket();
//                                     socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
//                                     chartWeight.series[0].remove();
//                                     chartWeight.addSeries(createEmptySeries());
//                                     chartVortex.series[0].remove();
//                                     chartVortex.addSeries(createEmptySeries());
//                                     time = 0;
//                                     recordExpLog('开始实验');
//                                     setButtonsByStatus();
//                                     openCamera(tableid);
//                                     //buttonSet();
//                                 }
//                             });
//                         });
//                     }
//                 });
//             }
//         });
//     }
//     else if (experimentStatus == 1) {
//         if (confirm('是否确认结束实验？')) {
//             $.post('/experiment/tableFree', {
//                 tableid: tableid
//             }, function (data) { });
//             // 运行状态
//             experimentStatus = 0;
//             socket.emit('stopExperiment', tableid);
//             recordExpLog('结束实验');
//             //closeCamera(tableid);
//             // setButtonsByStatus();
//             window.location.href = location.href;
//         }
//         // buttonSet();
//     }
//     else {
//         // 重置后开始实验
//         experimentStatus = 1; //1是运行状态，socket.emit('emitEvent',data),socket.on('emitEvent',function(data){});
//         document.getElementById('frequencySlider').value = 30;
//         socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
//         chartWeight.series[0].remove();
//         chartWeight.addSeries(createEmptySeries());
//         chartVortex.series[0].remove();
//         chartVortex.addSeries(createEmptySeries());
//         time = 0;
//         recordExpLog('重置后开始实验');
//         setButtonsByStatus();
//     }
// });

//上传实验数据
$('#buttonEndExperiment').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            async: false,
            url: '/experiment/2',
            data: 'expdata=' + getTableContent('tableDataRecord') + '&log=' + document.getElementById('expLog').innerText,
            success: function (data) {
                if (data.affectedRows != 0)
                    alert('上传成功');
                else if (data.affectedRows == 0) alert('用户不存在数据表');
            },
            error: function (data) {
                alert('上传失败');
            }
        });
    }
});


//重置实验,停止水泵,打开出水阀
// $('#buttonResetExperiment').click(function (e) {
//     if (experimentStatus == 0) {
//         alert("请先点击开始实验");
//         return false;
//     }
//     else {
//         experimentStatus = 2;
//         setButtonsByStatus();
//         socket.emit('resetExperiment', tableid);
//         recordExpLog('重置实验');
//     }
// });


var isDrawingGraph = true;
$('#buttonPauseGraph').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        // 改变记录曲线标志位
        isDrawingGraph = !isDrawingGraph;
        document.getElementById("buttonPauseGraph").innerText = isDrawingGraph ? "暂停曲线" : "开始曲线";
    }
});

//-------------------------------------------------tableOperations-------------------------
var recordingIndex = 0;
// 清空表格按钮
$('#buttonClearRecord').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        recordingIndex = 0;
        //清除试验数据的所有内容，jquery的empty函数，清除被选元素的所有内容
        $("#tableDataRecord").empty();
        // 添加表格标题行
        var row = document.getElementById("tableDataRecord").insertRow();
        var cell;
        // 将cell单元格插入到一行的末尾，-1末尾位置
        // cell = row.insertCell(-1);
        // cell.innerHTML = "序号";
        // cell.align = "center";
        // cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "时间";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "频率";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "实际液位";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "超声波液位(mm)";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        recordExpLog('清空表格');
    }
});

var isRecordingTable = false;
$("#buttonStartRecord").click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        isRecordingTable = !isRecordingTable;
        document.getElementById("buttonStartRecord").innerText = isRecordingTable ? "停止记录" : "开始记录";
        if (isRecordingTable) recordExpLog('开始记录数据,间隔:' + recordInterval + 's');
        else recordExpLog('停止记录数据');
    }
});

//表格更新时间间隔，数据记录时间间隔
function recordIntervalChange() {
    var interval = parseInt($("#inputSampleInterval").val());
    if (isNaN($("#inputSampleInterval").val())) document.getElementById("inputSampleInterval").value = 1;
    if (interval > 10) document.getElementById("inputSampleInterval").value = 10;
    if (interval < 1) document.getElementById("inputSampleInterval").value = 1;
    recordInterval = parseInt($("#inputSampleInterval").val());
    recordIntervalCounter = recordInterval;
}

//-----------------------------------------------视频流--------------------------------
//var canvas = document.getElementById('video-canvas');
//var player = new JSMpeg.Player('Socket.IO', { canvas: canvas, channel: 1 });

//----------------------------------------------------------------socket.IO-----------------

var socket = io.connect();
var time = 0;
var recordInterval = 1;
var recordIntervalCounter = 1;
var actualLevel = 0;
var calculatedLevel = 0;
var cs = 0;
// const height = 400; // 传感器距离容器底部的高度
// var lastSW1='on',lastSW2='on', lastSW3='on', lastSW4='on';
// console.log('lastSW的值是多少:',lastSW1+lastSW2+lastSW3+lastSW4);
var experimentStatus = 0; //实验状态,0:空闲(停止);1:正在实验;2:正在重置
var warnflag = 0, warnflag2 = 0;
var errorflag = [0, 0, 0, 0];
var weightArray=[];
setInterval(function () {
    if (experimentStatus != 0) {
        // var reqTime = Date.now();
        // socket.emit('connect_test', tableid);
        socket.emit('getdata', tableid);
    }
}, 1000);
socket.on("Data Pack", function (temperature, ultraTime, distance, flowRate, totalFlowVortex, weight, flowRateHM, totalFlowHM,temperatureWater, valveIn, valveOut, valveSide, inverter) {
    // // z?????????????????????????   pong监听什么
    // socket.emit('pong');
    weightArray.push(Number(weight));
    if (weightArray.length == 6) {
        weightArray.splice(0, 1);
         //这个值的计算时，算的桶的内直径为398mm,比较精确。
        var l1=weightArray[0]*10000/1244.1;
        var l2=weightArray[1]*10000/1244.1;
        var l3=weightArray[2]*10000/1244.1;
        var l4=weightArray[3]*10000/1244.1;
        var l5=weightArray[4]*10000/1244.1;
        actualLevel=(l1+l2+l3+l4+l5)/5;
        actualLevel=actualLevel.toFixed(3);
    }
    // actualLevel = weight* 10000 /1244.1;
    calculatedLevel=distance;
    // 计算声速
    // cs = 331.3 + 0.606 * temperature;
    // calculatedLevel = height - cs * ultraTime / 1000 / 2;
    //console.log('开关状态的值',valveIn+valveOut+valveSide+inverter);
    if (true) {
        
        if (weight !== -1)
            errorflag[0] = 0;
        else if (weight == -1 && errorflag[0] < 80)
            errorflag[0]++;

        if (temperature !== -1 && ultraTime !== -1 && distance !== -1)
            errorflag[2] = 0;
        else if ((temperature == -1 || ultraTime == -1 || distance == -1) && errorflag[2] < 80)
            errorflag[2]++;

        if (errorflag[0] == 75)
            WeightError();
        if (errorflag[2] == 75)
            LevelError();

        //电子秤
        document.getElementById('labelWeight').innerHTML = '质量:' + weight + ' kg';
        document.getElementById('labelWeightSide').innerHTML = '质量:' + weight + ' kg';
        // 涡街流量计，以及涡街流量计的实时动态显示
        document.getElementById('labelFlowRateVortex').innerHTML = '瞬时流量:' + flowRate + ' m3/h';
        document.getElementById('labelFlowRateVortexSide').innerHTML = '瞬时流量:' + flowRate + ' m3/h';
        document.getElementById('labelTotalFlowVortex').innerHTML = '累积流量:' + totalFlowVortex + ' m3';

        document.getElementById("VortexFlowDigit1").src = "/images/LCD/" + parseInt(flowRate  % 10) + ".png";
        document.getElementById("VortexFlowDigit2").src = "/images/LCD/" + parseInt((flowRate * 10) % 10) + ".png";
        document.getElementById("VortexFlowDigit3").src = "/images/LCD/" + parseInt((flowRate * 100) % 10) + ".png";
        document.getElementById("VortexFlowDigit4").src = "/images/LCD/" + parseInt((flowRate * 1000) % 10) + ".png";
        //document.getElementById("VortexFlowDigit5").src = "/images/LCD/" + parseInt((flowRate*1000)%10) + ".png";


        //超声波流量计
        document.getElementById('labelFlowRateHM').innerHTML = '瞬时流量:' + flowRateHM + ' m3/h';
        document.getElementById('labelFlowRateHMSide').innerHTML = '瞬时流量:' + flowRateHM + ' m3/h';
        document.getElementById('labelTotalFlowHM').innerHTML = '累积流量:' + totalFlowHM + ' m3';
        document.getElementById('labelTempHM').innerHTML = '水温:' + temperatureWater + ' C';

        document.getElementById("USFlowDigit1").src = "/images/LCD/" + parseInt(flowRateHM % 10) + ".png";
        document.getElementById("USFlowDigit2").src = "/images/LCD/" + parseInt((flowRateHM * 10) % 10) + ".png";
        document.getElementById("USFlowDigit3").src = "/images/LCD/" + parseInt((flowRateHM * 100) % 10) + ".png";
        document.getElementById("USFlowDigit4").src = "/images/LCD/" + parseInt((flowRateHM * 1000) % 10) + ".png";
        //document.getElementById("USFlowDigit5").src = "/images/LCD/" + parseInt((flowRateHM*1000)%10) + ".png";

        document.getElementById("USFlowTempDigit1").src = "/images/LCD/" + parseInt((temperatureWater / 10) % 10) + ".png";
        document.getElementById("USFlowTempDigit2").src = "/images/LCD/" + parseInt((temperatureWater) % 10) + ".png";
        document.getElementById("USFlowTempDigit3").src = "/images/LCD/" + parseInt((temperatureWater * 10) % 10) + ".png";
        document.getElementById("USFlowTempDigit4").src = "/images/LCD/" + parseInt((temperatureWater * 100) % 10) + ".png";
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //超声波液位计
        document.getElementById('labelWaterLevel').innerHTML = '液位:' + distance + ' mm';
        document.getElementById('labelWaterLevelSide').innerHTML = '液位:' + distance + ' mm';
        document.getElementById('labelTempAir').innerHTML = '气温:' + temperature + ' C';
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  根据接收的阀门状态信息改变按钮的状态，inverter为变频器
        // if (valveIn == 'on' && lastSW1) {document.getElementById('sw1').checked = true;}
        // if (valveIn == 'off' && !lastSW1) document.getElementById('sw1').checked = false;

        // if (valveSide == 'on' && lastSW2) document.getElementById('sw2').checked = true;
        // if (valveSide == 'off' && !lastSW2) document.getElementById('sw2').checked = false;

        // if (valveOut == 'on' && lastSW3) document.getElementById('sw3').checked = true;
        // if (valveOut == 'off' && !lastSW3) document.getElementById('sw3').checked = false;

        // if (inverter == 'on' && lastSW4) document.getElementById('sw4').checked = true;
        // if (inverter == 'off' && !lastSW4) document.getElementById('sw4').checked = false;
        // // ??????????????????????????????????
        // lastSW1 = valveIn == 'on';
        // lastSW2 = valveSide == 'on';
        // lastSW3 = valveOut == 'on';
        // lastSW4 = inverter == 'on';
        //  根据接收的阀门状态信息改变按钮的状态，inverter为变频器
        // if (valveIn == 'on') {document.getElementById('sw1').checked = true;}
        // if (valveIn == 'off') document.getElementById('sw1').checked = false;

        // if (valveSide == 'on' ) document.getElementById('sw2').checked = true;
        // if (valveSide == 'off') document.getElementById('sw2').checked = false;

        // if (valveOut == 'on' ) document.getElementById('sw3').checked = true;
        // if (valveOut == 'off') document.getElementById('sw3').checked = false;

        // if (inverter == 'on' ) document.getElementById('sw4').checked = true;
        // if (inverter == 'off') document.getElementById('sw4').checked = false;
        if (sw1Status == 1) {
            setTimeout(function () {
                sw1Status = 0;
            }, 1500);
        }
        if (sw2Status == 1) {
            setTimeout(function () {
                sw2Status = 0;
            }, 1500);
        }
        if (sw3Status == 1) {
            setTimeout(function () {
                sw3Status = 0;
            }, 1500);
        }
        if (sw4Status == 1) {
            setTimeout(function () {
                sw4Status = 0;
            }, 1500);
        }
        if (sw1Status == 0) {
            if (valveIn == '1') document.getElementById('sw1').checked = false;
            if (valveIn == '0') document.getElementById('sw1').checked = true;
        }
        if (sw2Status == 0) {
            if (valveSide == '1') document.getElementById('sw2').checked = false;
            if (valveSide == '0') document.getElementById('sw2').checked = true;
        }
        if (sw3Status == 0) {
            if (valveOut == '1') document.getElementById('sw3').checked = false;
            if (valveOut == '0') document.getElementById('sw3').checked = true;
        }
        if (sw4Status == 0) {
            if (inverter) document.getElementById('sw4').checked = true;
            if (inverter == '0') document.getElementById('sw4').checked = false;
        }
        //重置仪器终止判断
        // if (experimentStatus == 2 && weight < 1) {
        //     experimentStatus = 0; //切换为闲置状态
        //     //等待10s,确保水放完,然后弹框提示,并关闭下水阀
        //     setTimeout(function() {
        //         // socket.emit('controlValves', 'out', false);
        //         document.getElementById("WarningResetFinished").style.visibility = "visible";
        //         document.getElementById("WarningResetFinished").style.opacity = "0.8";
        //         document.getElementById("WarningResetFinished").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
        //         document.getElementById("WarningResetFinished").style.zIndex = "1000";
        //         recordExpLog('重置实验完成,水箱已放空');
        //     }, 10000);
        // }

        if (experimentStatus == 2 && weight < 2 && valveOut == '1') {
            if (warnflag == 0) {
                //experimentStatus = 3; //切换为闲置状态
                document.getElementById("WarningResetFinished").style.visibility = "visible";
                document.getElementById("WarningResetFinished").style.opacity = "0.8";
                document.getElementById("WarningResetFinished").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
                document.getElementById("WarningResetFinished").style.zIndex = "1000";
                recordExpLog('重置实验完成,水箱已放空');
                warnflag = 1;
            }
        }
        if ((weight > 24 && valveOut == '1')||(weight > 24 && valveOut == '0' && inverter!=0)) {
        // if (weight >24 && valveOut == '1') {
            if (warnflag2 == 0) {
                document.getElementById("WarningOverflow").style.visibility = "visible";
                document.getElementById("WarningOverflow").style.opacity = "0.8";
                document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
                document.getElementById("WarningOverflow").style.zIndex = "1000";
                recordExpLog('警告:上储水箱溢出,电子秤超重');
               
                warnflag2 = 1;
            }
        };
        //记录数据只有在刷新曲线过程中才能进行
        if (isDrawingGraph) { //  绘制曲线
            // chartWeight.series[0].addPoint([time, Number(actualLevel)], true, false);
            // chartVortex.series[0].addPoint([time, Number(calculatedLevel)], true, false);
            chartLevel.series[0].addPoint([time, Number(actualLevel)], true, false);
            chartLevel.series[1].addPoint([time, Number(calculatedLevel)], true, false);
            chartInverter.series[0].addPoint([time, Number(inverter)], true, false);
            time += 1000;
            var min = parseInt(time / 60000);
            var sec = (time / 1000) % 60;

            //如果正在记录表格,则向表格中添加数据
            if (isRecordingTable) {
                if (recordIntervalCounter < recordInterval) {
                    recordIntervalCounter++;
                } else {
                    recordIntervalCounter = 1;
                    recordingIndex++;
                    //添加表格标题行
                    console.log('表格记录是否正常:', inverter + actualLevel + calculatedLevel);
                    var row = document.getElementById("tableDataRecord").insertRow();
                    var cell;
                    // cell = row.insertCell(-1);
                    // cell.innerHTML = recordingIndex;
                    // cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = (((min < 10) ? "0" : "") + min + ":" + ((sec < 10) ? "0" : "") + sec);
                    cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = inverter;
                    cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = Number(actualLevel).toFixed(2);
                    cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = calculatedLevel;
                    cell.align = "center";

                    document.getElementById("divDataTable").scrollTop = cell.offsetTop;
                }
            } else { recordIntervalCounter = recordInterval; }
        }
    }
});
// socket.on("Error", function(error) {
//     if (error == "Overflow") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:上储水箱溢出');
//     }
// });
// socket.on("Message Pack", function (code, device_id) {
//     if (code == "0x01") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:上储水箱溢出,电子秤超重');
//     }
//     if (code == "0x02") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:电子秤采集数据失败');
//     }
//     if (code == "0x03") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:涡街流量计采集数据失败');
//     }
//     if (code == "0x04") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:超声波液位计采集数据失败');
//     }
//     if (code == "0x05") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:超声波流量计(热能表)采集数据失败');
//     }
//     if (code == "0x06") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:变频器故障');
//     }
// });

//ping test
// var startTime;
// setInterval(function() {
//     startTime = Date.now();
//     socket.emit('ppp');
// }, 1000);

// socket.on('qqq', function() {
//     var latency = Date.now() - startTime;
//     console.log("Ping server test, latency=" + latency + "ms");
// });

//-----------------------------------punp controlling
//Pump controlling
// var sw4Status = 0;
// $('#sw4').click(function () {
//     if (experimentStatus == 0) {
//         alert("请先点击开始实验");
//         return false;
//     }
//     else {
//         sw4Status = 1;
//         if (document.getElementById('sw4').checked)
//             socket.emit('controlPump', tableid, document.getElementById('frequencySlider').value);
//         else
//             socket.emit('controlPump', tableid, 0);
//         recordExpLog(document.getElementById('sw4').checked ? ('开启变频器,频率:' + document.getElementById('frequencySlider').value + 'Hz') : '关闭变频器');
//     }
// })
// $('#frequencySlider').change(function () {
//     updateFrequencyValue();
//     if (document.getElementById('sw4').checked) {
//         socket.emit('controlPump', tableid, document.getElementById('frequencySlider').value);
//         recordExpLog('调节变频器频率:' + document.getElementById('frequencySlider').value + 'Hz');
//     }
// })