import styled from 'styled-components';

export const Sidebar = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
`;

export const SectionHeader = styled.header`
  padding: 0.4rem;
  background: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.light};
  text-align: center;
`;

export const SectionBody = styled.div`
  padding: 0.6rem;
`;

export const SettingField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const SettingTitle = styled.div`
  flex-grow: 1;
`;
