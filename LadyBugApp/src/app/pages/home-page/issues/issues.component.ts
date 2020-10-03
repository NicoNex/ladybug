import { Component, OnInit } from '@angular/core';
import { Bug } from 'src/app/Model/entities/Bug';
import { Issue } from 'src/app/model/entities/Issue';
import { IssueData } from '../../../mocks/IssueData';
import { BugData } from '../../../mocks/bugData';
import { NbMenuService } from '@nebular/theme';
import { map, filter } from 'rxjs/operators';

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
  items = [{ title: 'Open' }, { title: 'Close' }];
  checked = false;

  constructor(private nbMenuService: NbMenuService) { }

  ngOnInit(): void {
    this.init();
    this.menuService();
  }

  private init(): void {
    this.bugs.forEach((b) => {
      const issue: IssueCheckBox = {
        bug: new Bug(b),
        toggle: false
      }
      this.bugItems.push(issue);
    });
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

  delete(): void {
    this.bugs.splice(0,1);
  }

  add(): void {
    this.bugs.push(BugData.BUG_LIST[1]);
  }

  toggle(checked: boolean, index: number) { 
    this.bugItems[index].toggle = checked;
    console.log('CHECKED', this.bugItems[index].toggle, "INDEX", index);
  }

  

  closeBug(): void {

  }

  

}
