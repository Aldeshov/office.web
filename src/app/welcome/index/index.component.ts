import {Component, OnInit} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  items: NbMenuItem[] = [
    {
      title: 'Login',
      icon: 'log-in-outline',
      link: '/welcome/login'
    },
    {
      title: 'Source',
      icon: 'github-outline',
      url: 'https://github.com/Aldeshov/office.web'
    },
    {
      title: 'About',
      icon: 'person-outline',
      url: 'https://github.com/Aldeshov'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
