import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog'

import { ModalComponent } from '../../design-system/modal/modal.component'
import { CollectionService } from '../../services/collection.service'
import { ElementService } from '../../services/element.service'
import { UtilisateurService } from '../../services/utilisateur.service'

@Component({
  selector: 'app-form-more-option',
  standalone: true,
  templateUrl: './form-more-option.component.html',
  styleUrl: './form-more-option.component.scss',
  imports: [CommonModule, ModalComponent, DialogModule],
  providers: [CollectionService, ElementService, UtilisateurService]
})
export class FormMoreOptionComponent {
  collection: any = {}
  collections: any[] = []
  collectionId: string = ''

  element: any = {}
  elements: any[] = []
  elementId: string = ''
  isCollection = Boolean

  constructor(
    private collectionService: CollectionService,
    private elementService: ElementService,
    private utilisateurService: UtilisateurService,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {
    this.collection = data.collection
    this.collectionId = data.collectionId

    this.element = data.element
    this.elementId = data.elementId

    this.isCollection = data.isCollection
  }

  ngOnInit(): void {
    this.collection = this.data.collection
    this.element = this.data.element
    console.log(this.data)
  }

  makePublicOrPrivate(id: string, isPublic: boolean): void {
    const updatedCollection = { ...this.collection, public: isPublic }

    this.collectionService.updateCollection(updatedCollection).subscribe(
      () => {
        this.collectionService
          .getCollectionsPrivateByUtilisateurId(this.collection.userId)
          .subscribe((data) => {})
        this.collectionService
          .getCollectionsPublicByUtilisateurId(this.collection.userId)
          .subscribe((data) => {})
        this.dialogRef.close(updatedCollection)
        // console.log(`coll ${isPublic ? 'rendue publique' : 'privatisée'}`)
      },
      (error) => {
        console.error('Error updating collection:', error)
      }
    )
  }

  deleteCollection(id: string): void {
    this.collectionService.deleteCollectionById(id).subscribe({
      next: () => {
        const userId = this.utilisateurService.getCurrentUtilisateur()._id
        this.collectionService
          .getCollectionsPrivateByUtilisateurId(userId)
          .subscribe({
            next: (data) => {
              this.collections = data
              this.dialogRef.close(userId)
              // console.log('coll suppr')
            },
            error: (error) => {
              console.error('Error getting collections:', error)
            }
          })
      },
      error: (error) => {
        console.error('Error deleting collection:', error)
      }
    })
  }

  deleteElement(id: string): void {
    this.elementService.deleteElementById(id).subscribe({
      next: () => {
        this.dialogRef.close(id)
      },
      error: (error) => {
        console.error('Error deleting element:', error)
      }
    })
  }
}
