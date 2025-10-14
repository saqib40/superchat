// src/app/guards/auth.guard.spec.ts

import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

// Helper to execute the guard in the right context
const executeGuard = (route: ActivatedRouteSnapshot) => {
  const state = {} as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => authGuard(route, state));
};

describe('authGuard', () => {
  let authServiceMock: Partial<AuthService>;
  let router: Router;

  beforeEach(() => {
    // Mock the AuthService
    authServiceMock = {
      getUserRole: () => null,
    };

    // Configure the testing module for each test
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    // Get the router instance after configuration
    router = TestBed.inject(Router);
  });

  it('should return true if the user has the expected role', () => {
    authServiceMock.getUserRole = () => 'Admin';
    const route = { data: { expectedRole: 'Admin' } } as unknown as ActivatedRouteSnapshot;
    const canActivate = executeGuard(route);
    expect(canActivate).toBe(true);
  });

  it('should return true if the user has the expected role in an array', () => {
    authServiceMock.getUserRole = () => ['User', 'Admin'];
    const route = { data: { expectedRole: 'Admin' } } as unknown as ActivatedRouteSnapshot;
    const canActivate = executeGuard(route);
    expect(canActivate).toBe(true);
  });

  it('should navigate to /login and return false if the user does not have the expected role', () => {
    authServiceMock.getUserRole = () => 'User';
    const route = { data: { expectedRole: 'Admin' } } as unknown as ActivatedRouteSnapshot;
    const navigateSpy = spyOn(router, 'navigate'); // Spy BEFORE acting

    const canActivate = executeGuard(route);

    expect(canActivate).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to /login and return false if the user is not logged in', () => {
    const route = { data: { expectedRole: 'Admin' } } as unknown as ActivatedRouteSnapshot;
    const navigateSpy = spyOn(router, 'navigate'); // Spy BEFORE acting

    const canActivate = executeGuard(route);

    expect(canActivate).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});