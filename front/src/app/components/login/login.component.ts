import { Component, Inject, OnInit } from '@angular/core'
import { EventEmitter, Output } from '@angular/core'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog'
// import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { UtilisateurService } from '../../services/utilisateur.service'

import { PopupComponent } from '../../design-system/popup/popup.component'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UtilisateurService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    PopupComponent
  ]
})
export class LoginComponent implements OnInit {
  @Output() utilisateurConnecte = new EventEmitter<void>()

  IsLog?: boolean

  IsInscription?: boolean
  IsUpdateInfo?: boolean
  userId?: string

  utilisateur: any = []

  newUtilisateurForm: FormGroup = new FormGroup({})
  newUtilisateur: any = {}

  newConnectUtilisateurForm: FormGroup = new FormGroup({})
  errorMessage: string = ''

  updateUtilisateurForm: FormGroup = new FormGroup({})

  constructor(
    private formBuilder: FormBuilder,
    private utilisateurService: UtilisateurService,
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA)
    public data: LoginComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.data.IsLog) {
      this.IsLog = true
    } else {
      this.IsLog = false
    }
    if (this.data.IsInscription) {
      this.IsInscription = true
    } else {
      this.IsInscription = false
    }
    if (this.data.IsUpdateInfo) {
      this.IsUpdateInfo = true
    } else {
      this.IsUpdateInfo = false
    }
    if (this.data.userId) {
      console.log(this.data.userId)
      this.utilisateurService
        .getUtilisateurById(this.data.userId)
        .subscribe((user) => {
          this.utilisateur = user
        })
    }
    this.newUtilisateurForm = this.formBuilder.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        nomUtilisateur: ['', Validators.required],
        motDePasse: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'"\\|,.<>\\/?]).+$'
            )
          ]
        ],
        motDePasseConfirmation: ['', Validators.required],
        role: ['collectionneur']
      },
      { validator: this.passwordMatchValidator }
    )
    this.newConnectUtilisateurForm = this.formBuilder.group({
      nomUtilisateur: ['', Validators.required],
      motDePasse: ['', Validators.required]
    })

    this.updateUtilisateurForm = this.formBuilder.group({
      _id: [this.data.userId],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      nomUtilisateur: ['', Validators.required]
    })
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('motDePasse')?.value === g.get('motDePasseConfirmation')?.value
      ? null
      : { mismatch: true }
  }

  openUpdateForm() {
    this.IsUpdateInfo = true
    this.updateUtilisateurForm.patchValue(this.utilisateur)
  }

  ajouterUtilisateur(): void {
    if (this.newUtilisateurForm.valid) {
      this.utilisateurService
        .addUtilisateur(this.newUtilisateurForm.value)
        .subscribe({
          next: (utilisateurAjoute) => {
            console.log('utilisateur ajoutée avec succès', utilisateurAjoute)
            this.utilisateur.push(utilisateurAjoute)
            this.newUtilisateurForm.reset() // Réinitialisation du FormArray après la soumission
            this.dialogRef.close(utilisateurAjoute)
          },
          error: (error) => {
            console.log('utilisateurAjoute', this.newUtilisateurForm.value)
            console.error("Erreur lors de l'ajout d'un utilisateur", error)
          }
        })
    }
  }

  modifierUtilisateur(): void {
    this.utilisateurService
      .updateUtilisateur(this.updateUtilisateurForm.value)
      .subscribe({
        next: (updateUtilisateur) => {
          this.dialogRef.close(updateUtilisateur)
        },
        error: (error) => {
          console.log('updateUtilisateur', this.updateUtilisateurForm.value)
          console.error("Erreur lors de la mise à jour de l'utili", error)
        }
      })
  }

  connectUtilisateur(): void {
    if (this.newConnectUtilisateurForm.valid) {
      this.utilisateurService
        .connectUtilisateur(this.newConnectUtilisateurForm.value)
        .subscribe({
          next: (response) => {
            localStorage.setItem('storage_user_id', response.user._id)
            // on vient enregistrer le token dans le localStorage
            localStorage.setItem('storage_token', response.token)

            // On envoie l'evenement : utilisateur connecté
            this.utilisateurConnecte.emit(response.user)

            // this.authService.login(response.user)
            this.dialogRef.close(response.user)
            // redirection vers la page de l'utilisateur qui vient de se connecté
            this.router.navigate(['/utilisateur', response.user._id])
          },
          error: (error) => {
            console.error('Erreur lors de la connexion', error)
            this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect"
          }
        })
    }
  }
}
