import { Component } from '@angular/core'
import { LoginComponent } from '../../components/login/login.component'
import { Dialog } from '@angular/cdk/dialog'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  constructor(public dialog: Dialog, private router: Router) {}
  openPopupLog(Isinscription: boolean) {
    const dialogRef = this.dialog.open<any>(LoginComponent, {
      data: {
        Isinscription: Isinscription
      }
    })

    dialogRef.closed.subscribe((result: any) => {
      console.log('The dialog was closed')
      if (result) {
      }
    })
  }

  navigateHomePage() {
    this.router.navigate(['/homePage'])
  }
}
