import { Component, OnInit } from '@angular/core';
import { PollService } from '../../services/poll.service';
import { Chart, ChartOptions, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public loggedIn = false;
  public authError = false;
  public user = '';
  public password = '';
  public pollId = 2;
  public pollAnswers = [];
  public sanitizedAnswers = {};
  public barChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartData = [{
    data: [],
    label: ``,
  }];
  public bgColors = ['rgba(254,220,162,1)','rgba(178,254,161, 1)','rgba(254,191,189, 1)','rgba(164,204,255, 1)','rgba(236,254,162, 1)','rgba(183,164,254, 1)']
  public poll = {id: null, questions: []}
  public lineChartPlugins = [ChartDataLabels];
  public mostVoted='';
  public average='';
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 20,
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 50,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
          gridLines: {
              drawOnChartArea: false
          }
      }],
      yAxes: [{
          gridLines: {
              drawOnChartArea: false
          }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#888',
        formatter: (value, ctx) => {            
          let percentage = (value * 100 / this.pollAnswers.length).toFixed(1) + "%";
          return percentage;
        },
      }
    }
  };
  
  public generalDataset = {
    data: [0], 
    label: '', 
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  }

  constructor(public pollService: PollService) { 
    Chart.plugins.unregister(ChartDataLabels);
  }

  ngOnInit(): void {
    let that = this;
    this.pollService.getPoll(2).then(function(poll) { 
      that.setPoll(poll) 
      that.getAnswers();
    });
  }

  setPoll(poll) {
    this.poll = poll
  }

  loginTest() {
    console.log('dentro')
    console.log('user', this.user)
    console.log('pas', this.password)
    if(this.user === 'admin' && this.password === 'sinapsis') {
      this.loggedIn = true;
    } else {
      this.authError = true;
    }
  }

  setPollAnswers(answers){
    this.pollAnswers = answers;
  }

  getBarChartData(index) {
    const question = `q${index}`;
    let barChartData = []
    this.sanitizedAnswers[question].forEach((q, i) => {
      barChartData.push({data: [q], label:`Respuesta ${i + 1}`})
    })

    return barChartData;
  }

  getAnswers = () => {
    let that = this;
    this.pollService.getPollAnswers(this.pollId)
    .then(function(answers) { 
      that.setPollAnswers(answers)
      that.sanitizePollAnswers();
    });
  }

  sanitizePollAnswers = () => {
    const chartData = {};
    let media = 0;
    this.pollAnswers.forEach((answer, i) => {
      if (!chartData[answer.price]) {
        chartData[answer.price] = 1;
      } else {
        chartData[answer.price] += 1;
      }
    });

    const d = []
    let i = 0;
    let mostVoted = 0;
    for(let mydata in chartData) {
      if (mostVoted < chartData[mydata]) { 
        this.mostVoted = `${mydata}  €`;
        mostVoted = chartData[mydata];
      } else if (mostVoted === chartData[mydata]) {
        this.mostVoted += `/ ${mydata}  €`;
      }

        const item = {
        data: [chartData[mydata]],
        label: `Precio: ${mydata}  €`,
        backgroundColor: this.bgColors[i],
        barPercentage: 1,
        minBarLength: 5
      };

      i += 1
      media += parseInt(mydata, 10) * chartData[mydata];
      d.push(item)
    }

    this.average = `${(media / this.pollAnswers.length).toFixed(2)} €`
    this.barChartData = d
  }
}
