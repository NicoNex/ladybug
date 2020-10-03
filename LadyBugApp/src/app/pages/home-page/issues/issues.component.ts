import { Component, OnInit } from '@angular/core';
import { Bug } from 'src/app/Model/entities/Bug';
import { Issue } from 'src/app/model/entities/Issue';
import { IssueData } from '../../../mocks/IssueData';
import { BugData } from '../../../mocks/bugData';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  bugs: Array<Bug> = BugData.BUG_LIST;
  constructor() { }

  delete(): void {
    this.bugs.splice(0,1);
  }

  add(): void {
    this.bugs.push(BugData.BUG_LIST[1]);
  }

  ngOnInit(): void {
  }

}
