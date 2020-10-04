import { Component, OnInit } from '@angular/core';
import { Bug } from 'src/app/Model/entities/Bug';
import { BugData } from '../../../mocks/bugData';
import { NbMenuService } from '@nebular/theme';
import { map, filter } from 'rxjs/operators';
import { IssueService } from 'src/app/services/issue.service';
import { Router } from '@angular/router';

interface IssueCheckBox {
  bug: Bug;
  toggle: boolean;
}

enum Status {
  OPEN = 'Open',
  CLOSE = 'Close'
}

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  bugs: Array<Bug> = BugData.BUG_LIST;
  bugItems: Array<IssueCheckBox> = new Array<IssueCheckBox>();
  // tags: Array<string> = new Array<string>();
  items = [{ title: 'Open' }, { title: 'Close' }];
  checked = false;

  constructor(private issueService: IssueService, private nbMenuService: NbMenuService, private router: Router) { }

  ngOnInit(): void {
    this.init();
    this.menuService();
  }

  private init(): void {
    this.issueService.getBugs().subscribe(
      (bugs: Bug[]) => {
        this.bugItems = this.bugToIssueCheckBox(bugs);
      }
    );
    console.log(this.bugItems)
  }

  menuService(): void {
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'choose-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        switch (title) {
          case Status.OPEN:
            this.bugItems.forEach((item) => {if(item.toggle === true) {item.bug.open = true }});
            break;
          case Status.CLOSE:
            this.bugItems.forEach((item) => {if(item.toggle === true) {item.bug.open = false }});
            break;
        }
        console.log(`${title} was clicked!`);
      });
  }



  trackByFn(index: number, item: any) {
    return item.id; 
 }

  private bugToIssueCheckBox(bugs: Bug[]): IssueCheckBox[] {
    const myNewBugs: IssueCheckBox[] = [];
    bugs.forEach((bug) => {
      const issue: IssueCheckBox = {
        bug: new Bug(bug),
        toggle: false
      }
      myNewBugs.push(issue)
    });
    return myNewBugs;
  }

  newIssue(): void {
    this.router.navigate(['home/new']);
  }

  delete(): void {
    this.bugItems = this.bugItems.filter((item) => item.toggle !== true);
    console.log(this.bugItems);
  }

  add(): void {
    let newbug: IssueCheckBox = {
      bug: BugData.BUG_LIST[0],
      toggle: false
    }
    newbug.bug.open = true;
    this.bugItems.push(newbug);
  }

  toggle(checked: boolean, index: number): void { 
    this.bugItems[index].toggle = checked;
    console.log('CHECKED', this.bugItems[index].toggle, "INDEX", index);
  }

  showButtons(): boolean {
    return this.bugItems.some(item => item.toggle === true);
  }

  setTagStatus(tag: string): string {
    switch(tag){
      case 'front-end':
        return 'primary';
      case 'back-end':
        return 'success';
      case 'angular':
        return 'info';
      case 'cazzi-magici':
        return 'warning';
    }
  }

}
