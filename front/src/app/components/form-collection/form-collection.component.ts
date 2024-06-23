import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CollectionService } from '../../services/collection.service';
import { PopupComponent } from '../../design-system/popup/popup.component';
import { PeriodeService } from '../../services/periode.service';

@Component({
  selector: 'app-form-collection',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, DialogModule, ReactiveFormsModule, PopupComponent],
  providers: [CollectionService, PeriodeService],
  templateUrl: './form-collection.component.html',
  styleUrl: './form-collection.component.scss'
})
export class FormCollectionComponent implements OnInit {
  collection: any = [];
  newCollectionForm: FormGroup = new FormGroup({});
  newCollection: any = {};
  periodes: any;

  constructor(
    private collectionService: CollectionService,
    private periodeService: PeriodeService,
    private formBuilder: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.newCollectionForm = this.formBuilder.group({
      label: ['', Validators.required],
      description: [''],
      categorie: ['', [Validators.required]],
      sousCategorie: [''],
      imageUrl: [''],
      picto: [''],
      periodesId: this.formBuilder.array([])
    });
  
    this.collectionService.getCollections().subscribe((data) => {
      this.collection = data;
    });
  
    this.periodeService.getPeriodes().subscribe((data) => {
      this.periodes = data;
      const periodesArray: FormArray = this.newCollectionForm.get('periodesId') as FormArray;
  
      if (this.data.isUpdate) {
        this.newCollectionForm.patchValue(this.data.collection);
  
        // 'periodesId' basé sur la liste de case a coché 'periodes' vérifie quelle case est cochée
        this.periodes.forEach((periode: any) => {
          const isChecked = this.data.collection.periodesId.some((period: any) => period._id === periode._id);
          periodesArray.push(new FormControl(isChecked ? periode._id : false));
        });
      } else {
        this.periodes.forEach(() => {
          periodesArray.push(new FormControl(false));
        });
      }
  
      // console.log('this.newCollectionForm', this.newCollectionForm);
      // console.log('this.collection', this.collection);
      // console.log('periodes', this.periodes);
    });
  }
  
  onCheckboxChange(e: any) {
    const periodesArray: FormArray = this.newCollectionForm.get('periodesId') as FormArray;

    if (e.target.checked) {
      periodesArray.push(new FormControl(e.target.value));
    } else {
      const index = periodesArray.controls.findIndex(x => x.value === e.target.value);
      periodesArray.removeAt(index);
    }
  }

  createOrUpdateCollection(): void {
    if (this.newCollectionForm.valid) {
      const periodesIds = this.newCollectionForm.value.periodesId.filter((id: any) => typeof id === 'string');
      const collectionData = { ...this.newCollectionForm.value, periodesId: periodesIds };
      // MODIFIER
      if (this.data.isUpdate) {
        const updatedCollection = { ...this.data.collection, ...collectionData };
        this.collectionService.updateCollection(updatedCollection).subscribe({
          next: (updatedCollection) => {
            console.log('collection mise à jour avec succès', updatedCollection);
            
            this.dialogRef.close(updatedCollection);
          },
          error: (error) => {
            console.log("updatedCollection", updatedCollection)
            console.error("Erreur lors de la mise à jour d'une collection", error);
          }
        });
      } else {
        // AJOUTER
        this.collectionService.addCollection(collectionData).subscribe({
          next: (collectionAjoute) => {
            console.log('collection ajoutée avec succès', collectionAjoute);
            this.collection.push(collectionAjoute);
            this.newCollectionForm.reset();
            (this.newCollectionForm.get('periodesId') as FormArray).clear();
            this.dialogRef.close(collectionAjoute);
          },
          error: (error) => {
            console.log("ValueCollAjoute", collectionData)
            console.error("Erreur lors de l'ajout d'une collection", error);
          }
        });
      }
    }
  }
  
}
