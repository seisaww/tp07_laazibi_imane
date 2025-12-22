import { Pollution } from '../../app/models/pollution.model';

export class AddFavori {
  static readonly type = '[Favoris] Add';
  constructor(public payload: Pollution) {}
}

export class RemoveFavori {
  static readonly type = '[Favoris] Remove';
  constructor(public pollutionId: number) {} 
}

export class ClearFavoris {
  static readonly type = '[Favoris] Clear';
}