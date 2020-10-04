import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.scss']
})
export class NewIssueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('we');
  }

}
