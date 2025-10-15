import { HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor (Direct Function Test)', () => {
  it('should add an Authorization header when a token is present', () => {
    // ARRANGE
    const mockToken = 'my-secret-test-token';
    spyOn(localStorage, 'getItem').and.returnValue(mockToken);

    // Create a mock HttpRequest object.
    const request = new HttpRequest<any>('GET', '/test');

    // Create a mock 'next' function (HttpHandlerFn). We use a Jasmine spy.
    // This allows us to check what it gets called with.
    const next = jasmine.createSpy('next').and.returnValue(of(null));

    // ACT
    // Call the interceptor function directly with our mocks.
    authInterceptor(request, next);

    // ASSERT
    // Check that the 'next' function was called exactly once.
    expect(next).toHaveBeenCalledTimes(1);

    // Get the request object that was passed to 'next'.
    const requestPassedToNext = next.calls.first().args[0] as HttpRequest<any>;

    // Verify that the request was cloned and the header was added correctly.
    expect(requestPassedToNext.headers.has('Authorization')).toBe(true);
    expect(requestPassedToNext.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should NOT add an Authorization header when no token is present', () => {
    // ARRANGE
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const request = new HttpRequest<any>('GET', '/test');
    const next = jasmine.createSpy('next').and.returnValue(of(null));

    // ACT
    authInterceptor(request, next);

    // ASSERT
    expect(next).toHaveBeenCalledTimes(1);
    const requestPassedToNext = next.calls.first().args[0] as HttpRequest<any>;

    // Verify that the header is missing.
    expect(requestPassedToNext.headers.has('Authorization')).toBe(false);

    // Verify that the original, unmodified request was passed through.
    expect(requestPassedToNext).toBe(request);
  });
});