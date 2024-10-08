import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet, Router } from '@angular/router'
import { DialogModule, Dialog } from '@angular/cdk/dialog'
import { HttpClientModule } from '@angular/common/http'

import { UtilisateurService } from './services/utilisateur.service'
import { AuthService } from './services/auth.service'

import { MenuComponent } from './design-system/menu/menu.component'
import { LoginComponent } from './components/login/login.component'

export interface DialogData {
  Isinscription: boolean
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DialogModule,
    HttpClientModule,
    MenuComponent,
    LoginComponent
  ],
  providers: [UtilisateurService, AuthService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @Input() utilisateurConnecte: any
  title = 'collectio'
  IsOpen: boolean = false

  utilisateur: any
  UserConnecte: boolean = false

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService,
    public dialog: Dialog // private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkUserLoggedIn()
    // this.authService.user$.subscribe((user) => {
    //   this.utilisateur = user
    //   this.UserConnecte = !!user
    console.log('Hey !')
    // })
  }

  // NE PLUS VERIFIER PAR L'ID CAR PAR SECUR
  checkUserLoggedIn() {
    const userId = localStorage.getItem('storage_user_id')
    if (userId) {
      this.utilisateurService.getUtilisateurById(userId).subscribe((user) => {
        this.utilisateur = user
        this.UserConnecte = true
      })
    }
  }

  // handleUtilisateurConnecte(event: any) {
  //   this.utilisateur = event
  //   this.UserConnecte = true
  // }

  openPopupLog(Isinscription: boolean) {
    this.IsOpen = false
    const dialogRef = this.dialog.open<any>(LoginComponent, {
      data: {
        Isinscription: Isinscription
      }
    })

    dialogRef.closed.subscribe((response: any) => {
      console.log('On ferme')
      if (response) {
        console.log('resuuuult :', response)
        this.UserConnecte = true
        this.utilisateur = response
        this.checkUserLoggedIn()
      }
    })
  }
  navigateHomePage() {
    this.router.navigate(['/homePage'])
    this.IsOpen = false
  }

  navigateUserPage(id: string) {
    if (id) {
      this.router.navigate(['/utilisateur', id])
      this.IsOpen = false
    }
  }

  navigateUserPageFavoris(id: string) {
    if (id) {
      this.router.navigate(['/favoris/user', id])
      this.IsOpen = false
    }
  }

  navigateBackOffice() {
    this.router.navigate(['/backOffice'])
    this.IsOpen = false
  }

  logout() {
    // Clear the storage_user_id from localStorage
    localStorage.removeItem('storage_user_id')
    localStorage.removeItem('storage_token')
    this.utilisateur = null
    // Redirect to the login page or any other page
    this.router.navigate(['/'])
    this.IsOpen = false
    this.UserConnecte = false
  }
}
