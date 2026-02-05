/// <reference types="jest" />
export const mockPocketBase = {
  collection: jest.fn().mockReturnValue({
    getList: jest.fn().mockResolvedValue({
      items: [],
      totalItems: 0,
    }),
    getFullList: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue({}),
    getFirstListItem: jest.fn().mockResolvedValue({}),
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue(true),
    authWithPassword: jest.fn().mockResolvedValue({
      record: { id: '123', email: 'test@test.com' },
      token: 'test-token',
    }),
    requestPasswordReset: jest.fn().mockResolvedValue(true),
  }),
  authStore: {
    clear: jest.fn(),
    isValid: true,
    record: { id: '123', email: 'test@test.com' } as any,
  },
};
