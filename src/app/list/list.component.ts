import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/combineLatest';

import { IState, ICO, IEmployee, IMCU } from '../store/state';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  subscr1: Subscription;
  subscr2: Subscription;
  cos: Observable<ICO[]>;
  employees: Observable<IEmployee[]>;
  mcus: Observable<IMCU[]>;
  displayColumns = ['level', 'd_alph', 'd_anpa', 'd_hmcu', 'd_hco'];
  displayList = new MatTableDataSource();
  level(lv: string[], employees: IEmployee[], c: IEmployee) {
    if (c.anpa === '0') {
      return lv.length;
    }
    if (lv.includes(c.anpa)) {
      return -1;
    }
    const s = employees.find(e => e.an8 === c.anpa);
    if (s) {
      lv.push(c.anpa);
      return this.level(lv, employees, s);
    }
    return -1;
  }
  ngOnInit() {
    this.subscr1 = Observable
      .combineLatest(
      this.cos,
      this.employees,
      this.mcus,
      (cos, employees, mcus) => {
        return employees
          .map(e => {
            const level = [];
            const co = cos.find(c => c.co === e.hco);
            const sv = employees.find(s => s.an8 === e.anpa);
            const mcu = mcus.find(m => m.mcu === e.hmcu);
            return Object.assign(e, {
              d_alph: `${e.alph} (${e.an8})`,
              d_anpa: `${sv ? sv.alph : 'top'} (${e.anpa})`,
              d_hmcu: `${mcu ? mcu.title : 'n/a'} (${e.hmcu})`,
              d_hco: `${co ? co.title : 'n/a'} (${e.hco})`,
              level: this.level(level, employees, e)
            });
          });
      }).subscribe(employees => {
        this.displayList.data = employees;
      });
    this.displayList.sort = this.sort;
    this.subscr2 = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(() => {
        this.displayList.filter = this.filter.nativeElement.value;
      });
  }
  ngOnDestroy() {
    this.subscr1.unsubscribe();
    this.subscr2.unsubscribe();
  }
  constructor(
    public store: Store<IState>
  ) {
    this.cos = store.select<ICO[]>(s => s.app.cos);
    this.employees = store.select<IEmployee[]>(s => s.app.employees);
    this.mcus = store.select<IMCU[]>(s => s.app.mcus);
  }
}

