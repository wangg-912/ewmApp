Highcharts.setOptions({
    global: {
        useUTC: false
    }
});

var chart = Highcharts.chart('container', {
    title: {
        text:'成都出口专线'
    },
    subtitle: {
        text: '流量实时监控'
    },
    lang:{
        contextButtonTitle:"图表导出菜单",
        decimalPoint:".",
        downloadJPEG:"下载JPEG图片",
        downloadPDF:"下载PDF文件",
        downloadPNG:"下载PNG文件",
        downloadSVG:"下载SVG文件",
        drillUpText:"返回 {series.name}",
        loading:"加载中",
        months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        noData:"没有数据",
        numericSymbols: [ "千" , "兆" , "G" , "T" , "P" , "E"],
        printChart:"打印图表",
        resetZoom:"恢复缩放",
        resetZoomTitle:"恢复图表",
        shortMonths: [ "Jan" , "Feb" , "Mar" , "Apr" , "May" , "Jun" , "Jul" , "Aug" , "Sep" , "Oct" , "Nov" , "Dec"],
        thousandsSep:",",
        weekdays: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期天"]
    },
    chart: {
        type: 'spline',
        animation: Highcharts.svg,
        events: {
            load: function () {

                // set up the updating of the chart each second
                var seriesShenCan = this.series[0];
                var seriesBanGong = this.series[2];
                var seriesYule = this.series[3];
                var seriesTotal = this.series[4];
                var seriesBase = this.series[1];

                setInterval(function () {
                    var x = (new Date()).getTime(), // current time
                        y1 = Math.random();
                    seriesShenCan.addPoint([x, y1], true, true);
                    y2 = Math.random();
                    seriesBanGong.addPoint([x,y2],true,true);
                   y3 = Math.random();
                   seriesYule.addPoint([x,y3],true,true);
                   y = y1+y2+y3;
                   seriesTotal.addPoint([x,y],true,true);
                    y = Math.random();
                    seriesBase.addPoint([x,y],true,true);
                }, 5000);
            }
        }
    },


     xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
    },
    yAxis:{
        title:{
            text:'MBit Per Secone (Mbps)',
            style: {
                fontWeight: 'bold',
                fontSize: '16px'
            }
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            series: {
                allowPointSelect: true
            }
        }
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
    },
    legend: {
        enabled: true
    },
    exporting: {
        enabled: true
    },
    series: [
        {
            name: '生产',
            type: 'column',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        },
        {
            name: '办公',
            type: 'column',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        },
        {
            name: '娱乐',
            type: 'column',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        },
        {
            name: '总流量',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        },
        {
            name: '基线流量',
            dashStyle: 'shortdot',
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[2],
                fillColor: 'blue'
            },
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -19; i <= 0; i += 1) {
                    data.push({
                        x: time + i * 5000,
                        y: Math.random()
                    });
                }
                return data;
            }())
        },
    ],
        center: [100, 80],
        size: 90,
        showInLegend: true,
        dataLabels: {
            enabled: false
        }
});

//highChar();