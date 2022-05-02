import {Component, Input} from '@angular/core';
import {User} from '../../shared/models';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  @Input() user: User;
}
