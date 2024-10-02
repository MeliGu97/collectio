import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }

  private isLoggedIn(): boolean {
    return !!localStorage.getItem('storage_user_id')
  }
}
// -------------------------
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { UtilisateurService

//  } from './services/utilisateur.service';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private router: Router,
//     private utilisateurService: UtilisateurService
//   ) {}

//   canActivate(): boolean  {
//     const token = localStorage.getItem('token');
//     if (token) {
//       this.utilisateurService.verifyToken(token).subscribe(
//         (response) => {
//           if (response.success) {
//             return true;
//           } else {
//             this.router.navigate(['/login']);
//             return false;
//           }
//         },
//         (error) => {
//           this.router.navigate(['/login']);
//           return false;
//         }
//       );
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }

// --------------

// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { UtilisateurService } from './services/utilisateur.service';
// import { map } from 'rxjs';

// export const canActivateUser: CanActivateFn = (route, state) => {
//   const utilisateurService = inject(UtilisateurService);
//   const router = inject(Router);

//   return utilisateurService.getCurrentUtilisateur().pipe(
//     map((utilisateur) => {
//       if (utilisateur && utilisateur._id === route.params['id']) {
//         return true;
//       } else {
//         router.navigate(['/login']);
//         return false;
//       }
//     })
//   );
// };
