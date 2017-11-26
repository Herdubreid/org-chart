import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as D3 from 'd3';

import { IState, IEmployee } from '../store/state';
import { BaseType } from 'd3';

interface Node extends D3.HierarchyNode<IEmployee> {
  x?: number;
  y?: number;
  x0?: number;
  y0?: number;
  _children?: Node[];
}

@Component({
  selector: 'app-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  employees: Observable<IEmployee[]>;
  subscr: Subscription;
  margin = {
    top: 20,
    right: 120,
    bottom: 120,
    left: 120
  };
  i = 0;
  root: Node;
  start: Node;
  svg: any;
  collapse(n: Node) {
    if (n.children) {
      n._children = n.children;
      n.children = null;
    }
  }
  collapseAll(n: Node, except: Node = null) {
    if (n !== except) { this.collapse(n); }
    if (n._children) {
      n._children.forEach(d => this.collapseAll(d, except));
    }
  }
  expand(n: Node) {
    if (n._children) {
      n.children = n._children;
      n._children = null;
    }
  }
  expandAll(n: Node, except: Node = null) {
    if (n !== except) { this.expand(n); }
    if (n.children) {
      n.children.forEach(d => this.expandAll(d, except));
    }
  }
  link(n) {
    const c = (n.source.y + n.target.y) / 2;
    return `M${n.source.y},${n.source.x}C${c},${n.source.x} ${c},${n.target.x} ${n.target.y},${n.target.x}`;
  }
  update(update: Node) {
    // Transition
    const trans = D3.transition('')
      .duration(700);
    // Compute the new tree layout
    const height = this.start.leaves().length * 24;
    const width = (Math.max(...this.start.leaves().map(l => l.depth)) - this.start.depth) * 180;
    const nodes = D3.tree().size([height, width])(this.start);
    // Normalise for fixed-depth
    nodes.descendants().forEach(d => d.y = (d.depth - this.start.depth) * 160);
    // Update the nodes
    const node = this.svg.selectAll('g.node')
      .data(nodes.descendants(), d => d.id || (d.id = this.i++));
    // Enter any new nodes at the parent's previous position
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${update.y0},${update.x0})`);
    // Circle
    nodeEnter
      .merge(node)
      .transition(trans)
      .attr('transform', d => `translate(${d.y},${d.x})`);
    nodeEnter.append('circle')
      .attr('r', 1e-6)
      .style('fill', d => d._children ? 'lightsteelblue' : '#fff')
      .on('click', d => {
        d.children ? this.collapse(d) : this.expand(d);
        this.update(d);
      })
      .transition(trans)
      .attr('r', 4.5);
    node.select('circle')
      .style('fill', d => d._children ? 'lightsteelblue' : '#fff');
    // Text
    nodeEnter.append('text')
      .attr('x', d => d.children || d._children ? -10 : 10)
      .attr('dy', '.35em')
      .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
      .text(d => d.data.alph)
      .style('fill-opacity', 1e-6)
      .on('click', d => {
        if (d.id === this.root.id) {
          d._children ? this.expandAll(this.root) : this.collapseAll(this.root);
        } else {
          if (d.id === this.start.id) {
            this.collapseAll(d.parent, d);
            this.expand(d.parent);
            this.start = this.start.parent;
          } else {
            this.expandAll(d);
            this.start = d;
          }
        }
        this.update(d);
      })
      .transition(trans)
      .style('fill-opacity', 1);
    // Transition exiting nodes to the parent's new position
    const nodeExit = node.exit().transition(trans)
      .attr('transform', d => `translate(${update.y},${update.x})`)
      .remove();
    nodeExit.select('circle')
      .attr('r', 1e-6);
    nodeExit.select('text')
      .attr('fill-opacity', 1e-6);

    // Update the links
    const link = this.svg.selectAll('path.link')
      .data(nodes.links(), d => d.target.id);
    // Enter new links at parent's previous position
    link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        const o = { x: update.x0, y: update.y0 };
        return this.link({ source: o, target: o });
      })
      .transition(trans)
      .attr('d', this.link);
    // Transition links to their new position
    link.transition(trans)
      .attr('d', this.link);
    // Transition exiting nodes to the parent's new position
    link.exit().transition(trans)
      .attr('d', d => {
        const o = { x: update.x, y: update.y };
        return this.link({ source: o, target: o });
      })
      .remove();

    D3.select('svg.org-chart')
      .transition(trans)
      .attr('width', width + this.margin.right + this.margin.left)
      .attr('height', height + this.margin.top + this.margin.bottom);

    // Stash the old position for transtion
    nodes.descendants().forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
  ngOnInit() {
    this.subscr = this.employees
      .filter(employees => employees.length > 0)
      .subscribe(employees => {
        this.root = D3.stratify<IEmployee>()
          .id(d => d.an8)
          .parentId(d => d.anpa === '0' ? '' : d.anpa)
          (employees)
          .sort((a, b) => a.descendants().length - b.descendants().length);
        const height = this.root.leaves().length * 24;
        const width = (Math.max(...this.root.leaves().map(l => l.depth)) - this.root.depth) * 180;
        this.root.x0 = height / 2;
        this.root.y0 = 0;
        this.svg = D3.select('svg.org-chart')
          .attr('width', width + this.margin.right + this.margin.left)
          .attr('height', height + this.margin.top + this.margin.bottom)
          .attr('overflow', 'auto')
          .append('g')
          .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
        this.start = this.root;
        this.collapseAll(this.root);
        this.update(this.start);
      });
  }
  ngOnDestroy() {
    this.subscr.unsubscribe();
  }
  constructor(
    public store: Store<IState>
  ) {
    this.employees = store.select<IEmployee[]>(s => s.app.employees);
  }
}
