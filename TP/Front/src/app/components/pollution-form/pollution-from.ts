import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';
import { CommonModule } from '@angular/common';
import { PollutionRecap } from '../pollution-recap/pollution-recap';

@Component({
  selector: 'app-pollution-from',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PollutionRecap],
  templateUrl: './pollution-from.html',
  styleUrl: './pollution-from.css'
})
export class PollutionFrom implements OnChanges {
  
  @Input() pollutionAEditer: Pollution | null = null; 

  formulaire = new FormGroup({
    id: new FormControl<number | null>(null), 
    titre: new FormControl('', Validators.required),
    type_pollution: new FormControl ('', Validators.required),
    description: new FormControl('', Validators.required),
    date_observation: new FormControl('', Validators.required),
    lieu: new FormControl('', Validators.required),
    latitude: new FormControl('', [Validators.required, Validators.pattern("^-?\\d+(\\.\\d+)?$")]),
    longitude: new FormControl('', [Validators.required, Validators.pattern("^-?\\d+(\\.\\d+)?$")]),
    photo_url: new FormControl('')
  });

  @Output() pollutionDeclaree = new EventEmitter<Pollution>(); 
  @Output() annulerModification = new EventEmitter<void>();

  constructor(private pollutionService: PollutionService) {} 
  
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['pollutionAEditer'] && this.pollutionAEditer) {
        
        const dateFormatee = this.formatDatePourInput(this.pollutionAEditer.date_observation);

        this.formulaire.patchValue({
          id: this.pollutionAEditer.id,
          titre: this.pollutionAEditer.titre,
          type_pollution: this.pollutionAEditer.type_pollution,
          description: this.pollutionAEditer.description,
          date_observation: dateFormatee, 
          lieu: this.pollutionAEditer.lieu,
          latitude: this.pollutionAEditer.latitude.toString(), 
          longitude: this.pollutionAEditer.longitude.toString(), 
          photo_url: this.pollutionAEditer.photo_url || ''
        });
      
      } else if (changes['pollutionAEditer'] && !this.pollutionAEditer) {
          this.formulaire.reset({ id: null, type_pollution: '' });
      }
  }

  private formatDatePourInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0]; 
  }

  pollutionPourRecap: Pollution | null = null;

  send() {
    if (this.formulaire.valid) {
      
      const formValue = this.formulaire.value;
      const id = formValue.id; 

      const pollution: Pollution = {
          id: id || 0, 
          titre: formValue.titre!,
          type_pollution: formValue.type_pollution!,
          description: formValue.description!,
          date_observation: formValue.date_observation!,
          lieu: formValue.lieu!,
          latitude: Number(formValue.latitude!),
          longitude: Number(formValue.longitude!),
          photo_url: formValue.photo_url || undefined,
      };

      const obs$ = id 
        ? this.pollutionService.updatePollution(id, pollution) 
        : this.pollutionService.createPollution(pollution);      

      obs$.subscribe({
        next: (resultat: any) => {
          
          let pollutionFinale: Pollution;

          if (id) {
             pollutionFinale = pollution;
          } else {
             const resData = resultat.pollution || resultat;
             pollutionFinale = { ...pollution, ...resData };
          }
          
          this.pollutionDeclaree.emit(pollutionFinale); 
          
          this.pollutionPourRecap = pollutionFinale;
          
          this.formulaire.reset({ id: null, type_pollution: '' });
        },
        error: (error: any) => { 
          console.error('Erreur de sauvegarde:', error);
        }
      });
    }
  }
  
  annuler() {
      this.formulaire.reset({ id: null, type_pollution: '' });
      this.annulerModification.emit();
  }
}