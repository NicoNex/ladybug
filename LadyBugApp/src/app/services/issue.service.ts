import { Injectable } from '@angular/core';
import { BugData } from '../mocks/bugData';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bug } from '../Model/entities/Bug';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private httpClient: HttpClient) { }

  getBugs(): Observable<Bug[]> {
    if(environment.mock) {
      return new Observable((observer) => {
        const response: Bug[] = BugData.BUG_LIST;
        observer.next(response);
        observer.complete();
      });
    }
  }
}
