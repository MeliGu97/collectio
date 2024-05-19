import { Component, Inject, OnInit } from '@angular/core'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { ElementService } from '../../services/element.service'
import { PopupComponent } from '../../design-system/popup/popup.component';

export interface DialogCollectionData {
  collectionIdFromPage: string;
}

@Component({
  selector: 'app-form-element',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, FormsModule, ReactiveFormsModule, PopupComponent],
  providers: [ElementService],
  templateUrl: './form-element.component.html',
  styleUrl: './form-element.component.scss'
})
export class FormElementComponent implements OnInit {
  element: any = []
  nouvelElementForm: FormGroup= new FormGroup({}); 
  nouvelElement: any = {}

  constructor(
    private elementService: ElementService, 
    private formBuilder: FormBuilder, // Injectez le FormBuilder
    public dialogRef: DialogRef<string>, @Inject(DIALOG_DATA) 
    public data: DialogCollectionData) {}

  ngOnInit() {
    this.nouvelElementForm = this.formBuilder.group({
      collectionsId: [this.data.collectionIdFromPage],
      label: ['', Validators.required],
      description: ['', [Validators.required]],
      imageUrl: ['']
    });

    this.elementService.getElements().subscribe((data) => {
      this.element = data;
    });
  }

  ajouterElement(): void {
    if (this.nouvelElementForm.valid) { // Vérifiez si le formulaire est valide avant de l'envoyer
      this.elementService.addElement(this.nouvelElementForm.value).subscribe({
        next: (elementAjoute) => {
          console.log('element ajouté avec succès', elementAjoute);
          this.element.push(elementAjoute);
          this.nouvelElementForm.reset(); // Réinitialisez le formulaire après l'ajout
        },
        error: (error) => {
          console.log("elementAjoute", this.nouvelElementForm.value)
          console.error("Erreur lors de l'ajout d'un element", error);
        }
      });
    }
  }
}