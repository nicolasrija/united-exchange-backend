const markUpFeeRepository = require('../../src/repositories/mark-up-fee');
const MarkUpFee = require('../../src/models/mark-up-fee');
const { markUpFeeDocument } = require('../data');

jest.mock('../../src/models/mark-up-fee');

const feeMock = {
  pair: 'ARSBRL',
  percentage: 10,
};

describe('Testing Mark Up Fee Reposirtory', () => {
  describe('Testing create function', () => {
    MarkUpFee.create.mockReturnValue(Promise.resolve(markUpFeeDocument));

    it('should export create function', () => {
      expect(typeof markUpFeeRepository.create).toBe('function');
    });

    it('should have one argument: fee', () => {
      expect(markUpFeeRepository.create.length).toBe(1);
    });

    it('should call create method from MarkUpFee model', async () => {
      await markUpFeeRepository.create(feeMock);

      expect(MarkUpFee.create).toBeCalledWith({
        pair: feeMock.pair,
        percentage: feeMock.percentage,
      });
    });

    it('should return the generated document', async () => {
      const result = await markUpFeeRepository.create(feeMock);

      expect(result).toBe(markUpFeeDocument);
    });
  });

  describe('Testing get function', () => {
    MarkUpFee.findOne.mockReturnValue(Promise.resolve(markUpFeeDocument));
    const pairMock = 'ARSBRL';

    it('should export get function', () => {
      expect(typeof markUpFeeRepository.get).toBe('function');
    });

    it('should have one argument: pair', () => {
      expect(markUpFeeRepository.get.length).toBe(1);
    });

    it('should call findOne method from MarkUpFee model', async () => {
      await markUpFeeRepository.get(pairMock);

      expect(MarkUpFee.findOne).toBeCalledWith({ pair: pairMock });
    });

    it('should return the mark up fee document', async () => {
      const result = await markUpFeeRepository.get();

      expect(result).toBe(markUpFeeDocument);
    });
  });

  describe('Testing update function', () => {
    const newPercentage = 5;

    it('should export update function', () => {
      expect(typeof markUpFeeRepository.update).toBe('function');
    });

    it('should have two argument: markUpFee, newPercentage', () => {
      expect(markUpFeeRepository.update.length).toBe(2);
    });

    it('should call save method from markUpFee document', async () => {
      await markUpFeeRepository.update(markUpFeeDocument, newPercentage);

      expect(markUpFeeDocument.save).toBeCalled();
    });

    it('should return the new document', async () => {
      const result = await markUpFeeRepository.update(
        markUpFeeDocument,
        newPercentage
      );

      expect(result.percentage).toBe(newPercentage);
    });
  });

  describe('Testing getAll function', () => {
    const markUpFeeCollection = [markUpFeeDocument];
    MarkUpFee.find.mockReturnValue(Promise.resolve(markUpFeeCollection));

    it('should export getAll function', () => {
      expect(typeof markUpFeeRepository.getAll).toBe('function');
    });

    it('should call find method from MarkUpFee model', async () => {
      await markUpFeeRepository.getAll();

      expect(MarkUpFee.find).toBeCalledWith({});
    });

    it('should return the collection of mark up fee documents', async () => {
      const result = await markUpFeeRepository.getAll();

      expect(result).toBe(markUpFeeCollection);
    });
  });
});
