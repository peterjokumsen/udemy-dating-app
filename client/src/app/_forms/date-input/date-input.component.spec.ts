import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl, FormControlDirective, FormGroup, FormsModule, NgControl, ReactiveFormsModule,
} from '@angular/forms';
import { DateInputComponent } from './date-input.component';

@Component({
  template: `
  <form [formGroup]="testForm">
    <app-date-input [label]="'Test Input'" formControlName="testing"></app-date-input>
  </form>
  `,
})
class DateInputHostComponent {
  @ViewChild(DateInputComponent) public inputComponent: DateInputComponent;
  public testForm = new FormGroup({ testing: new FormControl() });
}

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
      ],
      declarations: [
        DateInputHostComponent,
        DateInputComponent,
      ]
    }).overrideComponent(DateInputComponent, {
      set: {
        providers: [
          { provide: NgControl, useValue: new FormControlDirective([], [], null, null) },
        ],
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.inputComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
