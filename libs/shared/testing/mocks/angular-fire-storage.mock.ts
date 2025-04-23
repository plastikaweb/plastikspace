export const angularFireStorageMock = jest.mock('@angular/fire/storage', () => ({
  getDownloadURL: jest.fn().mockResolvedValue('mocked-url'),
  listAll: jest.fn().mockResolvedValue({ items: [], prefixes: [] }),
  percentage: jest.fn().mockReturnValue({ percentage: 0 }),
  ref: jest.fn().mockReturnValue({
    getDownloadURL: jest.fn().mockResolvedValue('mocked-url'),
    put: jest.fn().mockResolvedValue({}),
  }),
  Storage: jest.fn(),
  uploadBytesResumable: jest.fn().mockReturnValue({
    on: jest.fn((_, next) => {
      next({ bytesTransferred: 50, totalBytes: 100 });
      next({ bytesTransferred: 100, totalBytes: 100 });
    }),
    snapshot: { bytesTransferred: 0, totalBytes: 100 },
  }),
}));
