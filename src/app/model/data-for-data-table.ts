export interface DataForDataTable {
    data: any;
    dataTable: {
        headerRow: string[];
        footerRow: string[];
        dataRows: Array<Array<string>>;
    }
}
