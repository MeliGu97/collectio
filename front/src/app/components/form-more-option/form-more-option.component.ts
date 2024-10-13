import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DialogRef, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2'
import Swal from 'sweetalert2'

import { ModalComponent } from '../../design-system/modal/modal.component'
import { CollectionService } from '../../services/collection.service'
import { ElementService } from '../../services/element.service'
import { UtilisateurService } from '../../services/utilisateur.service'
import { SignalementService } from '../../services/signalement.service'

@Component({
  selector: 'app-form-more-option',
  standalone: true,
  templateUrl: './form-more-option.component.html',
  styleUrl: './form-more-option.component.scss',
  imports: [CommonModule, ModalComponent, DialogModule],
  providers: [
    CollectionService,
    ElementService,
    UtilisateurService,
    SignalementService,
    SweetAlert2Module
  ]
})
export class FormMoreOptionComponent {
  collection: any = {}
  collections: any[] = []
  collectionId: string = ''

  element: any = {}
  elements: any[] = []
  elementId: string = ''
  isCollection = Boolean

  signalement: any = {}

  constructor(
    private collectionService: CollectionService,
    private elementService: ElementService,
    private utilisateurService: UtilisateurService,
    private signalementService: SignalementService,

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
    // console.log(this.data)
  }

  makePublicOrPrivate(id: string, isPublic: boolean): void {
    const updatedCollection = { ...this.collection, public: isPublic }

    this.collectionService.updateCollection(updatedCollection).subscribe(
      () => {
        const token =
          localStorage.getItem('storage_token') || 'default_token_value'
        this.collectionService
          .getCollectionsPrivateByUtilisateurId(this.collection.userId, token)
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
    const token = localStorage.getItem('storage_token') || 'default_token_value'
    if (this.collection.signalement) {
      this.signalementService
        .getSignalementByCollectionId(id)
        .subscribe((data) => {
          this.signalement = data
          // console.log('id du signalement dans form :', this.signalement._id)
          this.signalementService
            .deleteSignalementBySignalementId(this.signalement._id)
            .subscribe(() => {})
        })
    }
    this.collectionService.deleteCollectionById(id, token).subscribe({
      next: () => {
        const userId = this.utilisateurService.getCurrentUtilisateur()._id
        const token =
          localStorage.getItem('storage_token') || 'default_token_value'
        this.collectionService
          .getCollectionsPrivateByUtilisateurId(userId, token)
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
    const token = localStorage.getItem('storage_token') || 'default_token_value'
    this.elementService.deleteElementById(id, token).subscribe({
      next: () => {
        this.dialogRef.close(id)
      },
      error: (error) => {
        console.error('Error deleting element:', error)
      }
    })
  }

  // ALERT
  showAlertConfirmeDeleteColl(id: string) {
    Swal.fire({
      title: 'Supprimer la collection',
      text: 'Êtes vous sûr de confirmer la suppression de votre collection ? Tous les éléments qui la composent seront également supprimés',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Confirmer la suppression',

      customClass: {
        title: 'titre-popup',
        icon: 'picto-popup',
        confirmButton: 'btn-primary btn-small btn-success',
        cancelButton: 'btn-primary btn-small btn-error'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCollection(id)
        Swal.fire({
          title: 'Collection supprimée !',
          text: 'Votre collection a bien été supprimée.',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: {
            title: 'titre-popup',
            confirmButton: 'btn-primary btn-small'
          },
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Annuler',
          text: "Votre Collection n'a pas été supprimée.",
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            title: 'titre-popup',
            confirmButton: 'btn-primary btn-small'
          },
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      }
    })
  }

  showAlertConfirmeDeleteElement(id: string) {
    Swal.fire({
      title: "Supprimer l'élément",
      text: 'Êtes vous sûr de confirmer la suppression de votre élément ? Tous les événements qui le composent seront également supprimés',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Confirmer la suppression',

      customClass: {
        title: 'titre-popup',
        icon: 'picto-popup',
        confirmButton: 'btn-primary btn-small btn-success',
        cancelButton: 'btn-primary btn-small btn-error'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteElement(id)
        Swal.fire({
          title: 'Élément supprimé !',
          text: 'Votre élément a bien été supprimé.',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: {
            title: 'titre-popup',
            confirmButton: 'btn-primary btn-small'
          },
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Annuler',
          text: "Votre élément n'a pas été supprimé.",
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            title: 'titre-popup',
            confirmButton: 'btn-primary btn-small'
          },
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
      }
    })
  }
}
