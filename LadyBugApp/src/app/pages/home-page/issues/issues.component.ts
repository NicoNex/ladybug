import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  fruits = ['mango', 'banana', 'percoca','mango', 'banana', 'percoca','mango', 'banana', 'percoca','mango', 'banana', 'percoca'];
  constructor() { }

  ngOnInit(): void {
  }

}
