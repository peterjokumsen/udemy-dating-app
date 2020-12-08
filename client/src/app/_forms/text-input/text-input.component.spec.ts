import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl, FormControlDirective, FormGroup, FormsModule, NgControl, ReactiveFormsModule,
} from '@angular/forms';
import { TextInputComponent } from './text-input.component';

@Component({
  template: `
  <form [formGroup]="testForm">
    <app-text-input [label]="'Test Input'" formControlName="testing"></app-text-input>
  </form>
  `,
})
class TextInputHostComponent {
  @ViewChild(TextInputComponent) public inputComponent: TextInputComponent;
  public testForm = new FormGroup({ testing: new FormControl() });
}

describe('TextInputComponent', () => {
  let component: TextInputComponent;
  let fixture: ComponentFixture<TextInputHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        TextInputComponent,
        TextInputHostComponent,
      ],
    }).overrideComponent(TextInputComponent, {
      set: {
        providers: [
          { provide: NgControl, useValue: new FormControlDirective([], [], null, null) },
        ],
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextInputHostComponent);
    fixture.detectChanges();
    component = fixture.componentInstance.inputComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
