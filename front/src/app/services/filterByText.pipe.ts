import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return []
    }
    if (!searchText) {
      return items
    }
    searchText = searchText.toLowerCase()
    return items.filter((item) => {
      return (
        item.label.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
        // ||
        // item.categorie.toLowerCase().includes(searchText) ||
        // item.sousCategorie.toLowerCase().includes(searchText)
      )
    })
  }
}
