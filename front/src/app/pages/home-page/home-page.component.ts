import { booleanAttribute, Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Dialog } from '@angular/cdk/dialog'

import { CollectionsComponent } from '../../components/collection-detail/collections.component'
import { UneService } from '../../services/une.service'
import { LoginComponent } from '../../components/login/login.component'

export interface DialogData {
  Isinscription: boolean
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  providers: [UneService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [CommonModule, RouterLink, CollectionsComponent]
})
export class HomePageComponent implements OnInit {
  collection: any = {}
  collections: any[] = []
  unes: any[] = []
  collectionId: any = {}

  constructor(private uneService: UneService, public dialog: Dialog) {}

  ngOnInit() {
    this.uneService.getUnes().subscribe((data) => {
      this.unes = data
      this.collections = this.unes.map((une) => une.collectionId)
    })
  }

  openPopupLog(Isinscription: boolean) {
    const dialogRef = this.dialog.open<any>(LoginComponent, {
      data: {
        Isinscription: Isinscription
      }
    })

    dialogRef.closed.subscribe((result: any) => {
      console.log('The dialog was closed')
      if (result) {
      }
    })
  }
}
