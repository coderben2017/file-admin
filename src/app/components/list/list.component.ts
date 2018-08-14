import { Component, OnInit } from '@angular/core';
import { ListService } from '../../services/list.service';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // 文件上传&下载表单项
  files: FileList;
  fileName: string;
  helpType: string;

  // 弹窗显示&隐藏控制变量
  showUploadPopup: boolean;
  showScanPopup: boolean;

  // 接收的文件列表
  sum: number;
  pageSize: number;
  currentCounts: number;
  records: any[];

  // iframe中文档路径
  iframeSrc: SafeUrl;
  apiUrl: string;
  downloadSrc: string;

  // 选中的记录的id数组，用于批量删除
  selectedRecordIds: number[];

  constructor(
    private listService: ListService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.fileName = '';
    this.helpType = 'EmergencyPlan';
    this.showUploadPopup = false;
    this.showScanPopup = false;
    this.sum = 0;
    this.pageSize = 10;
    this.currentCounts = 0;
    this.iframeSrc = '';
    this.downloadSrc = '';
    this.apiUrl = environment.baseUrl + '/helperfiles/download?id=';
    this.selectedRecordIds = [];
    this.records = [];

    this.listService.getAllRecords().subscribe(res => {
        JSON.parse(res['_body']).forEach(item => {
          const obj: any = new Object();
          const origin: any = item['fileStoreList'][0];
          obj['id'] = item.id;
          obj['downloadId'] = origin.id;
          obj['fileName'] = item.name;
          obj['filePath'] = origin.filePath;
          obj['fileType'] = origin.fileType;
          obj['fileSize'] = origin.fileSize;
          obj['clickCount'] = origin.clickCount;
          obj['downloadCount'] = origin.downloadCount;
          obj['uploadTime'] = origin.uploadTime;
          this.records.push(obj);
        });
        this.sum = this.records.length;
        this.currentCounts = this.sum % this.pageSize;
      }, err => {
        console.log(err);
      });
  }

  onFilesChange(event: any): void {
    this.files = event.target.files;
  }

  upload(): void {
    this.listService.upload(this.files, this.fileName, this.helpType).subscribe(res => {
      this.showUploadPopup = false;
      alert('上传成功');
      // window.location.reload();
    }, err => {
      console.log(err);
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
    this.iframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(
      environment.baseUrl + '/file/store/' + id + '?type='
    );
    this.downloadSrc = environment.baseUrl + '/file/store/' + id + '?type=download';
  }

  hideScanWindow(): void {
    this.showScanPopup = false;
  }

  addSelectedRecord(event: any, id: number): void {
    if (event.target.checked) {
      this.selectedRecordIds.push(id);
    } else {
      const index: number = this.selectedRecordIds.indexOf(id);
      this.selectedRecordIds.splice(index, 1);
    }
  }

  delete(id: number): void {
    if (!id) {
      const idStr: string = this.selectedRecordIds.join(',');
      this.listService.deleteRecord(idStr).subscribe(res => {
        alert('文件删除成功');
        window.location.reload();
      });
    } else {
      this.listService.deleteRecord(id).subscribe(res => {
        alert('文件删除成功');
        window.location.reload();
      }, err => {
        throw err;
      });
    }
  }

}
