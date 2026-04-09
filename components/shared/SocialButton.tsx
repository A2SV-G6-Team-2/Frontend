import { type IconProps } from '@tabler/icons-react';
import React from 'react';
import { Button, type ButtonVariant } from '../ui/button';

interface SocialButtonProps {
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}
export default function SocialButton({
  icon,
  label,
  onClick,
  variant = 'default',
}: SocialButtonProps) {
  const Icon = icon;
  return (
    <Button onClick={onClick} variant={variant}>
      <Icon />
      {label}
    </Button>
  );
}
