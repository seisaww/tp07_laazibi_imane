import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pollution } from '../../models/pollution.model';
import { PollutionFrom } from '../pollution-form/pollution-from';

@Component({
  selector: 'app-pollution-recap',
  standalone: true,          
  imports: [CommonModule],
  templateUrl: './pollution-recap.html',
  styleUrls: ['./pollution-recap.css']
})
export class PollutionRecap {
  @Input() pollution: Pollution | null = null;
}