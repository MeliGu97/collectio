import { Component, Inject, OnInit } from '@angular/core'
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'


import { ElementService } from '../../services/element.service'
import { PopupComponent } from '../../design-system/popup/popup.component';

export interface DialogElementData  {
  collectionIdFromPage: string;
  element?: any;
  isUpdate?: boolean;
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
  elements: any[] = [];
  element: any = {};
  nouvelElementForm: FormGroup= new FormGroup({}); 
  nouvelElement: any = {};
  // isUpdate = false;

  constructor(
    private elementService: ElementService, 
    private formBuilder: FormBuilder, 
    public dialogRef: DialogRef<any>, 
    @Inject(DIALOG_DATA) 
    public data: DialogElementData 
  ) {}

  ngOnInit() {
    console.log('Data received:', this.data);
    this.nouvelElementForm = this.formBuilder.group({
      collectionsId: [this.data.collectionIdFromPage],
      label: ['', Validators.required],
      description: [''],
      imageUrl: ['']
    });

    if (this.data.element && this.data.isUpdate) {
      this.nouvelElementForm.patchValue(this.data.element);
    }

    this.elementService.getElements().subscribe((data) => {
      this.elements = data;
    });
  }

  createOrUpdateElement(): void {
    if (this.nouvelElementForm.valid) {
      if (this.data.isUpdate && this.data.element) {
        const updatedElement = {
          ...this.data.element,
          ...this.nouvelElementForm.value
        };
        this.elementService.updateElement(updatedElement).subscribe({
          next: (updatedElement) => {
            console.log('Element updated successfully', updatedElement);
            this.dialogRef.close(updatedElement);
          },
          error: (error) => {
            console.error("Error updating element", error);
          }
        });
      } else {
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
}}