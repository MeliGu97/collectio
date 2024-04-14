import { Component, OnInit } from '@angular/core';
import { EvenementService } from '../../services/evenement.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms'; // Importez FormGroup, FormBuilder et Validators
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evenements',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink, ReactiveFormsModule],
  providers: [EvenementService],
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.scss'
})
export class EvenementsComponent implements OnInit {
  evenements: any = [];
  nouvelEvenementForm: FormGroup= new FormGroup({}); 
  nouvelEvenement: any = {};

  constructor(
    private evenementService: EvenementService,
    private formBuilder: FormBuilder // Injectez le FormBuilder
  ) {}

  ngOnInit() {
    this.nouvelEvenementForm = this.formBuilder.group({
      label: ['', Validators.required], // Ajoutez Validators.required pour le champ "label"
      date: ['', [Validators.required, this.customYearValidator]] // Utilisez Validators.required pour le champ "date" et ajoutez votre validateur personnalisé
    });

    this.evenementService.getEvenements().subscribe((data) => {
      this.evenements = data;
    });
  }

  ajouterEvenement(): void {
    if (this.nouvelEvenementForm.valid) { // Vérifiez si le formulaire est valide avant de l'envoyer
      this.evenementService.addEvenement(this.nouvelEvenementForm.value).subscribe({
        next: (evenementAjoute) => {
          console.log('evenement ajoutée avec succès', evenementAjoute);
          this.evenements.push(evenementAjoute);
          this.nouvelEvenementForm.reset(); // Réinitialisez le formulaire après l'ajout
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout d'une evenement", error);
        }
      });
    }
  }

  customYearValidator(control: AbstractControl) { // Spécifiez explicitement le type AbstractControl
    const year = control.value;
    if (year < 0 || year > 0 || year == 0) { // Vérifiez si l'année est un nombre positif ou négatif
      return null; // Retournez null si la validation réussit
    } else {
      return { invalidYear: true }; // Retournez un objet avec la clé 'invalidYear' si la validation échoue
    }
  }
}
