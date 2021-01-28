import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  go(){
    this.router.navigate(['/login'])
  }

  another(){
    window.location.href = 'https://forcheck.herokuapp.com/'
  }

  about(){
    window.location.href = 'https://github.com/Aldeshov'
  }
}
