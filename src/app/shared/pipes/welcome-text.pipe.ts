import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'welcomeText'
})
export class WelcomeTextPipe implements PipeTransform {
  hour = new Date().getHours();
  title: String = 'Welcome';

  transform(value: string, ...args: unknown[]): unknown {
    if (this.hour >= 0 && this.hour <= 4) this.title = 'Good night';
    if (this.hour >= 5 && this.hour <= 11) this.title = 'Good morning';
    if (this.hour >= 12 && this.hour <= 17) this.title = 'Good afternoon';
    if (this.hour >= 18 && this.hour <= 22) this.title = 'Good evening';
    if (this.hour >= 23) this.title = 'Good night';
    return this.title + ', ' + value;
  }
}
