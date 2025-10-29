import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

// Mock soundService
vi.mock('../../services', () => ({
  soundService: {
    playClick: vi.fn(),
  },
}));

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should render with primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('from-blue-600');
    });

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-slate-700');
    });

    it('should render with destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('from-red-600');
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      let button = screen.getByRole('button');
      expect(button.className).toContain('px-4');

      rerender(<Button size="md">Medium</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('px-6');

      rerender(<Button size="lg">Large</Button>);
      button = screen.getByRole('button');
      expect(button.className).toContain('px-8');
    });

    it('should render with icon', () => {
      render(
        <Button icon={<span data-testid="icon">🔥</span>}>With Icon</Button>
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText(/with icon/i)).toBeInTheDocument();
    });

    it('should render loading state with spinner', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('should hide icon when loading', () => {
      render(
        <Button loading icon={<span data-testid="icon">🔥</span>}>
          Loading
        </Button>
      );
      expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should play click sound when clicked', async () => {
      const user = userEvent.setup();
      const { soundService } = await import('../../services');
      render(<Button>Click me</Button>);

      await user.click(screen.getByRole('button'));
      expect(soundService.playClick).toHaveBeenCalledTimes(1);
    });

    it('should not play sound when disabled', async () => {
      const user = userEvent.setup();
      const { soundService } = await import('../../services');
      render(<Button disabled>Disabled</Button>);

      await user.click(screen.getByRole('button'));
      expect(soundService.playClick).not.toHaveBeenCalled();
    });

    it('should not play sound when loading', async () => {
      const user = userEvent.setup();
      const { soundService } = await import('../../services');
      render(<Button loading>Loading</Button>);

      await user.click(screen.getByRole('button'));
      expect(soundService.playClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility - PRD 16.3', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Accessible</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have focus-visible styles', () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('focus-visible:ring-2');
    });

    it('should have proper touch target size (min 48x48)', () => {
      render(<Button>Touch me</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('touch-target');
    });

    it('should be announced as disabled by screen readers', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should hide decorative icon from screen readers', () => {
      render(
        <Button icon={<span data-testid="icon">🔥</span>}>With Icon</Button>
      );
      const icon = screen.getByTestId('icon').parentElement;
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('should accept native button props', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Ref</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('should have opacity for disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled:opacity-60');
    });

    it('should have cursor-not-allowed for disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('disabled:cursor-not-allowed');
    });

    it('should have hover styles', () => {
      render(<Button>Hover</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('hover:shadow-xl');
    });

    it('should have active scale animation', () => {
      render(<Button>Active</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('active:scale-95');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      render(<Button>{''}</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle multiple children', () => {
      render(
        <Button>
          <span>First</span>
          <span>Second</span>
        </Button>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('should handle loading and disabled simultaneously', () => {
      render(
        <Button loading disabled>
          Loading & Disabled
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Rapid clicks</Button>);

      const button = screen.getByRole('button');
      await user.tripleClick(button);
      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
