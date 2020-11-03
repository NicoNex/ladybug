import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Bug } from 'src/app/Model/entities/Bug';
import { Comment } from 'src/app/Model/entities/Comment';
import { IssueService } from 'src/app/services/issue.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  issueForm: FormGroup;
  description: FormControl;
  author: FormControl;
  comment: FormControl;
  newBug: Bug;

  constructor(private issueService: IssueService, private router: Router) { }

  ngOnInit(): void {
    this.newBug = new Bug(
      {
          open: true,
          tags: new Array<string>(),
          date: Math.round(new Date().getTime() / 1000),
          comments: new Array<Comment>()
      }
    );
    this.initForm();
  }

  initForm(): void {
    this.issueForm = new FormGroup({
      description: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      comment: new FormControl('', [Validators.required]),
      tags: new FormArray([])
    });
  }

  get tags() {
    return this.issueForm.get('tags') as FormArray;
  }

  test(): void {
    
    console.log(this.issueForm.value);
  }

  toggle(checked: boolean, type: string): void { 
    if(checked){
      this.newBug.tags.push(type);
    } else if(this.newBug.tags.includes(type)) {
      this.newBug.tags.splice(this.newBug.tags.indexOf(type), 1);
    }
    console.log(this.newBug.tags);
    console.log(this.issueForm.valid);
  }

  save(): void {
    this.newBug.body = this.issueForm.get('description').value;

    this.newBug.comments.push(
      new Comment({
        author: this.issueForm.get('author').value,
        date: Math.round(new Date().getTime() / 1000),
        text: this.issueForm.get('comment').value
      }));

    console.log(this.newBug);
    this.issueService.putBug(this.newBug).subscribe(
      (response: any) => {
        console.log(response);
      }
    );
    this.router.navigate(['home/issue']);
  }

}
