import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { PhotoService } from '../../services/photo.service'

@Component({
  selector: 'app-photo',
  standalone: true,
  providers: [PhotoService],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.scss',
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PhotoComponent implements OnInit {
  @Output() photoSelected = new EventEmitter<number>()

  photos: any[] = []
  query = ''
  perPage = 25
  page = 1

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.getPhotos()
  }

  getPhotos(): void {
    // console.log('query:', this.query)
    if (this.query.trim() === '') {
      this.getRandomPhotos()
    } else {
      this.photoService
        .getPhotos(this.query, this.perPage, this.page)
        .subscribe((photos) => (this.photos = photos.photos))
    }
  }

  // pour que la recherche se lance des que le texte de l'input change
  // onInputChange(event: any) {
  //   this.query = event.target.value
  //   this.getPhotos()
  // }

  getRandomPhotos(): void {
    this.photoService
      .photosCurated(this.perPage, this.page)
      .subscribe((photos) => (this.photos = photos.photos))
  }

  // On envoie l'id de la photo
  getPhotoDetails(id: number): void {
    this.photoService.getPhoto(id).subscribe((photo) => {
      this.photoSelected.emit(photo.id)
    })
  }
}
