import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet, Router } from '@angular/router'
import { DialogModule, Dialog } from '@angular/cdk/dialog'
import { HttpClientModule } from '@angular/common/http'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'

import { UtilisateurService } from './services/utilisateur.service'

import { MenuComponent } from './design-system/menu/menu.component'
import { LoginComponent } from './components/login/login.component'

import { RouterService } from './services/router.service'
import { LoadingBarComponent, LoadingBarModule } from '@ngx-loading-bar/core'

export interface DialogData {
  IsInscription: boolean
  IsLog: boolean
  UserId: string
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
    LoginComponent,
    SweetAlert2Module,
    LoadingBarModule
  ],
  providers: [UtilisateurService, RouterService],
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
    public dialog: Dialog,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    this.checkUserLoggedIn()

    if (this.utilisateurConnecte === undefined) {
    } else {
      this.utilisateurConnecte.subscribe((utilisateur: any) => {
        this.utilisateur = utilisateur
        this.UserConnecte = true
      })
    }
  }

  showAlert() {
    Swal.fire({
      title: 'Un icon personnalisé',
      text: 'Bientôt un icon à choisir pour vos collections',
      icon: 'info',
      confirmButtonText: 'Super',
      customClass: {
        title: 'titre-popup',
        icon: 'picto-popup',
        confirmButton: 'btn-primary btn-small text-btn-popup'
      },
      buttonsStyling: false,
      timer: 2000, // Close the popup after 2 seconds (2000 milliseconds)
      timerProgressBar: true, // Show a progress bar indicating the time remaining
      didOpen: (toast) => {
        // arrete le chargement si l'utilisateur survol la popup
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
  }

  // NE PLUS VERIFIER PAR L'ID CAR PAs SECUR
  checkUserLoggedIn() {
    const userId = localStorage.getItem('storage_user_id')
    if (userId) {
      this.utilisateurService.getUtilisateurById(userId).subscribe((user) => {
        this.utilisateur = user
        this.UserConnecte = true
      })
    }
    this.getCurrentUtilisateurId()
  }
  getCurrentUtilisateurId() {
    const token = localStorage.getItem('storage_token')
    if (token) {
      this.utilisateurService.getCurrentUtilisateurSecur().subscribe(
        (utilisateurId: any) => {
          // console.log("ID de l'utilisateur connecté:", utilisateurId._id)
        },
        (error: any) => {
          console.error(
            "Erreur lors de la récupération de l'ID de l'utilisateur connecté:",
            error
          )
        }
      )
    }
  }

  openPopupLog(IsInscription: boolean, IsLog: boolean) {
    this.IsOpen = false
    const dialogRef = this.dialog.open<any>(LoginComponent, {
      data: {
        IsInscription: IsInscription,
        IsLog: IsLog
      }
    })
    dialogRef.closed.subscribe((response: any) => {
      // console.log('On ferme')
      if (response) {
        // console.log('resuuuult :', response)
        this.UserConnecte = true
        this.utilisateur = response
        this.checkUserLoggedIn()
      }
    })
  }

  openPopupInfo(IsUpdateInfo: boolean, IsLog: boolean, userId: string) {
    console.log('userId:', userId)
    this.IsOpen = false
    const dialogRef = this.dialog.open<any>(LoginComponent, {
      data: {
        IsUpdateInfo: IsUpdateInfo,
        IsLog: IsLog,
        userId: userId
      }
    })
    console.log('IsUpdateInfo:', IsUpdateInfo, 'IsLog:', IsLog)
    dialogRef.closed.subscribe((response: any) => {
      // console.log('On ferme')
      if (response) {
        console.log('On ferme')
        // Il faut recharger les info utili
        this.utilisateur = response
        this.checkUserLoggedIn()
      }
    })
  }

  // NAVIGATION
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
