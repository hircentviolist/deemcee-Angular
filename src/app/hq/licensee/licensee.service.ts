import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { retry, map, tap } from 'rxjs/operators';
import { Branch } from 'app/model/branch';
import { BranchListDto } from 'app/model/branch-list-dto';
import { DataForSelect } from 'app/model/data-for-select';
import { Observable } from 'rxjs';
import { GetOneBranchDto } from 'app/model/get-one-branch-dto';

@Injectable({
  providedIn: 'root'
})
export class LicenseeService {

  constructor(private http: HttpClient) {}

  public getAllBranches() {

    const url = environment.backendApi + 'branches';

    return this.http.get<BranchListDto[]>(url)
            .pipe (
              retry(3),
              map(branchItems => {

                let tempArray;
                const data = branchItems;
                const dataTable = {
                  headerRow: [ 'Franchisee', 'Branch Name', 'Operation Date', 'Grade (%)' ],
                  footerRow: [ 'Franchisee', 'Branch Name', 'Operation Date', 'Grade (%)' ],
                  dataRows: []
                }

                branchItems.forEach(branchItem => {
                  tempArray = [];
                  tempArray.push(branchItem.principal.name);
                  tempArray.push(branchItem.name);
                  tempArray.push(branchItem.operation_date);
                  tempArray.push(`${branchItem.grade.percentage}%`);

                  dataTable.dataRows.push(tempArray);

                });

                return {
                  data,
                  dataTable
                }
              }),
              tap(console.log)
            )

  }

  public createBranch(branch: Branch) {

    const url = environment.backendApi + 'branches';

    return this.http.post(url, branch)
            .pipe(
              retry(3)
            )

  }

  public getOneBranch(id: number): Observable<GetOneBranchDto> {

    const url = environment.backendApi + 'branches/' + id;
    return this.http.get<GetOneBranchDto>(url);
  }

  public updateBranch(id: number, branch: Branch) {

    const url = environment.backendApi + 'branches/' + id;
    return this.http.put<Branch>(url, branch);

  }

  public getBranchForSelect(): Observable<DataForSelect[]> {

    const url = environment.backendApi + 'branches/list';

    return this.http.get<DataForSelect[]>(url)

  }

  public getBranchForTransferOut(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'branches/list/transfer_out';
    return this.http.get<DataForSelect[]>(url)
  }

  public getPublicBranchForSelect(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'branches/list/public';
    return this.http.get<DataForSelect[]>(url)
  }

  public deleteBranch(id: string) {
    const url = environment.backendApi + 'branches/' + id.toString();
    return this.http.delete(url);
  }

  public getAdminBranchForSelect(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'branches/list/admin';
    return this.http.get<DataForSelect[]>(url)
  }

  public getBranchGradeList(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'branches/grades';
    return this.http.get<DataForSelect[]>(url)
  }
}
