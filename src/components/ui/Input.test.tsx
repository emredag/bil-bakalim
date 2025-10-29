import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input, Textarea } from './Input';

describe('Input', () => {
  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Name" />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Input label="Username" error="Username is required" />);
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Input helperText="Must be at least 3 characters" />);
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });

    it('should not render helper text when error is present', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
      expect(screen.queryByText(/helper text/i)).not.toBeInTheDocument();
    });

    it('should render with icon', () => {
      render(<Input icon={<span data-testid="icon">🔍</span>} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render full width', () => {
      const { container } = render(<Input fullWidth />);
      const wrapper = container.querySelector('div');
      expect(wrapper?.className).toContain('w-full');
    });

    it('should add padding when icon is present', () => {
      render(<Input icon={<span>🔍</span>} />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('pl-12');
    });
  });

  describe('Interactions', () => {
    it('should accept text input', async () => {
      const user = userEvent.setup();
      render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText(/type here/i);

      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenCalledTimes(4); // Once per character
    });

    it('should handle focus and blur', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      await user.tab();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Input disabled value="" />);
      const input = screen.getByRole('textbox');

      expect(input).toBeDisabled();
      await user.type(input, 'test');
      expect(input).toHaveValue('');
    });

    it('should handle controlled input', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Input value="initial" readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('initial');

      rerender(<Input value="updated" readOnly />);
      expect(input).toHaveValue('updated');
    });
  });

  describe('Accessibility - PRD 16.3', () => {
    it('should associate label with input', () => {
      render(<Input label="Email Address" id="email" />);
      const input = screen.getByLabelText(/email address/i);
      expect(input).toHaveAttribute('id', 'email');
    });

    it('should generate unique ID when not provided', () => {
      render(<Input label="Field 1" />);
      const input = screen.getByLabelText(/field 1/i);
      expect(input).toHaveAttribute('id');
      expect(input.id).toBeTruthy();
    });

    it('should set aria-invalid when error is present', () => {
      render(<Input error="Invalid input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not set aria-invalid when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should associate error message with input', () => {
      render(<Input id="test" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-error');
      expect(screen.getByText(/error message/i)).toHaveAttribute('id', 'test-error');
    });

    it('should associate helper text with input', () => {
      render(<Input id="test" helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-helper');
      expect(screen.getByText(/helper text/i)).toHaveAttribute('id', 'test-helper');
    });

    it('should have keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Input placeholder="Field 1" />
          <Input placeholder="Field 2" />
        </div>
      );

      const field1 = screen.getByPlaceholderText(/field 1/i);
      const field2 = screen.getByPlaceholderText(/field 2/i);

      field1.focus();
      expect(field1).toHaveFocus();

      await user.tab();
      expect(field2).toHaveFocus();
    });

    it('should have focus ring styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('focus:ring-2');
      expect(input.className).toContain('focus:ring-blue-500');
    });
  });

  describe('Error States', () => {
    it('should show error border color', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-status-error');
    });

    it('should show normal border when no error', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-slate-700');
    });

    it('should display error icon', () => {
      const { container } = render(<Input error="Error message" />);
      const errorElement = container.querySelector('[role="alert"]');
      const svg = errorElement?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('custom-class');
    });

    it('should accept native input props', () => {
      render(<Input type="email" placeholder="Email" maxLength={50} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Email');
      expect(input).toHaveAttribute('maxLength', '50');
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Input value="" readOnly />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });

    it('should handle very long error messages', () => {
      const longError = 'This is a very long error message '.repeat(10);
      render(<Input error={longError} />);
      // Use getByRole with partial text match
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toContain('This is a very long error message');
    });

    it('should handle special characters in input', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');

      await user.type(input, '!@#$%^&*()');
      expect(input).toHaveValue('!@#$%^&*()');
    });

    it('should handle rapid typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'quicktext', { delay: 1 });

      expect(input).toHaveValue('quicktext');
      expect(handleChange).toHaveBeenCalledTimes(9);
    });
  });
});

describe('Textarea', () => {
  describe('Rendering', () => {
    it('should render textarea field', () => {
      render(<Textarea placeholder="Enter text" />);
      expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Textarea label="Description" />);
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('should render required indicator', () => {
      render(<Textarea label="Comments" required />);
      expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<Textarea error="Description is required" />);
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<Textarea helperText="Max 500 characters" />);
      expect(screen.getByText(/max 500 characters/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should accept multiline text input', async () => {
      const user = userEvent.setup();
      render(<Textarea placeholder="Type here" />);
      const textarea = screen.getByPlaceholderText(/type here/i);

      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');
      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);

      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      render(<Textarea disabled value="" />);
      const textarea = screen.getByRole('textbox');

      expect(textarea).toBeDisabled();
      await user.type(textarea, 'test');
      expect(textarea).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with textarea', () => {
      render(<Textarea label="Message" id="message" />);
      const textarea = screen.getByLabelText(/message/i);
      expect(textarea).toHaveAttribute('id', 'message');
    });

    it('should set aria-invalid when error is present', () => {
      render(<Textarea error="Invalid input" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should have focus ring styles', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('focus:ring-2');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('custom-textarea');
    });

    it('should accept native textarea props', () => {
      render(<Textarea rows={5} maxLength={100} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '5');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });

    it('should forward ref', () => {
      const ref = vi.fn();
      render(<Textarea ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
