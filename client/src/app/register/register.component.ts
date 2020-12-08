import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(
    private _accountService: AccountService,
    private _toastr: ToastrService,
    private _fb: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);

    this.registerForm = this._fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (ctrl: AbstractControl) => {
      return ctrl?.value === ctrl?.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  controlIsInvalid(name: string): boolean {
    return this.registerForm.get(name).errors
      && this.registerForm.get(name).touched;
  }

  controlHasError(name: string, error: string): boolean {
    return this.registerForm.get(name).hasError(error);
  }

  register(): void {
    this._accountService.register(this.registerForm.value).subscribe(r => {
      this._router.navigateByUrl('/members');
      this.cancel();
    }, (e) => {
      this.validationErrors = e;
    });
  }

  cancel(): void {
    this.cancelRegister.emit(false);
  }
}
