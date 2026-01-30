import { PageHeader, PageHeaderProps } from '@arco-design/web-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps extends Omit<PageHeaderProps, 'onBack'> {
  backUrl?: string;
  title: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const navigate = useNavigate();
  const { backUrl } = props;
  return (
    <PageHeader
      {...props}
      onBack={backUrl ? () => navigate(backUrl, { replace: true }) : undefined}
    />
  );
};
