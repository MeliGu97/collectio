import { Location } from '@angular/common'
import { Injectable } from '@angular/core'
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'
import { LoadingBarService } from '@ngx-loading-bar/core'

@Injectable()
export class RouterService {
  constructor(
    private router: Router,
    private loadingBarService: LoadingBarService,
    private location: Location
  ) {
    // S'abonner aux événements du routeur pour gérer la barre de chargement
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingBarService.useRef().start() // Démarre la barre de chargement
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingBarService.useRef().complete() // Termine la barre de chargement
      }
    })
  }

  /**
   * Redirige l'utilisateur via le routeur Angular.
   *
   * @param pathWithLocale chemin pour la redirection
   */
  public async spaRedirect(pathWithLocale: string): Promise<void> {
    await this.router.navigateByUrl(pathWithLocale) // Redirige vers le chemin spécifié
  }
}
