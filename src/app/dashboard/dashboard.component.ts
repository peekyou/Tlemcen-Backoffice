import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as Chartist from 'chartist';
import * as moment from 'moment';

import { Dashboard } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { SearchFilter } from '../core/models/search-filter.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  Math;
  model: Dashboard = new Dashboard();
  activeTab = 1;
  loader: Subscription;

  month = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  dailyRevenuesChart = {
    labels: [],
    series: []
  };

  monthlyCustomerChart = {
    labels: [],
    series: []
  };

  constructor(private service: DashboardService) {
    this.Math = Math;
  }

  ngOnInit() {
    var startDay = moment().startOf('day').toDate();
    var endDay = moment().endOf('day').toDate();
    var lastYear = moment().subtract(1,'year').startOf('day').toDate();
    var lastWeek = moment().subtract(1,'week').startOf('day').toDate();

    this.service.getCustomerCount(new SearchFilter(startDay, endDay))
      .subscribe(res => this.model.customerCount = res);

    this.service.getRevenuesAmount(new SearchFilter(lastYear, endDay))
      .subscribe(res => this.model.revenues = res);
      
    this.service.getIncompletePaymentsCount()
      .subscribe(res => this.model.incompletePaymentsCount = res);
    
    this.service.getDailyRevenues(new SearchFilter(lastWeek, endDay))
      .subscribe(res => {
        this.model.dailyRevenues = res;
        var maxValue = 0;
        var ratio = 1000;
        var serie = [];
        for (var i = 0; i < res.length; i++) {
          var x = res[i];
          this.dailyRevenuesChart.labels.push(moment(x.date).format('dd'));
          serie.push(x.revenues / ratio);
          maxValue = Math.max(maxValue, x.revenues / ratio);
        }
        this.model.dayVariation = (serie[serie.length -1] - serie[serie.length -2]) / serie[serie.length -2];
        this.dailyRevenuesChart.series.push(serie);

        var optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: maxValue + 50,
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        };
        var dailySalesChart = new Chartist.Line('#dailySalesChart', this.dailyRevenuesChart, optionsDailySalesChart);
        this.startAnimationForLineChart(dailySalesChart);
      });
      
    this.loader = this.service.getMonthlyCustomerCount(null)
      .subscribe(res => {
        this.model.monthlyCustomerCount = res;
        var serie = [];
        var maxValue = 0;
        res.forEach(x => {
          this.monthlyCustomerChart.labels.push(this.month[x.monthOfYear - 1]);
          serie.push(x.customerCount);
          maxValue = Math.max(maxValue, x.customerCount);
        });
        this.monthlyCustomerChart.series.push(serie);
        
        var optionswebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: maxValue + 10,
            chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
        };
        var responsiveOptions: any[] = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];
        var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', this.monthlyCustomerChart, optionswebsiteViewsChart, responsiveOptions);
        this.startAnimationForBarChart(websiteViewsChart);
      });
      
    this.service.getFlightsOnArrival()
      .subscribe(res => this.model.flightsOnArrival = res);
      
    this.service.getFlightsOnDeparture()
      .subscribe(res => this.model.flightsOnDeparture = res);
      
    this.service.getHotelBookings()
      .subscribe(res => this.model.hotelBookings = res);
  }

  startAnimationForLineChart(chart){
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function(data) {
      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if(data.type === 'point') {
            seq++;
            data.element.animate({
              opacity: {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
    });
    seq = 0;
};

startAnimationForBarChart(chart){
    let seq2: any, delays2: any, durations2: any;
    seq2 = 0;
    delays2 = 80;
    durations2 = 500;

    chart.on('draw', function(data) {
      if(data.type === 'bar'){
          seq2++;
          data.element.animate({
            opacity: {
              begin: seq2 * delays2,
              dur: durations2,
              from: 0,
              to: 1,
              easing: 'ease'
            }
          });
      }
    });
    seq2 = 0;
  };
}
