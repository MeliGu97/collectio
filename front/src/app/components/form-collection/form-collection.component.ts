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
    });

     if (this.data.isUpdate) {
    this.newCollectionForm.patchValue(this.data.collection);
    const periodesArray: FormArray = this.newCollectionForm.get('periodesId') as FormArray;
    this.data.collection.periodesId.forEach((periodeId: string) => {
      periodesArray.push(new FormControl(periodeId));
      const index = this.periodes.findIndex((periode: any) => periode._id === periodeId);
      if (index !== -1) {
        this.periodes[index].checked = true;
      }
    });
    }
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
      if (this.data.isUpdate) {
        const updatedCollection = {
          ...this.data.collection,
          ...this.newCollectionForm.value
        };
        this.collectionService.updateCollection(updatedCollection).subscribe({
          next: (updatedCollection) => {
            console.log('collection mise à jour avec succès', updatedCollection);
            this.dialogRef.close(updatedCollection);
          },
          error: (error) => {
            console.error("Erreur lors de la mise à jour d'une collection", error);
          }
        });
      } else {
        this.collectionService.addCollection(this.newCollectionForm.value).subscribe({
          next: (collectionAjoute) => {
            console.log('collection ajoutée avec succès', collectionAjoute);
            this.collection.push(collectionAjoute);
            this.newCollectionForm.reset();
            (this.newCollectionForm.get('periodesId') as FormArray).clear();
            this.dialogRef.close(collectionAjoute);
          },
          error: (error) => {
            console.error("Erreur lors de l'ajout d'une collection", error);
          }
        });
      }
    }
  }
}
