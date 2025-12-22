import { Component, inject, Signal, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router'; 
import { AuthService } from '../../../shared/services/auth.service'; 
import { AuthState } from '../../../shared/states/auth-state';
import { AuthDeconnexion, AuthConnexion } from '../../../shared/actions/auth-action';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [ReactiveFormsModule, CommonModule, RouterModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit { 
  
  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  connexion: Signal<boolean>;
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  infoMessage: string | null = null; 
  
  constructor() {
    this.connexion = toSignal(
      this.store.select(AuthState.isAuthenticated), 
      { initialValue: false }
    );
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifiant: ['', [Validators.required, Validators.maxLength(50)]],
      motDePasse: ['', [Validators.required]]
    });
    
    if (this.connexion()) {
      this.router.navigate(['/']); 
    }

    this.route.queryParams.subscribe(params => {
      if (params['message']) {
        this.infoMessage = params['message'];
      }
      if (params['error'] === 'auth_required') {
        this.errorMessage = "Vous devez être connecté pour accéder à cette page.";
      }
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.infoMessage = null;
    if (this.loginForm.invalid) return;

    const { identifiant, motDePasse } = this.loginForm.value;

    this.authService.login(identifiant, motDePasse).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.accessToken); 

        this.store.dispatch(new AuthConnexion({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user
        }));

        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Identifiant ou mot de passe incorrect.";
      }
    });
  }
  
  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(new AuthDeconnexion());
    this.router.navigate(['/login']); 
  }
}