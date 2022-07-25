import { NgModule } from '@angular/core';
import { SafePipe } from './save-url.pipe';

@NgModule({
  declarations: [SafePipe],
  exports: [SafePipe],
})
export class SafeUrlModule {}
