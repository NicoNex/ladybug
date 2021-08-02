import { Injectable } from '@angular/core';
import { BugData } from '../mocks/bugData';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { Bug } from '../Model/entities/Bug';
import { environment } from 'src/environments/environment';
import { Response } from 'src/app/model/entities/Response';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  constructor(private httpClient: HttpClient) { }

  getBugs(): Observable<Response> {
    if(environment.mock) {
      return new Observable((observer) => {
        const response: Response = new Response({ok: true, bugs: BugData.BUG_LIST});
        console.log(response);
        observer.next(response);
        observer.complete();
      });
    }
    const url: string = 'http://localhost:8080/get';

    return this.httpClient.get<Response>(url);
  }

  putBug(bug: Bug): Observable<any> {
    if(environment.mock) {
      return new Observable((observer) => {
        BugData.BUG_LIST.push(bug);
        const response: any = {
          'ok': true
        };
        observer.next(response);
        observer.complete();
      });
    }
    const url: string = `http://localhost:8080/put`;
    if(bug.id) {
      const url: string = `http://localhost:8080/put?id=${bug.id}`;
    }
    console.log(bug);
    return this.httpClient.put(url, JSON.stringify(bug), { headers: headers} );
  }

  deleteBug(bug: Bug): Observable<Response> {
    if (environment.mock) {
      return new Observable((observer) => {
        BugData.BUG_LIST.splice(BugData.BUG_LIST.indexOf(bug), 1);
        console.log(BugData.BUG_LIST);  
        const response: any = {
          'ok': true
        };
        observer.next(response);
        observer.complete();
      });
    }

    const url: string = `http://localhost:8080/del?id=${bug.id}`;
    return this.httpClient.get<Response>(url);
  }
}
