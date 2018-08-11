import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

@Injectable()
export class ListService {

  private apiUrl = '/helperfiles';

  constructor(private http: Http) { }

  upload(files: FileList, fileName: string, helpType: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileName', fileName);
    formData.append('helpType', helpType);
    formData.append('file', files[0]);
    return this.http.post('/api' + this.apiUrl, formData);
  }

  getAllRecords(): Observable<any> {
    return this.http.get('/api' + this.apiUrl);
  }

  getRecordById(id: number): Observable<any> {
    return this.http.get('/api' + this.apiUrl + '/download?id=' + id);
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete('/api' + this.apiUrl + '/' + id);
  }
}
