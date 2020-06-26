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
  public pollId = 2;
  public pollAnswers = [];
  public sanitizedAnswers = {};

  public lineChartPlugins = [ChartDataLabels];

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
  public barChartType = 'horizontalBar';
  public barChartLegend = false;
  public barChartData = [];
  public bgColors = ['rgba(10, 0, 0, 0.4)','rgba(100, 0, 0, 0.4)','rgba(150, 0, 0, 0.4)','rgba(200, 0, 0, 0.4)']
  public generalDataset = {
    data: [0], 
    label: '', 
    backgroundColor: 'rgba(0, 0, 0, 0.1)'
  }
  public poll = {id: null, questions: []}
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
    console.log('poll:', poll)
    this.poll = poll
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
   // const barChartData =  {data: [this.sanitizedAnswers[question]], label: 'Series A'},
  }

  getAnswers = () => {
    let that = this;
    this.pollService.getPollAnswers(this.pollId)
    .then(function(answers) { 
      console.log(answers)
      that.setPollAnswers(answers)
      that.sanitizePollAnswers();
    });
  }

  sanitizePollAnswers = () => {
   let sanitizedAnswers = {};
   console.log('this.pollAnswers')
   console.log(this.pollAnswers)
   const chartData = {};
   this.pollAnswers.forEach((answer, i) => {
    if (!chartData[answer.price]) {
      chartData[answer.price] = 1;
    } else {
      chartData[answer.price] += 1;
    }
   });

console.log('chartData')
console.log(chartData)
const d = []
let media = 0;
for(let mydata in chartData) {
  console.log('mydata: ', mydata)
  const item = {
    data: [chartData[mydata]],
    label: `Precio: ${mydata} E`
  };
  media += parseInt(mydata, 10);
  d.push(item)
}

console.log('media: ', media)
console.log('Precio optimo: ', (media / this.pollAnswers.length))
this.barChartData = d;


   console.log(this.barChartData)
   console.log(this.sanitizedAnswers)
  }
}
