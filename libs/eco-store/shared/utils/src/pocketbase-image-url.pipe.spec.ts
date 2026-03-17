import { PocketBaseImageUrlPipe, getPocketBaseImageUrl } from './pocketbase-image-url.pipe';

describe('PocketBaseImageUrlPipe', () => {
  let pipe: PocketBaseImageUrlPipe;

  beforeEach(() => {
    pipe = new PocketBaseImageUrlPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null if source is missing', () => {
    expect(pipe.transform(null, 'image.jpg')).toBeNull();
    expect(pipe.transform(undefined, 'image.jpg')).toBeNull();
  });

  it('should return null if image is missing', () => {
    const source = { id: '123', collectionId: 'abc' };
    expect(pipe.transform(source, null)).toBeNull();
    expect(pipe.transform(source, undefined)).toBeNull();
    expect(pipe.transform(source, '')).toBeNull();
  });

  it('should return null if source.id or source.collectionId is missing', () => {
    expect(pipe.transform({ id: '', collectionId: 'abc' }, 'image.jpg')).toBeNull();
    expect(pipe.transform({ id: '123', collectionId: '' }, 'image.jpg')).toBeNull();
  });

  it('should return correct URL fragment', () => {
    const source = { id: '123', collectionId: 'abc' };
    expect(pipe.transform(source, 'image.jpg')).toBe('abc/123/image.jpg');
  });
});

describe('getPocketBaseImageUrl', () => {
  it('should return correct URL fragment', () => {
    const source = { id: '123', collectionId: 'abc' };
    expect(getPocketBaseImageUrl(source, 'image.jpg')).toBe('abc/123/image.jpg');
  });

  it('should return null for invalid inputs', () => {
    expect(getPocketBaseImageUrl(null, 'image.jpg')).toBeNull();
    expect(getPocketBaseImageUrl({ id: '1', collectionId: 'a' }, null)).toBeNull();
  });
});
