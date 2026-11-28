import { fromTablePagination, toTablePagination, toTableSorting } from './shared-table-util';

describe('shared-table-util', () => {
  describe('toTablePagination', () => {
    it('turns the 1-based page into a 0-based page index', () => {
      expect(toTablePagination({ page: 3, perPage: 20 })).toEqual({ pageIndex: 2, pageSize: 20 });
    });

    it('reads a page below 1 as the first page', () => {
      expect(toTablePagination({ page: 0, perPage: 10 })).toEqual({ pageIndex: 0, pageSize: 10 });
      expect(toTablePagination({ page: -4, perPage: 10 })).toEqual({ pageIndex: 0, pageSize: 10 });
    });
  });

  describe('fromTablePagination', () => {
    it('turns the 0-based page index into a 1-based page', () => {
      expect(fromTablePagination({ pageIndex: 2, pageSize: 20 })).toEqual({ page: 3, perPage: 20 });
    });

    it('keeps the page when the page size does not change', () => {
      expect(fromTablePagination({ pageIndex: 4, pageSize: 20 }, 20)).toEqual({
        page: 5,
        perPage: 20,
      });
    });

    it('returns to the first page when the page size changes', () => {
      expect(fromTablePagination({ pageIndex: 4, pageSize: 50 }, 20)).toEqual({
        page: 1,
        perPage: 50,
      });
    });

    it('never asks for a page or a page size below 1', () => {
      expect(fromTablePagination({ pageIndex: -3, pageSize: 0 })).toEqual({ page: 1, perPage: 1 });
    });

    it('round-trips with toTablePagination', () => {
      const pagination = { page: 7, perPage: 75 };

      expect(fromTablePagination(toTablePagination(pagination), 75)).toEqual(pagination);
    });
  });

  describe('toTableSorting', () => {
    it('turns the sort object into the table tuple', () => {
      expect(toTableSorting({ active: 'updated', direction: 'desc' })).toEqual(['updated', 'desc']);
    });
  });
});
