import { Component, Inject, OnInit } from '@angular/core'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'

import { ElementService } from '../../services/element.service'
import { PopupComponent } from '../../design-system/popup/popup.component';

export interface DialogElementData  {
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
  elements: any = []
  nouvelElementForm: FormGroup= new FormGroup({}); 
  nouvelElement: any = {}

  constructor(
    private elementService: ElementService, 
    private formBuilder: FormBuilder, 
    public dialogRef: DialogRef<string>, 
    @Inject(DIALOG_DATA) 
    public data: DialogElementData ) 
    {}

  ngOnInit() {
    this.nouvelElementForm = this.formBuilder.group({
      collectionsId: [this.data.collectionIdFromPage],
      label: ['', Validators.required],
      description: [''],
      imageUrl: ['']
    });

    this.elementService.getElements().subscribe((data) => {
      this.elements = data;
    });
  }

  ajouterElement(): void {
    if (this.nouvelElementForm.valid) { // Vérifie si le formulaire est valide avant de l'envoyer
      this.elementService.addElement(this.nouvelElementForm.value).subscribe({
        next: (elementAjoute) => {
          console.log('element ajouté avec succès', elementAjoute);
          this.elements.push(elementAjoute);
          this.nouvelElementForm.reset(); // Réinitialisation du formulaire après l'ajout
          this.dialogRef.close(elementAjoute)
        },
        error: (error) => {
          console.log("elementAjoute", this.nouvelElementForm.value)
          console.error("Erreur lors de l'ajout d'un element", error);
        }
      });
    }
  }
}