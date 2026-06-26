import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-asset-maturities',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './asset-maturities.component.html',
  styleUrl: './asset-maturities.component.css'
})
export class AssetMaturitiesComponent {
  readonly entityKey = 'assetMaturities';
}
