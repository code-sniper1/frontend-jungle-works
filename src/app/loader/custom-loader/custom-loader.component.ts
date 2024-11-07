import { Component,ViewEncapsulation } from '@angular/core';
import { LoaderService } from '../../shared/services/loader.service';

@Component({
  selector: 'app-custom-loader',
  templateUrl: './custom-loader.component.html',
  styleUrls: ['./custom-loader.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CustomLoaderComponent {
  constructor(public loader: LoaderService) { }
}
