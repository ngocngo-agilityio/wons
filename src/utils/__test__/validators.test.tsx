// Constants
import { MESSAGES } from '@/constants';

// Utils
import {
  customerFormSchema,
  eventSchema,
  getDirtyState,
  isEnableSubmitButton,
  productFormSchema,
  signInSchema,
} from '../validators';
import { MOCK_PRODUCTS } from '@/mocks';

describe('isEnableSubmitButton', () => {
  it('should enable button if all required fields are filled and there are no errors', () => {
    const requiredFields = ['field1', 'field2'];
    const dirtyFields = ['field1', 'field2'];
    const errors = {};
    expect(isEnableSubmitButton(requiredFields, dirtyFields, errors)).toBe(
      true,
    );
  });

  it('should disable button if any required field is missing', () => {
    const requiredFields = ['field1', 'field2'];
    const dirtyFields = ['field1'];
    const errors = {};
    expect(isEnableSubmitButton(requiredFields, dirtyFields, errors)).toBe(
      false,
    );
  });

  it('should disable button if there are errors', () => {
    const requiredFields = ['field1', 'field2'];
    const dirtyFields = ['field1', 'field2'];
    const errors = { field1: 'Error' };
    expect(isEnableSubmitButton(requiredFields, dirtyFields, errors)).toBe(
      false,
    );
  });
});

describe('getDirtyState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true for identical objects', () => {
    const baseObject = { field1: 'value1', field2: 'value2' };
    const targetObject = { field1: 'value1', field2: 'value2' };
    expect(getDirtyState(baseObject, targetObject)).toBe(true);
  });

  it('should return false for objects with different values', () => {
    const baseObject = { field1: 'value1', field2: 'value2' };
    const targetObject = { field1: 'value1', field2: 'different' };
    expect(getDirtyState(baseObject, targetObject)).toBe(false);
  });

  it('should return false if target object has extra fields', () => {
    const baseObject = { field1: 'value1' };
    const targetObject = { field1: 'value1', field2: 'value2' };
    expect(getDirtyState(baseObject, targetObject)).toBe(false);
  });
});

describe('eventSchema', () => {
  it('should validate with correct data', () => {
    const data = {
      title: 'Event Title',
      location: 'Location',
      people: 'Person',
    };
    expect(() => eventSchema.parse(data)).not.toThrow();
  });

  it('should throw an error if title is empty', () => {
    const data = { title: '', location: 'Location', people: 'Person' };
    expect(() => eventSchema.parse(data)).toThrow(
      MESSAGES.ERROR.FIELD_REQUIRED,
    );
  });
});

describe('customerFormSchema', () => {
  it('should validate with correct data', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'male',
      job: 'Engineer',
      address: '123 Main St, Anytown, USA',
      avatar: 'avatar.jpg',
    };
    expect(() => customerFormSchema.parse(data)).not.toThrow();
  });

  it('should throw an error if firstName is empty', () => {
    const data = {
      firstName: '',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'male',
      avatar: 'avatar.jpg',
    };
    expect(() => customerFormSchema.parse(data)).toThrow(
      MESSAGES.ERROR.FIELD_REQUIRED,
    );
  });

  it('should throw an error if email is invalid', () => {
    const data = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      phone: '1234567890',
      gender: 'male',
      avatar: 'avatar.jpg',
    };
    expect(() => customerFormSchema.parse(data)).toThrow(
      MESSAGES.ERROR.FIELD_INVALID('Email Address'),
    );
  });
});

describe('signInSchema', () => {
  it('should validate with correct data', () => {
    const data = { identifier: 'user@example.com', password: 'ValidPass123!' };
    expect(() => signInSchema.parse(data)).not.toThrow();
  });

  it('should throw an error if identifier is not an email', () => {
    const data = { identifier: 'user', password: 'ValidPass123!' };
    expect(() => signInSchema.parse(data)).toThrow(
      MESSAGES.ERROR.EMAIL_INVALID,
    );
  });

  it('should throw an error if password is invalid', () => {
    const data = { identifier: 'user@example.com', password: 'short' };
    expect(() => signInSchema.parse(data)).toThrow(
      MESSAGES.ERROR.GENERAL_INVALID_PASSWORD,
    );
  });
});

describe('productFormSchema', () => {
  it('should throw an error for missing title', () => {
    const invalidData = {
      ...MOCK_PRODUCTS[0],
      title: '',
    };

    expect(() => productFormSchema.parse(invalidData)).toThrow(
      MESSAGES.ERROR.FIELD_REQUIRED,
    );
  });

  it('should throw an error for invalid brand', () => {
    const invalidData = {
      ...MOCK_PRODUCTS[0],
      brand: 'unknownBrand',
    };

    expect(() => productFormSchema.parse(invalidData)).toThrow(
      MESSAGES.ERROR.FIELD_REQUIRED,
    );
  });

  it('should throw an error for empty imageUrl', () => {
    const invalidData = {
      ...MOCK_PRODUCTS[0],
      imageUrl: '',
      price: '555',
    };

    expect(() => productFormSchema.parse(invalidData)).toThrow(
      MESSAGES.ERROR.FIELD_REQUIRED,
    );
  });

  it('should throw an error for description exceeding maximum length', () => {
    const invalidData = {
      ...MOCK_PRODUCTS[0],
      description: 'a'.repeat(10001),
    };

    expect(() => productFormSchema.parse(invalidData)).toThrow(
      MESSAGES.ERROR.FIELD_INVALID('Description'),
    );
  });
});
