import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-asset-documents',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './asset-documents.component.html',
  styleUrl: './asset-documents.component.css'
})
export class AssetDocumentsComponent {
  readonly entityKey = 'assetDocuments';
}
