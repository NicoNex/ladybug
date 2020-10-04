import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  issueForm: FormGroup;
  title: FormControl;
  author: FormControl;
  comment: FormControl;

  constructor() { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.issueForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required])
    });
  }

  test(): void {
    console.log(this.issueForm.value);
  }

}
