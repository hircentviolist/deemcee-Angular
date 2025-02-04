import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  title$ = new BehaviorSubject<string>(null);

  constructor() { }

  postTitle(title: string) {
    this.title$.next(title);
  }
}
