/**
 * Created by Administrator on 2014/11/10.
 */
(function (plugin, window) {
    var factory = function($){
        return plugin($, window);
    };
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($,window,undefined){
    function Calendar(el, options){
        this.init(el, options);
    }
    Calendar.prototype.init = function(el, options){
        var self = this;
        if(!options){
            options = {};
        }
        var widgetEnv = {
            nextName: options.nextName || "next",
            prevName: options.prevName || "prev"
        };
        var widgetHead = '<div class="widgetHead"><div class="title"></div><div class="next">'+widgetEnv.nextName+'</div><div class="prev">'+widgetEnv.prevName+'</div></div>';
        var widgetBody = '<div class="widgetBody"></div>';
        var widget = widgetHead + widgetBody;
        el.append(widget).addClass('minCalendar');

        var elTitle = el.children(".widgetHead");
        var elSet = {
            init: el,
            elTitle: elTitle,
            body: el.children(".widgetBody"),
            title: elTitle.children(".title"),
            next: elTitle.children(".next"),
            prev: elTitle.children(".prev")
        };

        this.el = elSet;

        this.render(options);
        el.on('click', '.next', function(e){
            self.renderNext();
        });
        el.on('click', '.prev', function(e){
            self.renderPrev();
        });
    };
    Calendar.prototype.render = function(options){
        var el = this.el;
        this.setOptions(options);
        this.setValue();
        var calendar = this.getCalendar();
        var title = this.getCalendarTitle();
        el.title.text(title);
        el.body.html(calendar).on('click', 'a', function(e){
            e.preventDefault();
            e.stopPropagation();
            var date = $(this).data('date');
            el.init.trigger('calendarSelect', date);
        });
    };
    Calendar.prototype.renderNext = function(){
        var options = this.envValue;
        var nextMonth = options.nextYYYYMM;
        this.render({
            date: nextMonth
        })
    };
    Calendar.prototype.renderPrev = function(){
        var options = this.envValue;
        var prevMonth = options.prevYYYYMM;
        this.render({
            date: prevMonth
        })
    };
    Calendar.prototype.setOptions = function(options){
        if(!options){
            options = {};
        }
        this.options = {
            date : options.date || moment().format('YYYY-M-D')
        };
    };
    Calendar.prototype.setValue = function(){
        var options = this.options;
        var now = moment(options.date);
        var nowdaysInMonth = now.daysInMonth();
        var nowYYYYMM = now.format('YYYY-M');
        var nextdaysInMonth = moment().add(1, 'month').daysInMonth();
        var prevMonth = moment(options.date).subtract(1, 'month');
        var prevYYYYMM = prevMonth.format('YYYY-M');
        var prevdaysInMonth = prevMonth.daysInMonth();
        var nextMonth = moment(options.date).add(1, 'month');
        var nextYYYYMM = nextMonth.format('YYYY-M');
        var monthFirstDay = moment(moment(options.date).format("YYYY-MM")).day();
        var mincalendartitle = now.format('YYYY年MMM');
        this.envValue = {
            now: now,
            nowdaysInMonth: nowdaysInMonth,
            nowYYYYMM: nowYYYYMM,
            nextdaysInMonth : nextdaysInMonth,
            prevMonth : prevMonth,
            prevYYYYMM: prevYYYYMM,
            prevdaysInMonth: prevdaysInMonth,
            nextMonth: nextMonth,
            nextYYYYMM: nextYYYYMM,
            monthFirstDay: monthFirstDay,
            mincalendartitle: mincalendartitle
        };
    };
    Calendar.prototype.getDateList = function(){
        var envValue = this.envValue;
        var dateList = [];
        var thisPrevdaysInMonth = envValue.prevdaysInMonth;
        for(var i=0 ; i < envValue.monthFirstDay; i++){
            dateList.push({date : thisPrevdaysInMonth, funlldate :envValue.prevYYYYMM+'-'+thisPrevdaysInMonth , inMonth: false});
            thisPrevdaysInMonth--;
        }
        dateList.reverse();
        for(var j = 42 - dateList.length, i = 1; i <= j; i++){
            if(i <= envValue.nowdaysInMonth){
                var date = i;
                var funlldate = envValue.nowYYYYMM +'-'+date;
                var inMonth = true;
            }else{
                var date = i - envValue.nowdaysInMonth;
                var funlldate = envValue.nextYYYYMM +'-'+date;
                var inMonth = false;
            }
            dateList.push({date : date, funlldate: funlldate, inMonth: inMonth});
        }
        return dateList;
    };
    Calendar.prototype.getCalendarHead = function(){
        var calendarHead = "<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>";
        return calendarHead;
    };
    Calendar.prototype.getCalendarBody = function(){
        var dateList = this.getDateList();
        var tb='', tr='';
        for(var j = dateList.length, i = 0; i < j; i ++){
            tr += '<td><a ' + (dateList[i].inMonth ? '' : 'class="notin"') + ' href="#"  data-date="'+ dateList[i].funlldate +'">' + dateList[i].date + '</a></td>';
            if((i+1)%7 == 0){
                tb += '<tr>' + tr + '</tr>';
                tr = '';
            }
        }
        var tbody = '<tbody>'+tb+'</tbody>';
        return tbody;
    };
    Calendar.prototype.getCalendar = function(){
        var thead = this.getCalendarHead();
        var tbody = this.getCalendarBody()
        var table = "<table>"+thead+tbody+"</table>";
        return table;
    };
    Calendar.prototype.getCalendarTitle = function(){
        var options = this.envValue;
        var title = options.now.format("YYYY年 - MMM");
        return title;
    };

    function calendar(el, options){
        return new Calendar($(el), options);
    }

    $.extend({
        mincalendar: calendar
    });
},this));