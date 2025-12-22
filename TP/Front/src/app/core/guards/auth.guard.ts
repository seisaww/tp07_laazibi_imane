import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../shared/states/auth-state';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const isAuth = store.selectSnapshot(AuthState.isAuthenticated);

  if (isAuth) return true;
  
  router.navigate(['/login'], { 
    queryParams: { message: 'Vous devez être connecté pour accéder à cette page.' } 
  });
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const isAuth = store.selectSnapshot(AuthState.isAuthenticated);

  if (!isAuth) return true;

  router.navigate(['/']); 
  return false;
};