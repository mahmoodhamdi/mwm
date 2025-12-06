/**
 * useClickOutside Hook Tests
 */

import { renderHook, act } from '@testing-library/react';
import { useClickOutside } from '../useClickOutside';

describe('useClickOutside', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should return a ref object', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    expect(result.current).toHaveProperty('current');
    expect(result.current.current).toBeNull();
  });

  it('should add mousedown and touchstart event listeners', () => {
    const handler = jest.fn();
    renderHook(() => useClickOutside(handler));

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('should remove event listeners on unmount', () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() => useClickOutside(handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('should call handler when clicking outside the element', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(handler));

    // Create a mock element
    const element = document.createElement('div');
    const outsideElement = document.createElement('div');
    document.body.appendChild(element);
    document.body.appendChild(outsideElement);

    // Set the ref
    Object.defineProperty(result.current, 'current', {
      value: element,
      writable: true,
    });

    // Simulate click outside
    const mouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mouseEvent, 'target', { value: outsideElement });

    act(() => {
      document.dispatchEvent(mouseEvent);
    });

    expect(handler).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(element);
    document.body.removeChild(outsideElement);
  });

  it('should not call handler when clicking inside the element', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(handler));

    // Create a mock element with a child
    const element = document.createElement('div');
    const childElement = document.createElement('span');
    element.appendChild(childElement);
    document.body.appendChild(element);

    // Set the ref
    Object.defineProperty(result.current, 'current', {
      value: element,
      writable: true,
    });

    // Simulate click inside (on child)
    const mouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mouseEvent, 'target', { value: childElement });

    act(() => {
      document.dispatchEvent(mouseEvent);
    });

    expect(handler).not.toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(element);
  });

  it('should handle touch events', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(handler));

    // Create mock elements
    const element = document.createElement('div');
    const outsideElement = document.createElement('div');
    document.body.appendChild(element);
    document.body.appendChild(outsideElement);

    // Set the ref
    Object.defineProperty(result.current, 'current', {
      value: element,
      writable: true,
    });

    // Simulate touch outside
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(touchEvent, 'target', { value: outsideElement });

    act(() => {
      document.dispatchEvent(touchEvent);
    });

    expect(handler).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(element);
    document.body.removeChild(outsideElement);
  });

  it('should not call handler if ref is null', () => {
    const handler = jest.fn();
    renderHook(() => useClickOutside(handler));

    // Simulate click when ref is null (default state)
    const mouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    act(() => {
      document.dispatchEvent(mouseEvent);
    });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should update handler when it changes', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const { rerender, result } = renderHook(
      ({ handler }) => useClickOutside<HTMLDivElement>(handler),
      { initialProps: { handler: handler1 } }
    );

    // Create mock elements
    const element = document.createElement('div');
    const outsideElement = document.createElement('div');
    document.body.appendChild(element);
    document.body.appendChild(outsideElement);

    // Set the ref
    Object.defineProperty(result.current, 'current', {
      value: element,
      writable: true,
    });

    // Update handler
    rerender({ handler: handler2 });

    // Simulate click outside
    const mouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(mouseEvent, 'target', { value: outsideElement });

    act(() => {
      document.dispatchEvent(mouseEvent);
    });

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(element);
    document.body.removeChild(outsideElement);
  });
});
