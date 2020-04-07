import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

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

  logout() {
    document.cookie='userPassword=;expires=Thu; 01 Jan 1970; path=/'; 
    location.reload()
  }

  files() {
    this.router.navigate(['/student-files']);
  }

  search() {
    alert("This option not finished yet!")
  }

  mainmenu(){
    this.router.navigate(['/welcome']);
  }

  //Temp
  alert(str){
    alert(str);
  }
}
