import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  public items = <any>[];

  constructor() {}

  ngOnInit(): void {
    this.items = [
      { label: 'Home',attributes: { title: 'Home' } },
      { label: 'Library' },
      { label: 'Data', url: '/dashboard/' },
      { label: 'CoreUI' }
    ];

    setTimeout(() => {
      this.items = [
        { label: 'CoreUI'},
        { label: 'Data' },
        { label: 'Library' },
        { label: 'Home', attributes: { title: 'Home' } }
      ];
    }, 5000);
  }
}
