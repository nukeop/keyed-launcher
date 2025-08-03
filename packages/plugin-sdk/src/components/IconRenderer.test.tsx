import { CommandIcon } from '../types';
import { IconRenderer } from './IconRenderer';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('IconRenderer', () => {
  it('renders emoji icons correctly', () => {
    const iconContent = { type: 'emoji' as const, emoji: '🚀' };
    render(<IconRenderer icon={iconContent} />);

    expect(screen.getByTestId('emoji-icon')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('renders base64 icons correctly', () => {
    const iconContent = {
      type: 'base64' as const,
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    };
    render(<IconRenderer icon={iconContent} />);

    const icon = screen.getByTestId('base64-icon');
    expect(icon).toBeInTheDocument();
  });

  it('renders named icons with default gradient', () => {
    const icon: CommandIcon = {
      type: 'named' as const,
      name: 'Heart',
      variant: 'gradient',
    };
    const { container } = render(<IconRenderer icon={icon} />);

    const wrapper = container.querySelector('div');
    expect(wrapper).toBeTruthy();
    expect(wrapper?.className).toContain('bg-gradient-to-br');
    expect(wrapper?.className).toContain('from-indigo-500');
    expect(wrapper?.className).toContain('to-purple-600');
  });

  it('renders named icons with custom gradient', () => {
    const icon: CommandIcon = {
      type: 'named' as const,
      name: 'Heart',
      variant: 'gradient',
      gradient: { from: 'red-500', to: 'pink-500' },
    };
    render(<IconRenderer icon={icon} />);

    const wrapper = screen.getByTestId('named-icon');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain('bg-gradient-to-br');
    expect(wrapper?.className).toContain('from-red-500');
    expect(wrapper?.className).toContain('to-pink-500');
  });

  it('renders fallback for invalid named icon', () => {
    const icon: CommandIcon = {
      type: 'named' as const,
      variant: 'bare',
      name: 'NonExistentIcon',
    };
    render(<IconRenderer icon={icon} />);

    const wrapper = document.querySelector('svg');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.classList).toContain(
      'lucide',
      'lucide-circle',
      'text-white',
      'h-5',
      'w-5',
    );
  });

  it('does not render arbitrary strings', () => {
    const iconString = 'https://example.com/icon.png';
    render(<IconRenderer icon={iconString} />);

    const icon = screen.queryByTestId('base64-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('returns null for undefined icon', () => {
    const { container } = render(<IconRenderer icon={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
