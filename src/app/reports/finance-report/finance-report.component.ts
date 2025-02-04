import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultBranchService } from 'app/default-branch.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { Credentials } from 'app/model/credentials';
import { DataForSelect } from 'app/model/data-for-select';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { CustomTimeRangeComponent } from '../modal/custom-time-range/custom-time-range.component';
import { ReportsService } from '../reports.service';
import Chart from 'chart.js';

const PAST_YEAR_COUNT = 3;
const MIN_PAST_YEAR = 2019;

@Component({
	selector: 'app-finance-report',
	templateUrl: './finance-report.component.html',
	styleUrls: ['./finance-report.component.css'],
})
export class FinanceReportComponent implements OnInit {
	@Input() cred: Credentials;

	isLoading = false;

	branch$: Observable<DataForSelect[]>;
	defaultBranch$$: Subscription;

	branch_id: number;
	branchOptions: { id: number; name: string }[] = [];

	selectedYearOption: string = moment().format('YYYY');
	yearOptions = [];

	startDate = moment().startOf('year');
	endDate = moment();

	timer: any;

	reports: any = [];

	canvas: any;
	ctx: any;
	myChart: any;
	gradientStroke: any;
	gradientFill: any;
	chartColor = '#FFFFFF';
	tableData: Array<any> = [];

	constructor(
		private licenseeService: LicenseeService,
		private reportsService: ReportsService,
		private modalService: NgbModal,
		private defaultBranchService: DefaultBranchService
	) {
		this.generateYearOptions();
		this.generateBranchOptions();
	}

	generateYearOptions() {
		const now = moment();

		for (let i = 0; i < PAST_YEAR_COUNT; i++) {
			this.yearOptions.push({
				label: `Year ${now.format('YYYY')}`,
				value: now.format('YYYY'),
			});
			now.subtract(1, 'years');

			if (Number(now.format('YYYY')) < MIN_PAST_YEAR) {
				break;
			}
		}

		this.yearOptions.push({
			label: 'Customised time range',
			value: 'custom',
		});
	}

	generateBranchOptions() {
		this.licenseeService.getBranchForSelect().subscribe((branches) => {
			this.branchOptions = branches;
		});
	}

	ngOnInit(): void {
		this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
		this.defaultBranch$$ = this.defaultBranchService.defaultBranch$.subscribe((branch_id) => {
			if (branch_id) {
				this.branch_id = branch_id;

				setTimeout(() => {
					this.getReport();
				}, 350);
			}
		});
	}

	getReport() {
		this.isLoading = true;
		this.reports = [];
		const body = {
			start_date: this.startDate.format('YYYY-MM-DD'),
			end_date: this.endDate.format('YYYY-MM-DD'),
			branch_id: this.branch_id,
		};

		this.reportsService.getFinanceReport(body).subscribe((res: any) => {
			(this.reports = res.map((monthly, i) => {
				monthly.display_date = `${moment().month(i).format('MMM')} ${this.selectedYearOption}`;
				monthly.display_advance = monthly.total_advance
					? 'RM ' + this.thousandSeparator(monthly.total_advance)
					: '-';
				monthly.display_extended = monthly.total_extended
					? 'RM ' + this.thousandSeparator(monthly.total_extended)
					: '-';
				monthly.display_new_enrolment = monthly.total_new_enrolment
					? 'RM ' + this.thousandSeparator(monthly.total_new_enrolment)
					: '-';
				return monthly;
			})),
				this.createGraph();
			this.createTable();
		});
	}

	thousandSeparator(value: number) {
		return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	get xAxisLabels(): string[] {
		const labels = [];
		const start = this.startDate.clone().startOf('month');
		const end = this.endDate.clone().endOf('month');

		while (end.diff(start, 'days') > 0) {
			if (labels.length < 12) {
				labels.push(start.format('MMM YYYY'));
				start.add(1, 'month');
			} else {
				break;
			}
		}

		return labels;
	}

	get dataSets(): any[] {
		const dataSets = [
			{
				label: 'Extended',
				borderColor: 'rgba(64, 180, 161, 1)',
				fill: true,
				backgroundColor: 'rgba(64, 180, 161, 0.9)',
				hoverBackgroundColor: 'rgba(64, 180, 161, 1)',
				borderWidth: 1,
				data: [],
				displayedData: [],
			},
			{
				label: 'Advance',
				borderColor: 'rgba(204, 125, 125, 1)',
				fill: true,
				backgroundColor: 'rgba(204, 125, 125, 0.9)',
				hoverBackgroundColor: 'rgba(204, 125, 125, 1)',
				borderWidth: 1,
				data: [],
				displayedData: [],
			},
			{
				label: 'New Enrolment',
				borderColor: 'rgba(85, 216, 254, 1)',
				fill: true,
				backgroundColor: 'rgba(85, 216, 254, 0.9)',
				hoverBackgroundColor: 'rgba(85, 216, 254, 1)',
				borderWidth: 1,
				data: [],
				displayedData: [],
			},
		];

		this.reports.forEach((report) => {
			dataSets[0].data.push(report.total_extended);
			dataSets[0].displayedData.push(report.display_extended);

			dataSets[1].data.push(report.total_advance);
			dataSets[1].displayedData.push(report.display_advance);

			dataSets[2].data.push(report.total_new_enrolment);
			dataSets[2].displayedData.push(report.display_new_enrolment);
		});

		return dataSets;
	}

	resetGraph() {
		const canvas = $('#graph');
		if (canvas) {
			canvas.remove();
		}

		const newCanvas = document.createElement('canvas');
		newCanvas.setAttribute('id', 'graph');

		const graphContainer = $('#graphContainer');
		graphContainer.append(newCanvas);
	}

	createGraph() {
		this.resetGraph();

		this.canvas = document.getElementById('graph');
		this.ctx = this.canvas.getContext('2d');

		this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
		this.gradientStroke.addColorStop(0, '#80b6f4');
		this.gradientStroke.addColorStop(1, this.chartColor);

		this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
		this.gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0)');
		this.gradientFill.addColorStop(1, 'rgba(249, 99, 59, 0.40)');

		this.myChart = new Chart(this.ctx, {
			type: 'bar',
			data: {
				labels: this.xAxisLabels,
				datasets: this.dataSets,
			},
			options: {
				tooltips: {
					tooltipFillColor: 'rgba(0,0,0,0.5)',
					tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
					tooltipFontSize: 14,
					tooltipFontStyle: 'normal',
					tooltipFontColor: '#fff',
					tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
					tooltipTitleFontSize: 14,
					tooltipTitleFontStyle: 'bold',
					tooltipTitleFontColor: '#fff',
					tooltipYPadding: 6,
					tooltipXPadding: 6,
					tooltipCaretSize: 8,
					tooltipCornerRadius: 6,
					tooltipXOffset: 10,
				},
				legend: {
					display: true,
				},
				scales: {
					yAxes: [
						{
							stacked: false,
							ticks: {
								fontColor: '#9f9f9f',
								fontStyle: 'bold',
								beginAtZero: true,
								maxTicksLimit: 5,
								padding: 20,
								// y axis label prefix with format: RM xx, xxx
								callback: (value) => {
									if (+value >= 1000) {
										return 'RM ' + this.thousandSeparator(value);
									} else {
										return 'RM ' + value;
									}
								},
							},
							gridLines: {
								zeroLineColor: 'transparent',
								display: true,
								drawBorder: false,
								color: '#9f9f9f',
							},
						},
					],
					xAxes: [
						{
							stacked: true,
							barPercentage: 0.8,
							gridLines: {
								zeroLineColor: 'white',
								display: false,

								drawBorder: false,
								color: 'transparent',
							},
							ticks: {
								padding: 10,
								fontColor: '#9f9f9f',
								fontStyle: 'bold',
							},
						},
					],
				},
			},
		});

		this.isLoading = false;
	}

	createTable() {
		this.resetTable();

		// add ths
		$('#table').append(`<tr>`);
		// first th will always be empty
		$('#table').append(`<th style="min-width: 90px; padding: 0.75em 0 !important; text-align: center"></th>`);

		// append remaining th: month year
		this.reports.forEach((th) => {
			$('#table').append(
				`<th style="min-width: 90px; padding: 0.75em 0 !important; text-align: center">${th.display_date}</th>`
			);
		});

		// last th will always be total
		$('#table').append(`<th style="min-width: 90px; padding: 0.75em 0 !important; text-align: right">Total</th>`);
		$('#table').append(`</tr>`);

		// add td according to the ths
		this.dataSets.forEach((tr) => {
			$('#table').append(`<tr>`);
			// left most column
			$('#table').append(`<td style="min-width: 90px; padding: 0.75em 0 !important">${tr.label}</td>`);

			// middle columns
			tr.displayedData.forEach((data) => {
				const textAlign = 'text-align: center';
				$('#table').append(
					`<td style="min-width: 90px; padding: 0.75em 0 !important;${textAlign}">${data}</td`
				);
			});

			const total = tr.data.reduce((acc, data) => {
				return (acc += data);
			}, 0);
			// right most column
			$('#table').append(
				`<th style="min-width: 90px; padding: 0.75em 0 !important; text-align: right">RM ${this.thousandSeparator(
					total
				)}</th>`
			);
			$('#table').append(`</tr>`);
		});

		const total = Array.apply(null, Array(this.dataSets[0].data.length)).map(() => 0);
		this.dataSets.forEach((tr) => {
			tr.data.forEach((data, i) => {
				total[i] += data;
			});
		});

		// add row for total
		$('#table').append(`<tr>`);
		// first td will always be 'Monthly'
		$('#table').append(`<th style="min-width: 90px; padding: 0.75em 0 !important">Monthly</th>`);

		// append remaining td: total for each month
		total.forEach((data) => {
			const textAlign = 'text-align: center';
			$('#table').append(
				`<th style="min-width: 90px; padding: 0.75em 0 !important;${textAlign}">${
					data ? 'RM ' + this.thousandSeparator(data) : '-'
				}</th>`
			);
		});

		// last td will always be total
		$('#table').append(
			`<th style="min-width: 90px; padding: 0.75em 0 !important; text-align: right">RM ${this.thousandSeparator(
				total.reduce((a, b) => (a += b), 0)
			)}</th>`
		);
		$('#table').append(`</tr>`);
	}

	resetTable() {
		const tableContainer = $('#tableContainer');
		const table = $('#table');

		if (table) {
			table.remove();

			const newTable = document.createElement('table');
			newTable.setAttribute('id', 'table');
			newTable.setAttribute('class', 'table');

			tableContainer.append(newTable);
		}
	}

	onYearChange() {
		clearTimeout(this.timer);
		const customDateOption = this.yearOptions[this.yearOptions.length - 1];

		if (this.selectedYearOption === 'custom') {
			const modalRef = this.modalService.open(CustomTimeRangeComponent);

			modalRef.result.then(
				(result) => {
					if (result) {
						this.startDate = result.start_date;
						this.endDate = result.end_date;

						customDateOption.label = `${this.startDate.format('YYYY-MM-DD')} to ${this.endDate.format(
							'YYYY-MM-DD'
						)}`;

						this.timer = setTimeout(() => {
							// this.getReport();
						}, 500);
					} else {
						this.selectedYearOption = this.startDate.format('YYYY');
					}
				},
				(err) => {
					console.log('err: ', err);
					this.selectedYearOption = this.startDate.format('YYYY');
				}
			);
		} else {
			customDateOption.label = 'Customised time range';
			if (this.startDate.format('YYYY') === this.selectedYearOption) {
				return;
			}

			const now = moment();
			const selectedDuration = moment(`${this.selectedYearOption}-01-01`);

			if (selectedDuration.format('YYYY') === now.format('YYYY')) {
				this.startDate = selectedDuration.startOf('year');
				this.endDate = now;
			} else {
				this.startDate = selectedDuration.clone().startOf('year');
				this.endDate = selectedDuration.clone().endOf('year');
			}

			this.timer = setTimeout(() => {
				this.getReport();
			}, 500);
		}
	}

	onBranchChange() {
		this.getReport();
	}

	ngOnDestroy(): void {
		this.defaultBranch$$.unsubscribe();
	}
}
