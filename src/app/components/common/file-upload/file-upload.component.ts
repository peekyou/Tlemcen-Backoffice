import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppFile } from '../../../core/models/file.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
    _file: AppFile;
    loading: boolean = false;

    @Input() imageWidth = 125;
    @Input() imageHeight = 125;
    @Input() simple: boolean = false;
    @Input() enableCamera: boolean = true;
    @Input() acceptOnlyImages: boolean = false;
    @Input() centerImage: boolean = false;
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
        if (value && value.data) {
            this.createImageFromBlob(value.data);
        }
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
                    createdDate: new Date(),
                    mime: file.type
                };

                if (typeof this.file !== 'undefined') {
                    this._file = newFile;
                    // if (!this.isImageFile()) {
                        this.loading = false;
                    // }
                    this.fileChange.emit(this._file);
                }
                else {
                    this.onFileUpload(newFile, this.fileHolder);
                    this.loading = false;
                }
            }
            reader.readAsDataURL(file);
        }
    }

    delete(file: AppFile) {
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

    download(f: AppFile) {
        var fileName = f.name;
        if (!fileName && f.mime) {
            fileName = 'file.' + f.mime.split('/')[1];
        }
        saveAs(f.data || f.src, fileName);            
    }

    openCamera() {
        this.onOpenCamera.emit(true);
    }

    createImageFromBlob(image: Blob) {
        if (image && !this._file.src) {
            // Get the mime type
            var _this = this;
            var fileReader = new FileReader();
            fileReader.onload = function(event: any) {
                _this.setFileMimeType(event.target.result);
            };
            fileReader.readAsArrayBuffer(image);

            this._file.src = URL.createObjectURL(image);
        }
    }

    getMimetype(signature) {
        switch (signature) {
            case '89504E47':
                return 'image/png'
            case '47494638':
                return 'image/gif'
            case '25504446':
                return 'application/pdf'
            case 'FFD8FFDB':
            case 'FFD8FFE0':
            case 'FFD8FFE1':
                return 'image/jpeg'
            case '504B0304':
                return 'application/zip'
            default:
                return 'Unknown filetype'
        }
    }

    setFileMimeType(data) {
        const blob = data.slice(0, 4);
        const uint = new Uint8Array(blob);
        let bytes = [];
        uint.forEach((byte) => {
            bytes.push(byte.toString(16));
        })
        const hex = bytes.join('').toUpperCase();
        if (this._file) {
            this._file.mime = this.getMimetype(hex);
        }
    }

    isImageFile() {
        return this._file && this._file.mime && (
            this._file.mime.toLowerCase().indexOf('image') > -1 || 
            this._file.mime.toLowerCase().indexOf('jpg') > -1 ||
            this._file.mime.toLowerCase().indexOf('jpeg') > -1 ||
            this._file.mime.toLowerCase().indexOf('png') > -1 ||
            this._file.mime.toLowerCase().indexOf('gif') > -1);
    }

    isPdfFile() {
        return this._file && this._file.mime && this._file.mime.toLowerCase().indexOf('pdf') > -1;
    }
}
