import { FilterArrayPipe, FilterArrayPipeConfig } from './filter-array.pipe';

interface Person {
  name: string;
  age: number;
}
const arr: Person[] = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 35 },
];

const filters: FilterArrayPipeConfig<Person>[] = [
  { fields: ['name'], value: 'John' },
  { fields: ['age'], value: '25' },
];

describe('FilterArrayPipe', () => {
  let pipe: FilterArrayPipe;

  beforeEach(() => {
    pipe = new FilterArrayPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the filtered array', () => {
    const result = pipe.transform(arr, filters);
    expect(result).toEqual([{ name: 'John', age: 25 }]);
  });

  it('should return the original array if no filters are provided', () => {
    const result = pipe.transform(arr, []);
    expect(result).toEqual(arr);
  });

  it('should return an empty array if the input array is empty', () => {
    const arr: Person[] = [];
    const result = pipe.transform(arr, filters);
    expect(result).toEqual([]);
  });
});
