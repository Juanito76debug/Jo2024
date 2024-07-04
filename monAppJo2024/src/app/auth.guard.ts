import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService, UserType } from './home/auth.service';
import { UserService } from './home/User.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn().pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          // Vérifiez si l'utilisateur a le bon type pour accéder à la route
          const requiredType: UserType = route.data['requiredType'];
          const currentUserType = this.authService.getUserType();
          if (requiredType && currentUserType !== requiredType) {
            // Redirige l'utilisateur vers une page d'erreur ou d'accueil si le type ne correspond pas
            this.router.navigate(['/unauthorized']);
            return false;
          }
          return true;
        } else {
          // Redirige l'utilisateur vers la page de connexion si non connecté
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(() => {
        // Gérer l'erreur si nécessaire
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
  
  private checkUserRole(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'];
    const userRole = this.userService.getUserRole(); // Méthode à implémenter dans UserService

    if (!expectedRoles.includes(userRole)) {
      this.router.navigate(['login']); // Redirige vers la page de connexion si l'utilisateur n'a pas le bon rôle
      return false;
    }
    return true;
  }
}