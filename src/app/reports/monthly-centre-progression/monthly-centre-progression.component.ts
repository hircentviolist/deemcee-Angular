import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import Chart from 'chart.js';
import { ReportsService } from '../reports.service';
import { LicenseeService } from 'app/hq/licensee/licensee.service';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable, Subscription } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomTimeRangeComponent } from '../modal/custom-time-range/custom-time-range.component';
import { DefaultBranchService } from 'app/default-branch.service';
import { Credentials } from 'app/model/credentials';

const PAST_YEAR_COUNT = 3;
const MIN_PAST_YEAR = 2019;
const COLORS = {
	total_active_students: "#8f8bff",
	total_new_enrolment: "#55d8fe",
	total_drop_out: "#ff8373",
	total_transfer_in: "#ffda83",
	total_transfer_out: "#83ffac",
	total_freezed: "#e755fe",
	total_advance: "#cc7d7d",
	total_extended: "#40b4a1",
	total_graduated: "#004bae",
}

@Component({
	selector: 'app-monthly-centre-progression',
	templateUrl: './monthly-centre-progression.component.html',
	styleUrls: ['./monthly-centre-progression.component.css']
})
export class MonthlyCentreProgressionComponent implements OnInit {
	@ViewChild('selectPicker') selectPicker: ElementRef;
	@Input() cred: Credentials;
	
	mode = 'total';
	branch$: Observable<DataForSelect[]>;
	defaultBranch$$: Subscription;
	branch_id: number;
	
	isLoading: boolean = true;

	startDate = moment().startOf('year');
	endDate = moment();

	canvas: any;
	ctx: any;
	myChart: any;
	gradientStroke: any;
	gradientFill: any;
	chartColor:string = "#FFFFFF";
	// dataSets: Array<any> = [];
	xAxisLabels: Array<any> = [];
	tableData: Array<any> = [];

	filteredCanvas: any;
	filteredCtx: any;
	filteredMyChart: any;
	filteredGradientStroke: any;
	filteredGradientFill: any;
	filteredChartColor:string = "#FFFFFF";
	filteredDataSets: Array<any> = [];
	filteredXAxisLabels: Array<any> = [];
	filteredTableData: Array<any> = [];

	branchesDataSets: Array<any> = [];

	activeStudents = {label: 'Total Active Student', key: 'active_students', borderColor: "#8f8bff", data: []};
	newEnrolment = {label: 'New Enrolment', key: 'new_enrolment', borderColor: "#55d8fe", data: []};
	droppedOut = {label: 'Dropped Out', key: 'drop_out', borderColor: "#ff8373", data: []};
	transferIn = {label: 'Transfer In', key: 'transfer_in', borderColor: "#ffda83", data: []};
	transferOut = {label: 'Transfer Out', key: 'transfer_out', borderColor: "#83ffac", data: []};
	freezed = {label: 'Freezed', key: 'freezed', borderColor: "#e755fe", data: []};
	advanced = {label: 'Advanced', key: 'advance', borderColor: "#cc7d7d", data: []};
	extended = {label: 'Extended', key: 'extended', borderColor: "#40b4a1", data: []};
	graduated = {label: 'Graduated', key: 'graduated', borderColor: "#004bae", data: []};

	selectedYearOption: string = moment().format('YYYY');
	yearOptions = [];

	branchDropdownSettings: IDropdownSettings;
	branchOptions: {id: number, name: string, months: []}[] = [];
	selectedBranchOption: {id: number, name: string, months: []}[] = [];
	selectedTotalBranch: {id: number, name: string, months: []} [] = [];

	statusDropdownSettings: IDropdownSettings;
	statusOptions: {value: string, name: string}[] = [];
	selectedStatusOption: {value: string, name: string}[] = [];
	selectedTotalStatus: {value: string, name: string}[] = [];

	isMultipleBranch: boolean = false;
	isMultipleAction: boolean = true;

	hasFilter: boolean = false;
	nonAdminHasFilter: boolean = false;
    timer: any;
	report: any;

	constructor(
		private licenseeService: LicenseeService,
		private reportsService: ReportsService,
		private modalService: NgbModal,
		private defaultBranchService: DefaultBranchService,
	) {
		this.generateYearOptions();
		this.generateBranchOptions();
		this.generateStatusOptions();
	}

	ngOnInit(): void {
		this.branch$ = this.branch$ = this.licenseeService.getBranchForSelect();
		this.defaultBranch$$ =
		this.defaultBranchService.defaultBranch$.subscribe(branch_id => {
			if (branch_id) {
				this.branch_id = branch_id;
				
				if (this.cred.role !== 'superadmin' && this.cred.role !== 'admin') {
					this.mode = 'filter';
					this.isMultipleBranch = false;
					this.isMultipleAction = true;
					this.selectedBranchOption = [{id: this.branch_id, name: '', months: []}];
					this.selectedStatusOption = this.statusOptions;
				}
				this.getReport();
			}
		});
	}

	createGraph() {
		this.canvas = <HTMLCanvasElement>document.getElementById("mixGraph")
		this.ctx = this.canvas.getContext("2d");
		this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
		this.gradientStroke.addColorStop(0, '#80b6f4');
		this.gradientStroke.addColorStop(1, this.chartColor);
		this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
		this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
		this.gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");
		
		this.myChart = new Chart(this.ctx, {
			type: 'bar',
			data: {
				datasets: this.dataSets,
				labels: this.getXAxisLabels(),
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
					mode: 'label'
				},
				scales: {
					yAxes: [{
						ticks: {
							fontColor: "#9f9f9f",
							beginAtZero: true,
							maxTicksLimit: 5,
						},
					}],

					xAxes: [{
						stacked: true,
						barPercentage: 0.5,
						categoryPercentage: 0.5,
						gridLines: {
							drawBorder: false,
							color: 'rgba(255,255,255,0.1)',
							zeroLineColor: "transparent",
							display: false,
						},
						ticks: {
							padding: 10,
							fontColor: "#9f9f9f"
						}
					}]
				},
			}
		});
		this.isLoading = false;
	}
	
	getReport() {
		this.isLoading = true;

		const canvas = $('#mixGraph');
		canvas.remove();

		const newCanvas = document.createElement('canvas');
		newCanvas.setAttribute('id', 'mixGraph');

		const graphContainer = $('#mixGraphContainer');
		graphContainer.append(newCanvas);

		// if (this.mode === 'filter') {
			// if ((this.isMultipleBranch && this.isMultipleAction) || (!this.isMultipleBranch && !this.isMultipleAction)) {
			// 	return;
			// }

			// const canvas = $('#filteredGraph');
			// canvas.remove();
	
			// const newCanvas = document.createElement('canvas');
			// newCanvas.setAttribute('id', 'filteredGraph');
	
			// const graphContainer = $('#filteredGraphContainer');
			// graphContainer.append(newCanvas);

			// const body = {
			// 	start_date: this.startDate.format('YYYY-MM-DD'),
			// 	end_date: this.endDate.format('YYYY-MM-DD'),
			// 	multiple_branch: this.isMultipleBranch,
			// 	branch_ids: this.selectedBranchOption.map(b => b.id),
			// 	multiple_action: this.isMultipleAction,
			// 	actions: this.selectedStatusOption.map(s => s.value)
			// }

			// this.reportsService.getMonthlyProgressionReport(body).subscribe(res => {

			// 	this.mapFilteredGraphData(res['branch_ids'] ?? res['months']);
			// 	this.createFilteredGraph();
			// }, err => {
			// 	console.log(err)
			// })
		// } else {
			const body = {
				start_date: this.startDate.format('YYYY-MM-DD'),
				end_date: this.endDate.format('YYYY-MM-DD'),
				branch_ids: this.selectedBranchOption.map(b => b.id),
			}

			this.reportsService.getMonthlyProgressionReportTotal(body).subscribe(res => {
				// this.mapGraphData(res['months']);
				this.report = res;
				this.createGraph();
				this.createTable();
			}, err => {
				console.log(err)
			})
		// }
	}

	mapGraphData(data) {
		this.resetGraphData();

		this.tableData = data.map(d => {
			d.date = moment(d.start_date).format('MMM YYYY');
			return d;
		});
		
		data.forEach(d => {
			this.activeStudents.data.push(d.total_active_students);
			this.newEnrolment.data.push(d.total_new_enrolment);
			this.droppedOut.data.push(d.total_drop_out);
			this.transferIn.data.push(d.total_transfer_in);
			this.transferOut.data.push(d.total_transfer_out);
			this.freezed.data.push(d.total_freezed);
			this.advanced.data.push(d.total_advance);
			this.extended.data.push(d.total_extended);
			this.graduated.data.push(d.total_graduated);
		});

		this.xAxisLabels = this.getXAxisLabels();
		// this.dataSets = this.getDataSets();
	}

	mapFilteredGraphData(data) {
		this.resetGraphData();

		// single branch n multiple status
		if (!this.isMultipleBranch && this.isMultipleAction) {
			data.forEach(d => {
				this.activeStudents.data.push(d.active_students ?? null);
				this.newEnrolment.data.push(d.new_enrolment ?? null);
				this.droppedOut.data.push(d.drop_out ?? null);
				this.transferIn.data.push(d.transfer_in ?? null);
				this.transferOut.data.push(d.transfer_out ?? null);
				this.freezed.data.push(d.freezed ?? null);
				this.advanced.data.push(d.advance ?? null);
				this.extended.data.push(d.extended ?? null);
				this.graduated.data.push(d.graduated ?? null);
			});
		}  else if (this.isMultipleBranch && !this.isMultipleAction) {
			// multiple branch n multiple status
			data.forEach(branch => {
				this.selectedBranchOption.find(branchOption => {
					if (branchOption.id === branch.branch_id) {
						branchOption.months = branch.months;
					}
				})
			});

		}

		this.filteredXAxisLabels = this.getXAxisLabels();
		this.filteredDataSets = this.getFilteredDataSets(data);
		
		this.createTable();
	}

	resetGraphData() {
		this.activeStudents.data = []
		this.newEnrolment.data = []
		this.droppedOut.data = []
		this.transferIn.data = []
		this.transferOut.data = []
		this.freezed.data = []
		this.advanced.data = []
		this.extended.data = []
		this.graduated.data = []
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

	mapDataSet(dataSets, data) {
		const color = this.getRandomColor();
		const existingDataSet = dataSets.find(dataSet => dataSet.key === data.key);
		const isNegative = data.key === 'total_drop_out' ||
			data.key === 'total_transfer_out' ||
			data.key === 'total_freezed' ||
			data.key === 'total_graduated';

		if (existingDataSet) {
			existingDataSet.data.push(isNegative ? -data[data.key] : data[data.key]);
		} else {
			if (data.key === 'total_active_students') {
				dataSets.push({
					key: data.key,
					label: data.label,
					borderColor: COLORS.hasOwnProperty(data.key) ? COLORS[data.key] : color,
					backgroundColor: 'transparent',
					data: [data[data.key]],
					type: 'line',
				});
			} else {
				dataSets.push({
					key: data.key,
					label: data.label,
					borderColor: COLORS.hasOwnProperty(data.key) ? COLORS[data.key] : color,
					backgroundColor: COLORS.hasOwnProperty(data.key) ? COLORS[data.key] : color,
					fill: false,
					hoverBackgroundColor: COLORS.hasOwnProperty(data.key) ? COLORS[data.key] : color,
					data: [isNegative ? -data[data.key] : data[data.key]],
				});
			}
		}
	}

	get dataSets(): any[] {
		const dataSets = [];
		this.report.months.forEach(data => {
			Object.keys(data).forEach(key => {
				data.excluded = false;
				data.key = key;

				switch (key) {
					case 'total_active_students': data.label = 'Total Active Student';
					break;
					case 'total_new_enrolment': data.label = 'New Enrolment';
					break;
					case 'total_drop_out': data.label = 'Dropped Out';
					break;
					case 'total_transfer_in': data.label = 'Transfer In';
					break;
					case 'total_transfer_out': data.label = 'Transfer Out';
					break;
					case 'total_graduated': data.label = 'Graduated';
					break;
					default: data.excluded = true;
				}
				if (!data.excluded) this.mapDataSet(dataSets, data)
			})
		})
		return dataSets;
	}

	get dataTable(): any[] {
		const dataTable = [];
		
		this.report.months.forEach(data => {
			Object.keys(data).forEach(key => {
				console.log(key)
				data.excluded = false;
				data.key = key;

				switch (key) {
					case 'total_active_students': data.label = 'Total Active Student';
					break;
					case 'total_new_enrolment': data.label = 'New Enrolment';
					break;
					case 'total_drop_out': data.label = 'Dropped Out';
					break;
					case 'total_transfer_in': data.label = 'Transfer In';
					break;
					case 'total_transfer_out': data.label = 'Transfer Out';
					break;
					case 'total_graduated': data.label = 'Graduated';
					break;
					default: data.excluded = true;
				}
				if (!data.excluded) this.mapDataSet(dataTable, data)
			})
		})
		return dataTable;
	}

	get extraDataTable(): any[] {
		const extraDataTable = [];
		
		this.report.months.forEach(data => {
			Object.keys(data).forEach(key => {
				data.excluded = false;
				data.key = key;

				switch (key) {
					case 'total_freezed': data.label = 'Freezed';
					break;
					case 'total_advance': data.label = 'Advanced';
					break;
					case 'total_extended': data.label = 'Extended';
					break;
					default: data.excluded = true;
				}
				if (!data.excluded) this.mapDataSet(extraDataTable, data)
			})
		})
		return extraDataTable;
	}

	getFilteredDataSets(data) {
		const dataSets = [
			this.activeStudents,
			this.newEnrolment,
			this.droppedOut,
			this.transferIn,
			this.transferOut,
			this.freezed,
			this.advanced,
			this.extended,
			this.graduated,
		];

		if (!this.isMultipleBranch && this.isMultipleAction) {
			const filteredDataSets = dataSets.filter(dataSet => {
				return dataSet.data.every(d => d !== null);
			})

			return filteredDataSets.map(d => {
				return {
					...d,
					fill: false,
					borderWidth: 1
				}
			});
		} else if (this.isMultipleBranch && !this.isMultipleAction) {
			const status = dataSets.find(dataSet => {
				return dataSet.key === this.selectedStatusOption[0].value
			});

			return data.map((d, i) => {
				const mappedData = d.months.map(m => {
					return m[status.key];
				})

				return {
					label: this.selectedBranchOption.find(b => b.id === d.branch_id).name,
					borderColor: dataSets[i] ? dataSets[i].borderColor : this.getRandomColor(),
					data: mappedData,
					fill: false,
					borderWidth: 1
				}
			});
		}
	}

	getRandomColor() {
		const n = this.getRandomNumber;
		return `rgba(${n(0, 255)}, ${n(0, 255)}, ${n(0, 255)}, 0.5)`;
	}

	getRandomNumber(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	OLD_createGraph() {
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
		
		this.isLoading = false;
	}

	createFilteredGraph() {
		this.filteredCanvas = document.getElementById("filteredGraph")
		this.filteredCtx = this.filteredCanvas.getContext("2d");

		this.filteredGradientStroke = this.filteredCtx.createLinearGradient(500, 0, 100, 0);
		this.filteredGradientStroke.addColorStop(0, '#80b6f4');
		this.filteredGradientStroke.addColorStop(1, this.filteredChartColor);

		this.filteredGradientFill = this.filteredCtx.createLinearGradient(0, 170, 0, 50);
		this.filteredGradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
		this.filteredGradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");
		
		this.filteredMyChart = new Chart(this.filteredCtx, {
			type: 'line',
			data: {
				labels: this.filteredXAxisLabels,
				datasets: this.filteredDataSets
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
		
		this.isLoading = false;
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

	generateBranchOptions() {
		this.branchDropdownSettings = {
			singleSelection: false,
			textField: 'name',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 1,
			allowSearchFilter: true,
			enableCheckAll: true,
		}

		this.licenseeService.getBranchForSelect().subscribe(branches => {
			this.branchOptions = branches.map(b => {
				return {
					...b,
					months: []
				}
			});
			this.selectedTotalBranch = this.branchOptions;

			this.checkBranchDropdownValue();
		});
	}
	
	generateStatusOptions() {
		this.statusDropdownSettings = {
			singleSelection: false,
			idField: 'value',
			textField: 'name',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 1,
			allowSearchFilter: true
		};

		this.statusOptions = [
			this.activeStudents,
			this.newEnrolment,
			this.droppedOut,
			this.transferIn,
			this.transferOut,
			this.freezed,
			this.advanced,
			this.extended,
			this.graduated
		].map(status => {
			return {
				value: status.key,
				name: status.label,
			}
		})
		
		this.selectedTotalStatus = this.statusOptions;
	}

	onYearChange() {
		clearTimeout(this.timer);
		this.nonAdminHasFilter = true;
		this.hasFilter = true;
		const customDateOption = this.yearOptions[this.yearOptions.length - 1];

		if (this.selectedYearOption === 'custom') {
			const modalRef = this.modalService.open(CustomTimeRangeComponent);

			modalRef.result.then(result => {
				if (result) {
					this.startDate = result.start_date;
					this.endDate = result.end_date;

					customDateOption.label = `${this.startDate.format('YYYY-MM-DD')} to ${this.endDate.format('YYYY-MM-DD')}`;

					this.timer = setTimeout(() => {
						this.getReport();
					}, 1000);
				} else {
					this.selectedYearOption = this.startDate.format('YYYY');
				}
			}, err => {
				console.log('err: ', err)
				this.selectedYearOption = this.startDate.format('YYYY');
			})
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
				this.endDate = selectedDuration.clone().endOf('year');;
			}
		
			this.timer = setTimeout(() => {
				this.getReport();
			}, 1000);
		}
	}

	checkBranchDropdownValue() {
		if (!this.selectedBranchOption.length) {
			this.selectedBranchOption = this.branchOptions;
		}
	}

	onBranchSelect(action = null) {
		this.hasFilter = true;
		clearTimeout(this.timer);
		if (action) {
			if (action === 'select_all') {
				this.selectedBranchOption = this.branchOptions;
			} else if (action === 'deselect_all') {
				this.selectedBranchOption = [];
			}
		}

		if (!this.selectedBranchOption.length) {
			return;
		}

		if (this.selectedBranchOption.length === 1) {
			this.isMultipleBranch = false;
			this.isMultipleAction = true;
		} else {
			this.isMultipleBranch = true;
			this.isMultipleAction = false;
		}
		
		this.timer = setTimeout(() => {
			this.getReport();
		}, 1000);
	}

	onStatusSelect(action = null) {
		clearTimeout(this.timer);
		if (action) {
			if (action === 'select_all') {
				this.selectedStatusOption = this.statusOptions;
			} else if (action === 'deselect_all') {
				this.selectedStatusOption = [];
			}
		}

		if (this.selectedStatusOption.length) {
			this.nonAdminHasFilter = true;

			this.timer = setTimeout(() => {
				this.getReport();
			}, 1000);
		}
	}

	getStatusDropdownSettings(isSingleSelection = true) {
		// this.isMultipleAction = !isSingleSelection;

		return {
			singleSelection: isSingleSelection,
			idField: 'value',
			textField: 'name',
			selectAllText: 'Select All',
			unSelectAllText: 'UnSelect All',
			itemsShowLimit: 1,
			allowSearchFilter: true
		};
	}

	toggleMultipleStatus({name = null, status = null}) {
		if (name && name === 'branch' && status !== null) {
			this.isMultipleBranch = status;
		} else if (name && name === 'status' && status !== null) {
			this.isMultipleAction = status;
		} else {
			[this.isMultipleBranch, this.isMultipleAction] = [this.isMultipleAction, this.isMultipleBranch];
			
			// if both is true, swap back
			if (this.isMultipleBranch && this.isMultipleAction) {
				[this.isMultipleBranch, this.isMultipleAction] = [this.isMultipleAction, this.isMultipleBranch];
			}
		}
	}

	OLD_createTable(data = null) {
		if (this.isMultipleBranch && !this.isMultipleAction) {
			// get branch name for table headers (th)
			const ths = this.selectedBranchOption.map(b => b.name);
			const tds = [];
	
			// get status count for table data (td)
			this.selectedBranchOption.map((b, i) => {
				/**
				 * tds = [
				 * 		<tr> <th> branch1 </th> <th> branch2 </th> </tr>
				 * 		<tr> [ [ td1-branch1 ], [ td2-branch2 ] ] </tr>,
				 * 		<tr> [ [ td2-branch1 ], [ td2-branch2 ] ] </tr>
				 * ]
				 */
				b.months.forEach((m, j) => {
					if (tds.length && tds[j]) {
						tds[j] = [
							...tds[j],
							m
						]
					} else {
						tds.push([m])
					}
				})
			})
			
			// add ths
			$("#table").append(`<tr>`)
				// first th will always be date
				$("#table").append(`<th>Date</th>`)
	
				// append remaing th - branch_name
				ths.forEach(th => {
					$("#table").append(`<th>${th}</th>`)
				})
			$("#table").append(`</tr>`)
	
			// add td according to the ths
			tds.forEach(td => {
				/**
				 * just take first index for month and year, all date is the same in same td
				 * td[0].month === td[1].month and so on
				 */ 
				const date = `${td[0].year}-${td[0].month}-01`;
	
				// add date and count to tds
				$("#table").append(`<tr>`)
				$("#table").append(`<td>${moment(date).format('MMM YYYY')}</td`);
					// loop through ths to get the th index to match with the branch_name column
					ths.forEach((th, i) => {
						$("#table").append(`<td>${td[i][this.selectedStatusOption[0].value]}</td`);
					})
				$("#table").append(`</tr>`)
			});
		} else if (!this.isMultipleBranch && this.isMultipleAction) {
			if (!data) {
				console.error('data not provided for table');
			}
			
			// get status name for table headers (th)
			const ths = this.selectedStatusOption.map(b => b.name);
			const tds = data.map(d => {
				
				const result = [];
				const date = `${d.year}-${d.month}-01`;
				const selected = this.selectedStatusOption.map(status => {
					return status.value;
				});

				result.push(moment(date).format('MMM YYYY'))
				selected.forEach(key => {
					result.push(d[key])
				});

				return result;
			});
			
			// add ths
			$("#table").append(`<tr>`)
				// first th will always be date
				$("#table").append(`<th>Date</th>`)
	
				// append remaing th - branch_name
				ths.forEach(th => {
					$("#table").append(`<th>${th}</th>`)
				})
			$("#table").append(`</tr>`)

			// add td according to the ths
			tds.forEach(td => {
				// add date and count to tds
				$("#table").append(`<tr>`)
					td.forEach(t => {
						$("#table").append(`<td>${t}</td`);
					})
				$("#table").append(`</tr>`)
			});
		}
	}

	createTable() {
		this.resetTable();
		const ths = this.report.months.map(d => {
			const date = `${d.year}-${d.month}-01`;
			return moment(date).format('MMM YYYY')
		});

		// add ths
		$("#table").append(`<tr>`)
			// first th will always be empty
			$("#table").append(`<th></th>`)

			// append remaing th: month year
			ths.forEach(th => {
				$("#table").append(`<th>${th}</th>`)
			})

			// last th will always be total
			$("#table").append(`<th>Total</th>`)
		$("#table").append(`</tr>`)

		const totalOpening = this.report.months.map(data => data.total_opening);
console.log('this.dataTable',this.dataTable)

		// add td according to the ths
		this.dataTable.forEach(td => {
			if (td.key === 'total_active_students') {
				$("#table").append(`<tr>`)
					// left most column
					$("#table").append(`<td>Opening</td>`)

					// middle columns
					td.data.forEach((_, i) => {
						$("#table").append(`<td>${totalOpening[i]}</td`);
					})

					// right most column
					$("#table").append(`<td>${totalOpening[0]}</td>`)
				$("#table").append(`</tr>`)
			} else {
				// add status and count to tds
				$("#table").append(`<tr>`)
					// left most column
					$("#table").append(`<td>${td.label}</td>`)

					// middle columns
					const total = td.data.reduce((acc, t) => {
						$("#table").append(`<td>${t}</td`);
						return acc += t;
					}, 0)
					
					// right most column
					$("#table").append(`<td>${total}</td>`)
				$("#table").append(`</tr>`)
			}
		});

		// add monthly (total active student to last row)
		this.dataTable.forEach(td => {
			if (td.key === 'total_active_students') {
				$("#table").append(`<tr>`)
					
					// left most column
					$("#table").append(`<td style="padding: 30px 0.75rem">Monthly Active</td>`)

					// middle columns
					td.data.forEach(t => {
						$("#table").append(`<td style="padding: 30px 0.75rem">${t}</td`);
					})

					// right most column
					$("#table").append(`<td style="padding: 30px 0.75rem">${td.data[td.data.length - 1]}</td>`)
				$("#table").append(`</tr>`)
			}
		})

		// add extra data td (freezed, advance, extended)
		this.extraDataTable.forEach(td => {
			// add status and count to tds
			$("#table").append(`<tr>`)
				// left most column
				$("#table").append(`<td>${td.label}</td>`)

				// middle columns
				const total = td.data.reduce((acc, t) => {
					$("#table").append(`<td>${t}</td`);
					return acc += t;
				}, 0)
				
				// right most column
				$("#table").append(`<td>${total}</td>`)
			$("#table").append(`</tr>`)
		});
		console.log('this.extraDataTable',this.extraDataTable)
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

	resetFilter() {
		clearTimeout(this.timer);
		$('#table').remove();
		
		this.startDate = moment().startOf('year');
		this.endDate = moment();
		this.selectedYearOption = this.yearOptions[0].value;
		this.selectedStatusOption = this.statusOptions;
		this.nonAdminHasFilter = false;
		this.hasFilter = false;

		if (this.cred.role === 'superadmin' || this.cred.role === 'admin' ) {
			this.mode = 'total';
			this.isMultipleBranch = false;
			this.isMultipleAction = false;
	
			this.selectedBranchOption = this.branchOptions;
			
			this.selectedTotalBranch = this.branchOptions;
			this.selectedTotalStatus = this.statusOptions;
		}

		this.timer = setTimeout(() => {
			this.getReport();
		}, 350);
	}

	changeMode(e, changeFrom) {
		clearTimeout(this.timer);
		this.mode = 'filter';

		if (changeFrom === 'branch') {
			this.selectedBranchOption = this.branchOptions.filter(branch => branch.id !== e.id);
			this.selectedStatusOption = this.statusOptions;

			if (this.selectedBranchOption.length < this.branchOptions.length) {
				if (this.selectedBranchOption.length === 1) {
					this.isMultipleBranch = false;
					this.isMultipleAction = true;
				} else {
					this.isMultipleBranch = true;
					this.isMultipleAction = false;
					this.selectedStatusOption = [this.statusOptions[0]];
				}
			} else {
				this.isMultipleBranch = true;
				this.isMultipleAction = false;
				this.selectedStatusOption = [this.selectedStatusOption[0]];
			}

			this.selectedTotalBranch = this.branchOptions;
		} else if (changeFrom === 'status') {
			this.selectedStatusOption = this.statusOptions.filter(status => status.value !== e.value);
			this.selectedBranchOption = this.branchOptions;

			if (this.selectedStatusOption.length < this.statusOptions.length) {
				if (this.selectedStatusOption.length === 1) {
					this.isMultipleAction = false;
					this.isMultipleBranch = true;
				} else {
					this.isMultipleAction = true;
					this.isMultipleBranch = false;
					this.selectedBranchOption = [this.branchOptions[0]];
				}
			} else {
				this.isMultipleAction = true;
				this.isMultipleBranch = false;
				this.selectedBranchOption = [this.selectedBranchOption[0]];
			}

			this.selectedTotalStatus = this.statusOptions;
		}
		
		this.timer = setTimeout(() => {
			this.getReport();
		}, 1000);
	}
	
	ngOnDestroy(): void {
		this.defaultBranch$$.unsubscribe();
	}
}
