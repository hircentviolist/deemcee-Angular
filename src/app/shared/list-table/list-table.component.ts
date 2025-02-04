import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserPermission } from 'app/model/user-permission';
import { DataForDataTable } from 'app/model/data-for-data-table';

declare var $: any;

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: string[][];
}

@Component({
  selector: 'app-list-table',
  templateUrl: '../../tables/datatable.net/datatable.component.html',
  styleUrls: ['./list-table.component.css']
})
export class ListTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() search: string;
  @Output() searchChange: EventEmitter<any> = new EventEmitter(true);
  @Output() valueChange = new EventEmitter();
  @Input() user: UserPermission;
  @Input() data: DataForDataTable;
  public dataTable: DataTable;
  table;
  tabId: number;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    console.log(this.user.display);
    this.tabId = +this.route.snapshot.queryParamMap.get('tabId');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['data'] !== 'undefined') {
      if (this.table) {
        this.table.destroy()
      }
      this.dataTable = this.data.dataTable;
      this.ngAfterViewInit();
    }
  }

  ngAfterViewInit() {
    if (!this.table) {
      return
    }
    $('#datatable').DataTable({
      'pagingType': 'full_numbers',
      'lengthMenu': [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      responsive: true,
      language: {
        search: '_INPUT_',
        searchPlaceholder: 'Search records',
      }

    });

    this.table = $('#datatable').DataTable();

    // Edit record
    // this.table.on('click', '.edit', function() {
    //   const $tr = $(this).closest('tr');

    //   const data = this.table.row($tr).data();
    //   alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
    // });

    // Delete a record
    this.table.on('click', '.remove', function(e) {
      const $tr = $(this).closest('tr');
      this.table.row($tr).remove().draw();
      e.preventDefault();
    });

  }

  onAdd() {
    // Convert Array Index to actual id first
    if (this.user.path) {
      this.router.navigate(['../', this.user.path, 'add'], {relativeTo: this.route});
    } else {
      this.router.navigate(['../', 'add'], {relativeTo: this.route});
    }
  }

  onEdit(i: number) {
    // Convert Array Index to actual id first

    if (this.user.path) {
      this.router.navigate(['../', this.user.path, 'update', this.data.data[i].id], {relativeTo: this.route});
    } else {
      this.router.navigate(['../', 'update', this.data.data[i].id], {relativeTo: this.route});
    }
  }

  onDelete(i: number) {
    // Convert Array Index to actual id first
    alert ('delete record ' + i);
  }


  ngOnDestroy() {
    console.log('destroyed')
    if (this.table) {
      this.table.destroy()
    }
  }

  onKeyUp(e) {
    this.searchChange.emit(e.target.value);
    this.valueChange.emit(this.search);
  }

}
