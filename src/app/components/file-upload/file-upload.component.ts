import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppFile } from '../../core/models/file.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  _file: AppFile;
  loading: boolean = false;

  @Input() browseLabel: string;
  @Input() files: AppFile[];
  @Input() fileHolder: any;
  @Input() onFileUpload: (file: AppFile, fileHolder: any) => string;
  @Output() onDeleteFile: EventEmitter<AppFile> = new EventEmitter();
  @Output() onOpenCamera: EventEmitter<boolean> = new EventEmitter();   
  @Output() fileChange: EventEmitter<AppFile> = new EventEmitter();    
  @Input() 
  get file(): AppFile {
      return this._file;
  }

  set file(value: AppFile) {
      this._file = value;
  }

  constructor(private http: HttpClient) { }

  fileLoad() {
      this.loading = false;
  }

  onFileChanged(event) {
      let fileList: FileList = event.dataTransfer ? event.dataTransfer.files : event.target.files;
      if (fileList && fileList.length > 0) {
          this.loading = true;
          let file: File = fileList[0];
          let formData: FormData = new FormData();
          formData.append('uploadFile', file, file.name);
          let headers = new Headers();
          /** No need to include Content-Type in Angular 4 */
          headers.append('Content-Type', 'multipart/form-data');
          headers.append('Accept', 'application/json');

          let reader = new FileReader();
          reader.onload = (e: any) => {
              var newFile: AppFile = {
                  src: e.target.result,
                  size: file.size,
                  name: file.name,
                  createdDate: new Date()
              };

              if (typeof this.file !== 'undefined') {
                  this._file = newFile;
                  this.fileChange.emit(this._file);
              }
              else {
                  this.onFileUpload(newFile, this.fileHolder);
              }
          }
          reader.readAsDataURL(file);
      }
  }

  open(file: AppFile) {
      // const modalRef = this.modalService.open(DeleteModal);
      // modalRef.componentInstance.title = file.name;

      // modalRef.result.then((result) => {
      //     if (result === 'Y') {
      //         this.deleteFile(file);
      //     }
      // }, (reason) => { });
  }

    deleteFile(file: AppFile) {
        this.onDeleteFile.emit(file);

        if (typeof this.file !== 'undefined') {
            this._file = null;
            this.fileChange.emit(this._file);
        }

        for (let i = 0; this.files && i < this.files.length; i++) {
            if (this.files[i].id === file.id) {
                this.files.splice(i, 1);
                break;
            }
        }
    }

    openCamera() {
        this.onOpenCamera.emit(true);
    }
}
