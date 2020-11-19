import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    accent: string;
    main: string;
    background: string;
    light: string;
    dark: string;
    border: string;
    borderRadius: string;
  }
}
