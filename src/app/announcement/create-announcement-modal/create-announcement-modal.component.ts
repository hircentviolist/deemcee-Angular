import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {environment} from '../../../environments/environment';
import {Credentials} from '../../model/credentials';
import {DomSanitizer} from '@angular/platform-browser';
import {AnnouncementDto} from '../../model/announcement-dto';

@Component({
  selector: 'app-create-announcement-modal',
  templateUrl: './create-announcement-modal.component.html',
  styleUrls: ['./create-announcement-modal.component.css']
})
export class CreateAnnouncementModalComponent implements OnInit {
  @Input() data: {announcement: AnnouncementDto};
  announcementForm: FormGroup;
  mobileBannerUrl: any;
  desktopBannerUrl: any;
  mobileBanner: any;
  desktopBanner: any;
  fileUploaderURL = environment.backendApi + 'uploads';
  submitted = false;
  mode = 'create';
  types = [
    {
      name: 'Branch',
      key: 'branch',
    },
    {
      name: 'DeShop',
      key: 'deshop'
    },
  ];
  images = [
    {url: null, target: 'mobile_banner'},
    {url: null, target: 'desktop_banner'}
  ];
  uploaders = [
    {uploader: null, target: 'mobile_banner_url'},
    {uploader: null, target: 'desktop_banner_url'}
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private domSanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.initUploader();
  }

  initializeForm() {
    this.announcementForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      desktop_banner_url: new FormControl('', Validators.required),
      mobile_banner_url: new FormControl('', Validators.required),
      clickable_url: new FormControl(''),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });
    if (this.data?.announcement) {
      console.log('this.data.announcement: ', this.data.announcement);
      this.mode = 'edit';
      this.announcementForm.patchValue({
        title: this.data.announcement.title,
        description: this.data.announcement.description,
        desktop_banner_url: this.data.announcement.desktop_banner_url,
        mobile_banner_url: this.data.announcement.mobile_banner_url,
        clickable_url: this.data.announcement.clickable_url,
        start_date: this.convertToDatePickerFormat(this.data.announcement.start_date),
        end_date: this.convertToDatePickerFormat(this.data.announcement.end_date),
        type: this.data.announcement.type,
      });
      this.desktopBannerUrl = this.data.announcement.desktop_banner_url;
      this.mobileBannerUrl = this.data.announcement.mobile_banner_url;
    }
  }

  initUploader() {
    const cred = JSON.parse(localStorage.getItem('DeEmcee')) as Credentials;
    this.uploaders.forEach((val, i) => {
      val.uploader = new FileUploader({
        url: this.fileUploaderURL
      });
      if (cred) {
        val.uploader.authToken = `Bearer ${cred.access_token}`;
        val.uploader.onErrorItem =
          (item, response, status, headers) => this.onErrorItem(item, response, status, headers, val.target, i);
        val.uploader.onSuccessItem =
          (item, response, status, headers) => this.onSuccessItem(item, response, status, headers, val.target, i);
        val.uploader.onAfterAddingFile = file => this.onFileSelected(file, val.target, i);
      }
    });
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, target: string, index: number): any {
    const parsedResp = JSON.parse(response); // error server response
    console.log(item);
    console.log(parsedResp);
    console.log(status);
    console.log(target);
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders, target: string, index: number): any {
    // this gets triggered only once when first file is uploaded
    console.log('item: ', item);
    console.log('response: ', response);
    console.log('status: ', status);
    console.log('headers: ', headers);
    console.log('target: ', target);
    console.log('index: ', index);
    const parsedResp = JSON.parse(response);
    this.announcementForm.controls[target].setValue(parsedResp.file_path);

    this.images.forEach(img => {
      if (img.target === target) {
        img.url = parsedResp.file_path;
      }
    });

    switch (target) {
      case 'mobile_banner_url':
        this.mobileBannerUrl = parsedResp.file_path;
        break;
      case 'desktop_banner_url':
        this.desktopBannerUrl = parsedResp.file_path;
        break;
    }

    console.log('announcementForm: ', this.announcementForm);
    console.log('mobileBannerUrl: ', this.mobileBannerUrl);
    console.log('desktopBannerUrl: ', this.desktopBannerUrl);
  }

  onFileSelected(file, target: string, index: number) {
    const reader = new FileReader();
    if (file.file.size > 1999999) {
      // file too big, remove
      this.uploaders[index].uploader.removeFromQueue(this.uploaders[index].uploader.queue[0]);
      alert('File exceed maximum size, 2 MB');
      return;
    }
    reader.onloadend = e => {
      switch (target) {
        case 'mobile_banner_url':
          if (typeof reader.result === 'string') {
            this.mobileBanner = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
          }
          break;
        case 'desktop_banner_url':
          if (typeof reader.result === 'string') {
            this.desktopBanner = this.domSanitizer.bypassSecurityTrustUrl(reader.result);
          }
          break;
      }
    };
    if (file._file) {
      reader.readAsDataURL(file._file);
    }

    if (this.uploaders[index].uploader.queue.length > 1) {
      this.uploaders[index].uploader.removeFromQueue(this.uploaders[index].uploader.queue[0]);
    }

    this.uploaders[index].uploader.queue[0].withCredentials = false;
    this.uploaders[index].uploader.uploadAll();
  }

  removeImage(image) {
    if (image === 'desktop_banner') {
      if (this.uploaders[1].uploader.queue.length) {
        this.uploaders[1].uploader.removeFromQueue(this.uploaders[1].uploader.queue[0]);
        this.desktopBanner = null;
        this.announcementForm.controls['desktop_banner_url'].setValue('');
      } else {
        this.desktopBanner = null;
        this.desktopBannerUrl = null;
      }
    } else {
      if (this.uploaders[0].uploader.queue.length) {
        this.uploaders[0].uploader.removeFromQueue(this.uploaders[0].uploader.queue[0]);
        this.mobileBanner = null;
        this.announcementForm.controls['mobile_banner_url'].setValue('');
      } else {
        this.mobileBanner = null;
        this.mobileBannerUrl = null;
      }
    }
  }

  create() {
    console.log('announcementForm: ', this.announcementForm);
    if (this.announcementForm.valid) {
      const body = this.announcementForm.value;
      body.start_date = this.convertDatePickerFormatForSubmit(body.start_date);
      body.end_date = this.convertDatePickerFormatForSubmit(body.end_date);
      this.activeModal.close(body);
    } else {
      let errorMessage = '';
      Object.keys(this.announcementForm.controls).forEach(key => {
        if (this.announcementForm.controls[key].status === 'INVALID') {
          console.log(`${key} is invalid`);
          switch (key) {
            case 'title':
              errorMessage += 'Title is required.\n';
              break;
            case 'desktop_banner_url':
              errorMessage += 'Desktop Banner is required.\n';
              break;
            case 'mobile_banner_url':
              errorMessage += 'Mobile Banner is required.\n';
              break;
            case 'type':
              errorMessage += 'Type is required.\n';
              break;
          }
        }
      });
      alert(errorMessage);
    }
  }
  onTypeChange(type) {

  }

  convertToDatePickerFormat(date: string) {
    // Converts 2020-10-25 to {year: 2020, month: 10, day: 25} for datepicker use

    const dateArray = date.split('-');
    return {
      year: +dateArray[0],
      month: +dateArray[1],
      day: +dateArray[2],
    }
  }

  convertDatePickerFormatForSubmit(date: {year: number, month: number, day: number}) {
    // Converts {year: 2020, month: 10, day: 25} to 2020-10-25 for submit to server
    return date.year.toString() + '-' + ('0' + date.month.toString()).slice(-2) + '-' + ('0' + date.day.toString()).slice(-2);
  }
}
