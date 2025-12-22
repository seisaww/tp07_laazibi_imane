import { Routes } from '@angular/router';
import { PollutionList } from './components/pollution-list/pollution-list'; 
import { PollutionDetail } from './components/pollution-detail/pollution-detail';
import { PollutionsHome } from './components/pollutions-home/pollutions-home'; 
import { Inscription } from './components/inscription/inscription';
import { InscriptionList } from './components/inscription-list/inscription-list'; 
import { Login } from './components/login/login';
import { authGuard, guestGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  { 
    path: '', 
    component: PollutionsHome
  },
  
  { 
    path: 'pollutions/liste', 
    loadComponent: () => import('./components/pollution-list/pollution-list').then(c => c.PollutionList)
  },

  { 
    path: 'pollutions/formulaire', 
    loadComponent: () => import('./components/pollution-form/pollution-from').then(c => c.PollutionFrom),
    canActivate: [authGuard]
  }, 

  { 
    path: 'pollutions/detail/:id',
    loadComponent: () => import('./components/pollution-detail/pollution-detail').then(c => c.PollutionDetail)
  },

  { 
    path: 'favoris',
    loadComponent: () => import('./components/favoris/favoris').then(c => c.Favoris),
    canActivate: [authGuard],
  },

  { 
    path: 'inscription',
    loadComponent: () => import('./components/inscription/inscription').then(c => c.Inscription),
    canActivate: [guestGuard],
  },

  { 
    path: 'inscription-list',
    loadComponent: () => import('./components/inscription-list/inscription-list').then(c => c.InscriptionList),
    canActivate: [authGuard],
  }, 

  { 
    path: 'login',
    loadComponent: () => import('./components/login/login').then(c => c.Login),
    canActivate: [guestGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }
];