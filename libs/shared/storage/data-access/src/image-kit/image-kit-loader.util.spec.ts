import { imageKitLoader } from './image-kit-loader.util';

describe('imageKitLoader', () => {
  const imageKitEndpoint = 'https://ik.imagekit.io/myaccount/';
  const originalEndpoint = '/v0/b/bucket/o/';
  const loader = imageKitLoader(imageKitEndpoint, originalEndpoint);

  it('should format URL correctly using fast string parsing when query string is present', () => {
    const src = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Fimage.jpg?alt=media';
    const loaderParams = { width: 300, height: 200, quality: 80 };

    const result = loader({ src, loaderParams });
    expect(result).toBe('https://ik.imagekit.io/myaccount/path%2Fto%2Fimage.jpg?alt=media&tr=w-300,h-200,q-80');
  });

  it('should format URL correctly using fast string parsing when query string is absent', () => {
    const src = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Fimage.jpg';
    const loaderParams = { width: 300, height: 200, quality: 80 };

    const result = loader({ src, loaderParams });
    expect(result).toBe('https://ik.imagekit.io/myaccount/path%2Fto%2Fimage.jpg?tr=w-300,h-200,q-80');
  });

  it('should use default quality 80 if quality is omitted', () => {
    const src = 'https://firebasestorage.googleapis.com/v0/b/bucket/o/path%2Fto%2Fimage.jpg?alt=media';
    const loaderParams = { width: 300, height: 200 };

    const result = loader({ src, loaderParams });
    expect(result).toBe('https://ik.imagekit.io/myaccount/path%2Fto%2Fimage.jpg?alt=media&tr=w-300,h-200,q-80');
  });

  it('should return empty string on invalid inputs', () => {
    expect(loader({ src: '', loaderParams: { width: 100, height: 100 } })).toBe('');
    expect(loader({ src: 'https://example.com/img.jpg', loaderParams: { width: 0, height: 100 } })).toBe('');
  });
});
