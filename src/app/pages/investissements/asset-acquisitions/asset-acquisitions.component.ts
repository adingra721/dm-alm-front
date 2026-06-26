import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-asset-acquisitions',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './asset-acquisitions.component.html',
  styleUrl: './asset-acquisitions.component.css'
})
export class AssetAcquisitionsComponent {
  readonly entityKey = 'assetAcquisitions';
}
