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
  // tags: Array<string> = new Array<string>();
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
    this.bugItems.forEach((item, index) => {if (item.toggle === true){ console.log(index);this.bugItems.splice(index, 1)}});
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
    console.log(this.bugItems);
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



  closeBug(): void {

  }

  

}
