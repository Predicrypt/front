import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BalanceListComponent } from '../../components/balance-list/balance-list.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  email: string;
  @ViewChild('balances') balances: BalanceListComponent;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.email = this.authService.getEmail();
  }

  initForm() {
    this.userForm = new FormGroup({
      apiKey: new FormControl(null, Validators.required),
      secretKey: new FormControl(null, Validators.required),
    });
  }

  saveKeys() {
    this.userService
      .saveKeys(
        this.userForm.controls.apiKey.value,
        this.userForm.controls.secretKey.value
      )
      .subscribe(res => {
        this.balances.initBalances()
      });
  }
}
