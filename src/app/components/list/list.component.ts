import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list.service';
import { Record } from '../../data/file';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  files: FileList;
  fileName: string;
  helpType: string;

  showUploadPopup: boolean;
  showScanPopup: boolean;

  sum: number;
  pageSize: number;
  currentCounts: number;
  records: Record[];

  iframeSrc: string;
  apiUrl: string;

  constructor(private listService: ListService) { }

  ngOnInit() {
    this.fileName = '';
    this.helpType = 'EmergencyPlan';
    this.showUploadPopup = false;
    this.showScanPopup = false;
    this.sum = 0;
    this.pageSize = 10;
    this.currentCounts = 0;
    this.iframeSrc = '';
    this.apiUrl = environment.baseUrl + '/helperfiles/download?id=';

    this.listService.getAllRecords().subscribe(res => {
      this.records = res['data'];
    });
  }

  onFilesChange(event: any): void {
    this.files = event.target.files;
  }

  upload(): void {
    console.log(this.files, this.fileName, this.helpType);
    this.listService.upload(this.files, this.fileName, this.helpType).subscribe(res => {
      console.log(res);
    }, err => {
      throw err;
    });
  }

  onFileNameChange(event: any): void {
    this.fileName = event.target.value;
  }

  onHelpTypeChange(event): void {
    this.helpType = event.target.value;
  }

  showPopupWindow(): void {
    this.showUploadPopup = true;
  }

  hideUploadPopup(): void {
    this.showUploadPopup = false;
  }

  showScanWindow(id: number): void {
    this.showScanPopup = true;
    this.iframeSrc = this.apiUrl + id;
  }

  hideScanWindow(): void {
    this.showScanPopup = false;
  }

  delete(id: number): void {
    this.listService.deleteRecord(id).subscribe(res => {
      alert('文件删除成功');
    }, err => {
      throw err;
    });
  }

}
