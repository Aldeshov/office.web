import {Component, OnInit} from '@angular/core';
import {User} from '../shared/models';
import {AuthenticationService, UserService} from '../shared/services';
import {NbMenuItem, NbMenuService} from '@nebular/theme';
import {takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {BaseComponent} from './base.component';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent extends BaseComponent implements OnInit {
  loading = true;
  user: User = null;
  menuExpanded = false;
  items: NbMenuItem[] = [
    {
      title: 'Office',
      expanded: true,
      icon: 'menu-2-outline',
      children: [
        {
          title: 'Home',
          icon: 'home-outline',
          link: '/office'
        },
        {
          title: 'Files',
          icon: 'folder-outline',
          link: '/office/files'
        },
        {
          title: 'Profile',
          icon: 'person-done-outline',
          link: '/office/information'
        },
        {
          title: 'Log out',
          icon: 'log-out-outline'
        }
      ]
    }
  ];

  constructor(
    private authenticate: AuthenticationService,
    private menuService: NbMenuService,
    private userService: UserService,
    private router: Router) {
    super();
  }

  logout() {
    this.authenticate.logout();
    this.router.navigate(['']).then(() => {
    });
  }

  ngOnInit() {
    this.userService.getUser().subscribe(response => {
      this.loading = false;
      this.user = response;
    });
    this.menuService.onItemClick()
      .pipe(takeUntil(this.destroyed))
      .subscribe((menuBag) => {
        menuBag.item.selected = true;
        if (menuBag.item.title == 'Log out') this.logout();
      });
  }

  onOutletLoaded(component) {
    component.user = this.user;
  }
}
