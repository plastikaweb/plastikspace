import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { activityStore } from '../+state/activity.store';
import { pocketBaseActivityInterceptor } from './pocketbase-activity.interceptor';

describe('pocketBaseActivityInterceptor', () => {
  let setActivityMock: vi.Mock;
  let mockPbSend: vi.Mock;
  let mockPb: { send: vi.Mock };
  let mockActivityStore: { setActivity: vi.Mock };

  const setup = () => {
    setActivityMock = vi.fn();
    mockPbSend = vi.fn().mockResolvedValue({ data: 'response' });
    mockPb = { send: mockPbSend };
    mockActivityStore = { setActivity: setActivityMock };

    TestBed.configureTestingModule({
      providers: [
        { provide: POCKETBASE_INSTANCE, useValue: mockPb },
        { provide: activityStore, useValue: mockActivityStore },
      ],
    });

    TestBed.runInInjectionContext(() => pocketBaseActivityInterceptor());
  };

  beforeEach(() => {
    vi.useFakeTimers();
    setup();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should patch the pb.send method', () => {
    expect(mockPb.send).not.toBe(mockPbSend);
  });

  it('should NOT set activity for requests without require-global-loading header', async () => {
    await mockPb.send('/test', { headers: {} });

    vi.runAllTimers();

    expect(setActivityMock).not.toHaveBeenCalled();
  });

  it('should NOT set activity when require-global-loading header is not "true"', async () => {
    await mockPb.send('/test', { headers: { 'require-global-loading': 'false' } });

    vi.runAllTimers();

    expect(setActivityMock).not.toHaveBeenCalled();
  });

  it('should set activity to true for requests with require-global-loading: true', async () => {
    const promise = mockPb.send('/test', { headers: { 'require-global-loading': 'true' } });

    vi.advanceTimersByTime(200);

    await promise;
    expect(setActivityMock).toHaveBeenCalledWith(true);
  });

  it('should set activity to false after request completes', async () => {
    await mockPb.send('/test', { headers: { 'require-global-loading': 'true' } });

    vi.runAllTimers();

    expect(setActivityMock).toHaveBeenLastCalledWith(false);
  });

  it('should call the original send function with the correct arguments', async () => {
    const params = { headers: { 'require-global-loading': 'true' } };
    await mockPb.send('/test-path', params);

    expect(mockPbSend).toHaveBeenCalledWith('/test-path', params);
  });
});
