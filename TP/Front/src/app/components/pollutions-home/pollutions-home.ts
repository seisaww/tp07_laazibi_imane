import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-pollutions-home',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './pollutions-home.html',
  styleUrl: './pollutions-home.css'
})

export class PollutionsHome {

}
