import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'

import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, HttpClientModule, FormsModule, CommonModule, ReactiveFormsModule],
  providers: [UtilisateurService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  utilisateur: any = []
  newUtilisateurForm: FormGroup= new FormGroup({}); 
  newUtilisateur: any = {};
  inscription: boolean = false

  constructor(
    private formBuilder: FormBuilder, 
    private utilisateurService: UtilisateurService
  ) { }

  ngOnInit(): void {
    this.newUtilisateurForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      nomUtilisateur: ['', Validators.required],
      motDePasse: ['', Validators.required],
      role: ['collectionneur']
    });
  }

  
  ajouterUtilisateur(): void {
    if (this.newUtilisateurForm.valid) {
      this.utilisateurService.addUtilisateur(this.newUtilisateurForm.value).subscribe({
        next: (utilisateurAjoute) => {
          console.log('utilisateur ajoutée avec succès', utilisateurAjoute);
          this.utilisateur.push(utilisateurAjoute);
          this.newUtilisateurForm.reset(); // Réinitialisation du FormArray après la soumission
        },
        error: (error) => {
          console.log("utilisateurAjoute", this.newUtilisateurForm.value);
          console.error("Erreur lors de l'ajout d'un utilisateur", error);
        }
      });
    }
  }

}