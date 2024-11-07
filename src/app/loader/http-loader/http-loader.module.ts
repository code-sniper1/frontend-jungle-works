import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NgHttpLoaderModule } from 'ng-http-loader';
import { HttpLoaderComponent } from './http-loader.component';

@NgModule({
  declarations: [HttpLoaderModule.rootComponent],
  imports: [CommonModule,NgHttpLoaderModule.forRoot()],
  exports: [HttpLoaderModule.rootComponent]
})
export class HttpLoaderModule {
  static rootComponent = HttpLoaderComponent
}