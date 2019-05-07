import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessedComponent } from './guessed.component';

describe('GuessedComponent', () => {
  let component: GuessedComponent;
  let fixture: ComponentFixture<GuessedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
