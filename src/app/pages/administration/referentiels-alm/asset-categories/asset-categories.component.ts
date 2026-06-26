import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-asset-categories',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './asset-categories.component.html',
  styleUrl: './asset-categories.component.css'
})
export class AssetCategoriesComponent {
  readonly entityKey = 'assetCategories';
}
