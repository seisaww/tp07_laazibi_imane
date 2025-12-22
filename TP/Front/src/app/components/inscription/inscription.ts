import { Component, inject } from '@angular/core'; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { UserService } from '../../services/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class Inscription {
  
  private userService = inject(UserService);
  private router = inject(Router);

  formulaire = new FormGroup({
    id: new FormControl<number | null>(null), 
    nom: new FormControl('', Validators.required),
    prenom: new FormControl ('', Validators.required),
    identifiant: new FormControl('', Validators.required),
    motDePasse: new FormControl('', [ 
      Validators.required, 
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}$")
    ]) 
  });

  errorMessage: string | null = null; 

  get motDePasse() {
    return this.formulaire.get('motDePasse');
  }

  send() {
      this.errorMessage = null;

      if (this.formulaire.valid){
        const formValue = this.formulaire.value;
        
        const utilisateur: Utilisateur = {
            id: formValue.id || 0, 
            nom: formValue.nom!,
            prenom: formValue.prenom!,
            identifiant: formValue.identifiant!,
            motDePasse: formValue.motDePasse!
        };

        this.userService.createUser(utilisateur).subscribe({
            next: (resultat: Utilisateur) => { 
                this.router.navigate(['/login'], { 
                  queryParams: { message: 'Compte créé avec succès ! Veuillez vous connecter.' } 
                });
            },
            error: (error: any) => { 
                console.error('Erreur:', error);
                this.errorMessage = "Erreur lors de l'enregistrement. L'identifiant existe peut-être déjà.";
            }
        });
      } else {
        this.errorMessage = "Veuillez remplir correctement tous les champs.";
      }
    }
}