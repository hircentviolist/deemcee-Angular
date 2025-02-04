import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';
import { ReportsService } from '../reports.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomTimeRangeComponent } from '../modal/custom-time-range/custom-time-range.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

const PAST_YEAR_COUNT = 3;
const MIN_PAST_YEAR = 2019;
const DATE_TYPE = {
	payment_date: 'Payment Date',
	enrolment_date: 'Enrolment Date',
}

@Component({
	selector: 'app-referral-report',
	templateUrl: './referral-report.component.html',
	styleUrls: ['./referral-report.component.css']
})
export class ReferralReportComponent implements OnInit {
	mode: string = 'total';
	isLoading: boolean = false;

	isAllBranch: boolean = true;
	dateType: string = 'payment_date'; // payment_date || enrolment_date

	startDate = moment().startOf('year');
	endDate = moment();

	selectedYearOption: string = moment().format('YYYY');
	yearOptions = [];

	dateTypeList = [
		{ label: 'Payment Date', value: 'payment_date' },
		{ label: 'Enrolment Date', value: 'enrolment_date' }
	];

	referralChannels: any;
	referralDropdownSettings: IDropdownSettings = {
		singleSelection: false,
		textField: 'name',
		selectAllText: 'Select All',
		unSelectAllText: 'UnSelect All',
		itemsShowLimit: 1,
		allowSearchFilter: true,
		enableCheckAll: true,
	}
	selectedReferralChannels: {id: number, name: string}[] = [];

	colors: Array<string> = ['#8f8bff', '#55d8fe', '#ff8373', '#ffda83', '#83ffac', '#e755fe', '#cc7d7d', '#40b4a1', '#004bae']
	
	canvas: any;
	ctx: any;
	myChart: any;
	gradientStroke: any;
	gradientFill: any;
	chartColor:string = "#FFFFFF";

	xAxisLabels: Array<string> = [];
	dataSets: Array<any> =  [];

	constructor(
		private licenseeService: LicenseeService,
		private reportsService: ReportsService,
		private modalService: NgbModal,
	) {
		this.generateYearOptions();
	}

	ngOnInit(): void {
		this.isLoading = true;
		this.getChannels();
	}

	getChannels() {
		this.reportsService.getReferralChannels().subscribe(res => {
			this.referralChannels = res;
			this.selectedReferralChannels = this.referralChannels;
			
			this.getReport();
		}, err => {
			console.log(err)
		})
	}

	getReport() {
		this.isLoading = true;
		this.resetGraph();
		this.resetTable();

		const body = {
			start_date: this.startDate.format('YYYY-MM-DD'),
			end_date: this.endDate.format('YYYY-MM-DD'),
			date_type: this.dateType,
			referral_channel_ids: this.selectedReferralChannels.map(c => c.id),
			branch_ids: [],
			all_branch: this.isAllBranch
		}

		this.reportsService.getReferralReport(body).subscribe(res => {
			this.xAxisLabels = this.getXAxisLabels();
			this.dataSets = this.getDataSets(res);

			this.createGraph();
			this.createTable();
			
			this.isLoading = false;
		}, err => {
			console.log(err);
		})
	}

	resetGraph() {
		const canvas = $('#graph');
		canvas.remove();

		const newCanvas = document.createElement('canvas');
		newCanvas.setAttribute('id', 'graph');

		const graphContainer = $('#totalGraphContainer');
		graphContainer.append(newCanvas);
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

	getXAxisLabels() {
		const labels = [];
		const start = this.startDate.clone().startOf('month');
		const end = this.endDate.clone().endOf('month');

		while (end.diff(start, 'days') > 0) {
			if (labels.length < 12) {
				labels.push(start.format('MMM YYYY'))
				start.add(1, 'month');
			} else {
				break;
			}
		}

		return labels;
	}

	getDataSets(data) {
		const dataSets = [];

		data.months.forEach(month => {
			month.channels.forEach((channel, channelIndex) => {
				if (dataSets.length) {
					if (typeof dataSets[channelIndex] === 'undefined') {
						dataSets.push({
							id: channel.channel_id,
							label: channel.channel_name,
							borderColor: this.colors[channelIndex],
							fill: false,
							borderWidth: 1,
							data: [channel.count]
						})
					} else {
						dataSets[channelIndex].data.push(channel.count)
					}
				} else {
					dataSets.push({
						id: channel.channel_id,
						label: channel.channel_name,
						borderColor: this.colors[channelIndex],
						fill: false,
						borderWidth: 1,
						data: [channel.count]
					})
				}
			})
			
		})

		return dataSets;
	}

	createGraph() {
		this.canvas = document.getElementById("graph")
		this.ctx = this.canvas.getContext("2d");

		this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
		this.gradientStroke.addColorStop(0, '#80b6f4');
		this.gradientStroke.addColorStop(1, this.chartColor);

		this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
		this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
		this.gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");
		
		this.myChart = new Chart(this.ctx, {
			type: 'line',
			data: {
				labels: this.xAxisLabels,
				datasets: this.dataSets
			},
			options: {
				legend: {
					display: true,
					align: 'start',
					labels: {
						boxWidth: 12
					}
				},

				tooltips: {
					enabled: true
				},

				scales: {
					yAxes: [{
						ticks: {
							fontColor: "#9f9f9f",
							beginAtZero: true,
							maxTicksLimit: 5,
							//padding: 20
						},
						gridLines: {
							drawBorder: false,
							zeroLineColor: "transparent",
							color: 'rgba(255,255,255,0.05)'
						}
					}],

					xAxes: [{
						barPercentage: 1.6,
						gridLines: {
							drawBorder: false,
							color: 'rgba(255,255,255,0.1)',
							zeroLineColor: "transparent",
							display: false,
						},
						ticks: {
							padding: 20,
							fontColor: "#9f9f9f"
						}
					}]
				},
			}
		});
	}
	
	createTable() {
		const table = $("#table");

		// get referral channel name for table headers (th)
		const ths = [DATE_TYPE[this.dateType], ...this.selectedReferralChannels.map(b => b.name)];

		// map table data (tds) rows (trs)
		const trs = this.xAxisLabels.map((label, i) => {
			const tds = [label];

			// get referral count for table data (td)
			this.dataSets.forEach(d => {
				tds.push(d.data[i])
			})

			return tds;
		})

		// add ths
		table.append(`<tr>`)
			ths.forEach(th => {
				table.append(`<th>${th}</th>`)
			})
			table.append(`</tr>`)

		// add tds row by row
		trs.forEach(tr => {
			table.append(`<tr>`)
				tr.forEach(td => {
					table.append(`<td>${td}</td>`)
				})
			table.append(`</tr>`)
		});
	}

	generateYearOptions() {
		const now = moment();

		for (let i = 0; i < PAST_YEAR_COUNT; i++) {
			this.yearOptions.push(
				{
					label: `Year ${now.format('YYYY')}`,
					value: now.format('YYYY')
				}
			);
			now.subtract(1, 'years');

			if (Number(now.format('YYYY')) < MIN_PAST_YEAR) break;
		}
		
		this.yearOptions.push(
			{
				label: 'Customised time range',
				value: 'custom'
			}
		);
	}

	onYearChange() {
		this.mode = 'filter';
		const customDateOption = this.yearOptions[this.yearOptions.length - 1];

		if (this.selectedYearOption === 'custom') {
			const modalRef = this.modalService.open(CustomTimeRangeComponent);

			modalRef.result.then(result => {
				if (result) {
					this.startDate = result.start_date;
					this.endDate = result.end_date;

					customDateOption.label = `${this.startDate.format('YYYY-MM-DD')} to ${this.endDate.format('YYYY-MM-DD')}`;

					this.getReport();
				} else {
					this.selectedYearOption = this.startDate.format('YYYY');
				}
			}, err => {
				console.log('err: ', err)
				this.selectedYearOption = this.startDate.format('YYYY');
			})
		} else {
			customDateOption.label = 'Customised time range';
			const now = moment();
			const selectedDuration = moment(`${this.selectedYearOption}-01-01`);
	
			if (selectedDuration.format('YYYY') === now.format('YYYY')) {
				this.startDate = selectedDuration.startOf('year');
				this.endDate = now;
			} else {
				this.startDate = selectedDuration.clone().startOf('year');
				this.endDate = selectedDuration.clone().endOf('year');;
			}
		
			this.getReport();
		}
	}

	onDateTypeChange() {
		this.mode = 'filter';
		this.getReport();
	}

	onChannelSelect(action = null) {
		this.mode = 'filter';

		if (action && action === 'select_all') {
			this.selectedReferralChannels = this.referralChannels;
		} else if (action && action === 'deselect_all') {
			this.selectedReferralChannels = [];
		}
		
		if (this.selectedReferralChannels.length) {
			this.getReport();
		}
	}

	dateFormat(date: {year: number, month: number}) {
		const time = '00:00:00';
		return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-01 ' + time;
	}

	resetFilter() {
		this.mode = 'total';
		this.selectedYearOption = this.yearOptions[0].value;
		this.startDate = moment().startOf('year');
		this.endDate = moment();
		this.dateType = 'payment_date';
		this.selectedReferralChannels = this.referralChannels;

		this.getReport();
	}
}
