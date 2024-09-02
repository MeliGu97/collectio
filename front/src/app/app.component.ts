import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet, Router } from '@angular/router'
import { DialogModule } from '@angular/cdk/dialog'

import { MenuComponent } from './design-system/menu/menu.component'
import { UtilisateurService } from './services/utilisateur.service'
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DialogModule,
    HttpClientModule,
    MenuComponent
  ],
  providers: [UtilisateurService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'collectio'
  utilisateur: any
  IsOpen: boolean = false

  constructor(
    private router: Router,
    private utilisateurService: UtilisateurService // Inject the UtilisateurService
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in and retrieve the user data
    const userId = localStorage.getItem('storage_user_id')
    console.log(userId)
    if (userId) {
      this.utilisateurService.getUtilisateurById(userId).subscribe((user) => {
        this.utilisateur = user
      })
    }
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

  logout() {
    // Clear the storage_user_id from localStorage
    localStorage.removeItem('storage_user_id')
    this.utilisateur = null
    // Redirect to the login page or any other page
    this.router.navigate(['/'])
    this.IsOpen = false
  }
}
