import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ImageUploadResponse } from './model/image-upload-response';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }

  public uploadImage(filename: string, file: File) {
    const url = environment.backendApi + 'media';
    const upload = new FormData();
    upload.append('image', file, filename);
    return this.http.post<ImageUploadResponse>(url, upload);
  }

}
