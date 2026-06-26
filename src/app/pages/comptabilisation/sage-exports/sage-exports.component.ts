import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-sage-exports',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './sage-exports.component.html',
  styleUrl: './sage-exports.component.css'
})
export class SageExportsComponent {
  readonly entityKey = 'sageExports';
}
