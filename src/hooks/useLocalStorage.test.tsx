import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';
describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );
    expect(result.current[0]).toBe('defaultValue');
  });

  it('should update value in localStorage when state changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    );

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(localStorage.getItem('testKey')).toBe(JSON.stringify('newValue'));
  });

  it('should retrieve existing value from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify('existingValue'));

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );
    expect(result.current[0]).toBe('existingValue');
  });

  it('should handle localStorage errors gracefully', () => {
    const mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockGetItem = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('getItem error');
      });

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    );

    expect(result.current[0]).toBe('defaultValue');
    expect(mockConsoleError).toHaveBeenCalled();

    mockConsoleError.mockRestore();
    mockGetItem.mockRestore();
  });
});
