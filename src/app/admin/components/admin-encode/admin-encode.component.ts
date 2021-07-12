import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { EncodeUser } from 'src/app/encode/models/EncodeUser';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { EncodeUserService } from 'src/app/encode/services/EncodeUserService';
import { InviteFormComponent } from './invite-form-component/invite-form.component';

@Component({
  selector: 'app-admin-encode',
  templateUrl: './admin-encode.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminEncodeComponent{

  public users$: Observable<IEncodeUser[]>;

  constructor(
    private _encodeUserService: EncodeUserService,
    private _dialog: MatDialog) {}
  
  // private async _generateUserId(){
  //   const id: string = (await this._encodeUserService.createUser()).uid;
  // }

  public openInviteDialog(): void {
    const dialogRef = this._dialog.open(InviteFormComponent);

    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = async (userData: { name: string, email: string }) => {
    if (userData)
    {
      await this._encodeUserService.createUser(userData);
    }
  }

}
