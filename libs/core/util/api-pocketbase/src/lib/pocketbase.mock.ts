export const mockPocketBase = {
  collection: vi.fn().mockReturnValue({
    getList: vi.fn().mockResolvedValue({
      items: [],
      totalItems: 0,
    }),
    getFullList: vi.fn().mockResolvedValue([]),
    getOne: vi.fn().mockResolvedValue({}),
    getFirstListItem: vi.fn().mockResolvedValue({}),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue(true),
    authWithPassword: vi.fn().mockResolvedValue({
      record: { id: '123', email: 'test@test.com' },
      token: 'test-token',
    }),
    authRefresh: vi.fn().mockResolvedValue({
      record: { id: '123', email: 'test@test.com' },
      token: 'test-token',
    }),
    requestPasswordReset: vi.fn().mockResolvedValue(true),
    requestOTP: vi.fn().mockResolvedValue({ otpId: 'test-otp-id' }),
    authWithOTP: vi.fn().mockResolvedValue({
      record: { id: '123', email: 'test@test.com' },
      token: 'test-token',
    }),
  }),
  authStore: {
    clear: vi.fn(),
    // A plain function, so a mock reset cannot strip the unsubscribe callback it returns.
    onChange: (): (() => void) => () => undefined,
    isValid: true,
    record: { id: '123', email: 'test@test.com' } as Record<string, unknown>,
  },
};
