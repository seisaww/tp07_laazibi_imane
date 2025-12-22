import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router'; 
import { Utilisateur } from '../../models/utilisateur.model';
import { UserService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-inscription-list',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './inscription-list.html',
  styleUrl: './inscription-list.css'
})
export class InscriptionList implements OnInit {
  utilisateurs: Utilisateur[] = [];

  isLoading: boolean = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUtilisateur();
  }

  loadUtilisateur(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.isLoading = false; 
        },
        
      error: (error) => console.error('Erreur de chargement:', error)
    });
  }

}