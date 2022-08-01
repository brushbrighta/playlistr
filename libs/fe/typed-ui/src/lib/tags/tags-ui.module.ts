import { NgModule } from '@angular/core';
import { TagsComponent } from './tags.component';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule],
  declarations: [TagsComponent],
  exports: [TagsComponent],
})
export class TagsUiModule {}
