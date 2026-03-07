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
    requestPasswordReset: vi.fn().mockResolvedValue(true),
  }),
  authStore: {
    clear: vi.fn(),
    isValid: true,
    record: { id: '123', email: 'test@test.com' } as Record<string, unknown>,
  },
};
