import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filterByPeriodes',
  standalone: true
})
export class FilterByPeriodesPipe implements PipeTransform {
  transform(collections: any[], periodes: string[]): any[] {
    if (!periodes || periodes.length === 0) {
      return collections
    }

    return collections.filter((collection) =>
      collection.periodesId.some((periodeId: string) =>
        periodes.includes(periodeId)
      )
    )
  }
}
