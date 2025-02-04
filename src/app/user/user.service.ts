import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Admin } from 'app/model/admin';
import { Principal } from 'app/model/principal';
import { Parent } from 'app/model/parent';
import { DataForSelect } from 'app/model/data-for-select';
import { Manager } from 'app/model/manager';
import { Teacher } from 'app/model/teacher';
import { environment } from 'environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { retry, take, map, tap } from 'rxjs/operators';
import { AdminListItem } from 'app/model/admin-list-item';
import { DataForDataTable } from 'app/model/data-for-data-table';
import { PrincipalListItem } from 'app/model/principal-list-item';
import { ManagerListItem } from 'app/model/manager-list-item';
import { ParentListItem } from 'app/model/parent-list-item';
import { GetOneAdminDto } from 'app/model/get-one-admin-dto';
import { GetOnePrincipalDto } from 'app/model/get-one-principal-dto';
import { GetOneManagerDto } from 'app/model/get-one-manager-dto';
import { GetOneParentDto } from 'app/model/get-one-parent-dto';
import { ProfileGetDto } from 'app/model/profile-get-dto';
import { ProfilePutDto } from 'app/model/profile-put-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getBranchesAndIds() {
    // should return {branchName: string; id: string; principal_id: string}[]
  }

  getPrincipalsAndIds() {
    // should return {id: string; principalName: sting;}[]
  }

  getBranchesAndIdsByUserId() {
    // returns all branches and is of a principal by entering user_id of the principal

  }

  // SuperAdmin

  getAllSuperAdmins(): Observable<DataForDataTable> {
    // Fields Required: [name, deeemcee_email]
    const url = environment.backendApi + 'superadmins';
    return this.http.get<AdminListItem[]>(url)
    .pipe(
      retry(3),
      take(1),
      map(users => {

        let tempArray;
        const data = users;
        const dataTable = {
          headerRow: [ 'Name', 'De Emcee Email'],
          footerRow: [ 'Name', 'De Emcee Email'],
          dataRows: []
        }

        users.forEach(user => {

          tempArray = [];
          tempArray.push(user.name);
          tempArray.push(user.email);

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

  getOneSuperAdmin(id: string): Observable<Admin> {

    const url = environment.backendApi + 'superadmins/' + id.toString();
    return this.http.get<GetOneAdminDto>(url)
            .pipe(
              map(data => {
                delete data.id;
                delete data.name;
                return data;
              })
            );

  }

  createSuperAdmin(sadmin: Admin) {
    const url = environment.backendApi + 'superadmins';
    return this.http.post(url, sadmin)
            .pipe(
              retry(3)
            )
  }

  updateSuperAdmin(sadmin: Admin, id: string) {

    const url = environment.backendApi + 'superadmins/' + id;
    return this.http.put<Admin>(url, sadmin);

  }

  deleteSuperAdmin(id: string) {

    const url = environment.backendApi + 'superadmins/' + id;
    return this.http.delete(url);

  }


  // Admin
  getAllAdmins(): Observable<DataForDataTable> {
    // Fields Required: [name, deeemcee_email]
    const url = environment.backendApi + 'admins';
    return this.http.get<AdminListItem[]>(url)
    .pipe(
      retry(3),
      take(1),
      map(users => {

        let tempArray;
        const data = users;
        const dataTable = {
          headerRow: [ 'Name', 'De Emcee Email'],
          footerRow: [ 'Name', 'De Emcee Email'],
          dataRows: []
        }

        users.forEach(user => {

          tempArray = [];
          tempArray.push(user.name);
          tempArray.push(user.email);

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

  getOneAdmin(id: string): Observable<Admin> {

    const url = environment.backendApi + 'admins/' + id.toString();
    return this.http.get<GetOneAdminDto>(url)
            .pipe(
              map(data => {
                delete data.id;
                delete data.name;
                return data;
              })
    );

  }

  createAdmin(admin: Admin) {
    const url = environment.backendApi + 'admins';
    return this.http.post(url, admin)
            .pipe(
              retry(3)
            )

  }

  updateAdmin(admin: Admin, id: string) {

    const url = environment.backendApi + 'admins/' + id;
    return this.http.put<Admin>(url, admin);


  }

  deleteAdmin(id: string) {

    const url = environment.backendApi + 'admins/' + id;
    return this.http.delete(url);

  }



  // Principals
  getAllPrincipals(branch_id: number): Observable<DataForDataTable> {
    // Fields Required: [name, email, phone]
    const url = environment.backendApi + 'principals?branch_id=' + branch_id;
    return this.http.get<PrincipalListItem[]>(url)
    .pipe(
      retry(3),
      take(1),
      map(users => {

        let tempArray;
        const data = users;
        const dataTable = {
          headerRow: [ 'Name', 'Email', 'Phone'],
          footerRow: [ 'Name', 'Email', 'Phone'],
          dataRows: []
        };

        users.forEach(user => {

          tempArray = [];
          tempArray.push(user.name);
          tempArray.push(user.email);
          tempArray.push(user.phone);

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

  getPrincipalForSelect(): Observable<PrincipalListItem[]> {
    const url = environment.backendApi + 'principals';
    return this.http.get<PrincipalListItem[]>(url);
  }

  getOnePrincipal(id: string) {

    const url = environment.backendApi + 'principals/' + id.toString();
    return this.http.get<GetOnePrincipalDto>(url)
            .pipe(
              map(data => {
                delete data.name;
                delete data.id;
                return data;
              })
            );

  }

  createPrincipal(principal: Principal) {
    const url = environment.backendApi + 'principals';
    return this.http.post(url, principal)
            .pipe(
              retry(3)
            )

  }

  updatePrincipal(principal: Principal, id: string) {
    const url = environment.backendApi + 'principals/' + id;
    return this.http.put<Principal>(url, principal);

  }

  treminatePrincipal(id: string) {

    const url = environment.backendApi + 'principals/' + id.toString() + '/terminate' ;
    return this.http.put(url, '');

  }



  // Manager
  getAllManagers(branch_id: number): Observable<DataForDataTable> {
    // Fields Required: [name, email, phone, branch, grade_id]
    // let headers = new HttpHeaders();
    // headers = headers.set('Branch-Id', '1');
    const url = environment.backendApi + 'managers?branch_id=' + branch_id;
    return this.http.get<ManagerListItem[]>(url)
    .pipe(
      retry(3),
      take(1),
      map(users => {

        let tempArray;
        const data = users;
        const dataTable = {
          headerRow: [ 'Name', 'Email', 'Phone', 'Branches', 'Status'],
          footerRow: [ 'Name', 'Email', 'Phone', 'Branches', 'Status'],
          dataRows: []
        }

        users.forEach(user => {
          tempArray = [];
          tempArray.push(user.name);
          tempArray.push(user.email);
          tempArray.push(user.phone);
          if (user.branches) {
            const branches =
            user.branches
            .map(b => b.name)
            .join()
            .replace(/,/g, ' <br> ')
            tempArray.push(branches);
            tempArray.push(user.branch?.grade?.name);
          }
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


  getOneManager(id: string): Observable<GetOneManagerDto> {

    const url = environment.backendApi + 'managers/' + id.toString();
    return this.http.get<GetOneManagerDto>(url)

  }

  createManager(manager: Manager) {
    const url = environment.backendApi + 'managers';
    return this.http.post(url, manager)
  }

  updateManager(manager: Manager, id: string) {
    console.log('update manager')
    const url = environment.backendApi + 'managers/' + id;
    return this.http.put(url, manager);

  }

  deleteManager(id: string) {

    const url = environment.backendApi + 'managers/' + id;
    return this.http.delete(url);

  }



  // Teacher
  getAllTeachers(branch_id: number): Observable<DataForDataTable> {
    // Fields Required: [name, email, phone, branch, grade_id]
    const url = environment.backendApi + 'teachers?branch_id=' + branch_id;
    return this.http.get<ManagerListItem[]>(url)
    .pipe(
      retry(3),
      take(1),
      map(users => {

        let tempArray;
        const data = users;
        const dataTable = {
          headerRow: [ 'Name', 'Email', 'Phone', 'Branches', 'Status'],
          footerRow: [ 'Name', 'Email', 'Phone', 'Branches', 'Status'],
          dataRows: []
        }

        users.forEach(user => {
          tempArray = [];
          tempArray.push(user.name);
          tempArray.push(user.email);
          tempArray.push(user.phone);
          if (user.branches) {
            const branches =
            user.branches
            .map(b => b.name)
            .join()
            .replace(/,/g, ' <br> ')
            tempArray.push(branches);
            tempArray.push(user.branch?.grade?.name);
          }

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

  getOneTeacher(id: string): Observable<GetOneManagerDto> {

    const url = environment.backendApi + 'teachers/' + id;
    return this.http.get<GetOneManagerDto>(url);

  }

  createTeacher(teacher: Teacher) {
    const url = environment.backendApi + 'teachers';
    return this.http.post(url, teacher)
            .pipe(
              retry(3)
            )

  }

  updateTeacher(teacher: Teacher, id: string) {
    const url = environment.backendApi + 'teachers/' + id;
    return this.http.put(url, teacher);

  }

  deleteTeacher(id: string) {

    const url = environment.backendApi + 'teachers/' + id;
    return this.http.delete(url);

  }


  // Parent
  getAllParents(branch_id: number = null, search: string = ''): Observable<DataForDataTable> {
    // Fields Required: [name, email, phone, spouse_name]
    const url = environment.backendApi + 'parents';
    const params = (new HttpParams())
      .append('branch_id', branch_id.toString())
      .append('search', search);

    return this.http.get<ParentListItem[]>(url, {params})
    .pipe(
      retry(3),
      take(1),
      map(users => {

        let tempArray;
        const data = users;
        const dataTable = {
          headerRow: [ 'Name', 'Email', 'Phone', 'Spouse Name'],
          footerRow: [ 'Name', 'Email', 'Phone', 'Spouse Name'],
          dataRows: []
        }

        users.forEach(user => {

          tempArray = [];
          tempArray.push(user.name);
          tempArray.push(user.email);
          tempArray.push(user.phone);
          tempArray.push(user.spouse_name);

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

  getOneParent(id: string): Observable<GetOneParentDto> {

    const url = environment.backendApi + 'parents/' + id.toString();
    return this.http.get<GetOneParentDto>(url)
            .pipe(
              map(data => {
                const temp: any = data;
                delete temp.id;
                if (temp.branch) {
                  temp.branch_id = temp.branch.id;
                  delete temp.branch;
                }
                delete temp.name;
                delete temp.address.id;
                // delete data.name;
                return temp;
              })
            );

  }

  createParent(parent: Parent) {
    const url = environment.backendApi + 'parents';
    return this.http.post(url, parent)
  }

  updateParent(parent: Parent, id: string) {
    const url = environment.backendApi + 'parents/' + id;
    return this.http.put(url, parent);

  }

  deleteParent(id: string) {

    const url = environment.backendApi + 'parents/' + id;
    return this.http.delete(url);
  }

  listParents(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'parents';
    return this.http.get<ParentListItem[]>(url)
    .pipe(
      map(parents => {
        return parents.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listManagers(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'managers';
    return this.http.get<ManagerListItem[]>(url)
    .pipe(
      map(managers => {
        return managers.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listTeachers(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'teachers';
    return this.http.get<ManagerListItem[]>(url)
    .pipe(
      map(teachers => {
        return teachers.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listPrincipals(): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'principals';
    return this.http.get<PrincipalListItem[]>(url)
    .pipe(
      map(principals => {
        return principals.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listParentMultipleBranch(branch_ids: number[]): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'parents/list';
    return this.http.post<ParentListItem[]>(url, {branch_ids})
    .pipe(
      map(parents => {
        return parents.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listManagerMultipleBranch(branch_ids: number[]): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'managers/list';
    return this.http.post<ParentListItem[]>(url, {branch_ids})
    .pipe(
      map(parents => {
        return parents.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listTeacherMultipleBranch(branch_ids: number[]): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'teachers/list';
    return this.http.post<ParentListItem[]>(url, {branch_ids})
    .pipe(
      map(parents => {
        return parents.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  listPrincipalMultipleBranch(branch_ids: number[]): Observable<DataForSelect[]> {
    const url = environment.backendApi + 'principals/list';
    return this.http.post<ParentListItem[]>(url, {branch_ids})
    .pipe(
      map(parents => {
        return parents.map(p => {
          const body: DataForSelect = {
            id: p.id,
            name: p.name
          }
          return body;
        })
      })
    )
  }

  getGradesList(userType: string): Observable<DataForSelect> {
    const url = environment.backendApi + 'grades/list?user_type=' + userType;
    return this.http.get<DataForSelect>(url);
  }

  getManagerByEmail(email: string): Observable<GetOneManagerDto> {
    const url = environment.backendApi + 'managers/find_by_email';
    return this.http.post<GetOneManagerDto>(url, {email});
  }

  getTeacherByEmail(email: string): Observable<GetOneManagerDto> {
    const url = environment.backendApi + 'teachers/find_by_email';
    return this.http.post<GetOneManagerDto>(url, {email});
  }

  getProfile() {
    const url = environment.backendApi + 'profile';
    return this.http.get<ProfileGetDto>(url);
  }

  putProfile(body: ProfilePutDto) {
    const url = environment.backendApi + 'profile';
    return this.http.put(url, body);
  }

  getParentsByEmail(email: string) {
    const url = environment.backendApi + 'parents/find_by_email';
      const params = new HttpParams()
          .set('email', String(email));
    return this.http.get<GetOneParentDto>(url, {params: params});
  }



}
