// Libs
import type { Preview } from '@storybook/react';
import React, { useEffect } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import { NextUIProvider } from '@nextui-org/system';
import { SessionProvider } from 'next-auth/react';

// Themes
import { colors } from '../src/themes';

// Constants
import { DM_SANS_FONT } from '../src/constants';

// Style
import '../src/styles/index.css';

const { white, black } = colors;

interface ColorModeProps {
  colorMode: 'light' | 'dark';
  children: JSX.Element;
}

const ColorMode = (props: ColorModeProps) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(props.colorMode);
  }, [props.colorMode]);

  return props.children;
};

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: white },
        { name: 'dark', value: black },
      ],
    },
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      router: {
        basePath: '/',
      },
    },
  },
  decorators: [
    (Story, context) => {
      const backgroundMode =
        context.globals.colorMode === 'dark' ? 'dark' : 'light';
      context.parameters.backgrounds.default = backgroundMode;

      return (
        <NextUIProvider>
          <ColorMode colorMode={context.globals.colorMode}>
            <ThemeProvider
              attribute="class"
              defaultTheme={context.globals.colorMode}
            >
              <SessionProvider>
                <div className={`${DM_SANS_FONT.variable} font-dm-sans`}>
                  <Story />
                </div>
              </SessionProvider>
            </ThemeProvider>
          </ColorMode>
        </NextUIProvider>
      );
    },
  ],
};

export const globalTypes = {
  colorMode: {
    name: 'Color Mode',
    defaultValue: 'light',
    toolbar: {
      items: [
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
      ],
      dynamicTitle: true,
    },
  },
};

export default preview;
