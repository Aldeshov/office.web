import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Input } from '@angular/core';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() name = "Unknown";

  constructor(private router: Router, private authenticate: AuthenticationService) { }

  ngOnInit(): void { }

  modify(){
    if(document.getElementById('menu').classList.contains('hidden'))
    {
      document.getElementById('menu').classList.remove('hidden');
      document.getElementById('x1').classList.remove('before1');
      document.getElementById('x').classList.remove('before');
      document.getElementById('x2').classList.remove('before2');
      document.getElementById('x1').classList.add('after1');
      document.getElementById('x').classList.add('after');
      document.getElementById('x2').classList.add('after2');
    }
    else
    {
      document.getElementById('menu').classList.add('hidden');
      document.getElementById('x1').classList.remove('after1');
      document.getElementById('x').classList.remove('after');
      document.getElementById('x2').classList.remove('after2');
      document.getElementById('x1').classList.add('before1');
      document.getElementById('x').classList.add('before');
      document.getElementById('x2').classList.add('before2');
    }
  }

  logout(){
    this.authenticate.logout();
    this.router.navigate(['']);
  }

  files() {
    this.router.navigate(['/student-files/0/%2F']);
  }

  mainmenu(){
    this.router.navigate(['/welcome']);
  }

  information(){
    this.router.navigate(['/info']);
  }
  
  //Temp
  alert(str){
    alert(str);
  }
}
