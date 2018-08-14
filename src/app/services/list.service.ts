import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ListService {

  private baseUrl = environment.baseUrl;
  private apiUrl = '/helperfiles';

  constructor(private http: Http) { }

  upload(files: FileList, fileName: string, helpType: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('name', fileName);
    formData.append('type', helpType);
    formData.append('file', files[0]);
    return this.http.post(this.baseUrl + this.apiUrl, formData);
  }

  getAllRecords(): Observable<any> {
    return this.http.get(this.baseUrl + this.apiUrl);
  }

  getRecordById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + 'file/store/' + id + '?type=download');
  }

  deleteRecord(id: number | string): Observable<any> {
    return this.http.delete(this.baseUrl + this.apiUrl + '/' + id);
  }
}
