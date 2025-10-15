import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { User } from '../models';
import { environment } from '../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService]
    });

    service = TestBed.inject(AdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After each test, verify that no requests are outstanding.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLeaders', () => {
    it('should make a GET request and return an array of leaders', () => {
      const mockLeaders: User[] = [
        { publicId: '1', email: 'leader1@test.com' } as User,
        { publicId: '2', email: 'leader2@test.com' } as User
      ];

      service.getLeaders().subscribe(leaders => {
        expect(leaders.length).toBe(2);
        expect(leaders).toEqual(mockLeaders);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/leaders`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLeaders);
    });
  });

  describe('createLeader', () => {
    it('should make a POST request with the correct body and return the new leader', () => {
      const newLeaderData = { email: 'new@test.com', firstName: 'New', password: 'password', lastName: 'Leader' };
      const mockCreatedLeader: User = { publicId: '3', ...newLeaderData } as User;

      service.createLeader(newLeaderData).subscribe(leader => {
        expect(leader).toEqual(mockCreatedLeader);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/leaders`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newLeaderData);
      req.flush(mockCreatedLeader);
    });
  });

  describe('deleteLeader', () => {
    it('should make a DELETE request to the correct URL', () => {
      const leaderIdToDelete = '123-abc';

      // The service method returns Observable<void>, so we just subscribe.
      service.deleteLeader(leaderIdToDelete).subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/leaders/${leaderIdToDelete}`);
      expect(req.request.method).toBe('DELETE');

      // Respond with a successful but empty response.
      req.flush(null, { status: 204, statusText: 'No Content' });
    });
  });
});