import { Component, input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-user-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class UserChartComponents implements OnChanges {

  last5Days = input<string[]>([]);
  last5DaysData = input<number[]>([]);
  todayUsersCount = input<number>(0);
  totalUsersCount = input<number>(0);

ngOnInit(): void {
  console.log('Input data:', {
    last5Days: this.last5Days(),
    last5DaysData: this.last5DaysData(),
  });
}

  lineChartData!: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  pieChartData!: ChartConfiguration<'pie'>['data'];
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'top' } }
  };

  ngOnChanges(changes: SimpleChanges) {
    this.buildCharts();
  }

  private buildCharts() {
    this.lineChartData = {
      labels: this.last5Days(),
      datasets: [
        {
          data: this.last5DaysData(),
          label: 'Registrations',
          fill: true,
          borderColor: 'blue',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    };

    const today = this.todayUsersCount();
    const others = this.totalUsersCount() - today;

    this.pieChartData = {
      labels: ['Today', 'Before Today'],
      datasets: [
        {
          data: [today, others],
          backgroundColor: ['#ffcc00', '#36a2eb']
        }
      ]
    };
  }
}