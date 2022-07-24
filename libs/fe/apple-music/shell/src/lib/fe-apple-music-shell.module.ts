import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShellComponent} from "./shell.component";
import {AppleMusicShellRoutingModule} from "./routing.module";

@NgModule({
  imports: [CommonModule, AppleMusicShellRoutingModule],
  declarations: [ShellComponent]
})
export class FeAppleMusicShellModule {}
