import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {

  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

}

