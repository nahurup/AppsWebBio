import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersService } from './services/user.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    UsersService
  ]
})
export class CoreModule { }
