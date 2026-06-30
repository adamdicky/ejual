'use client'

import React from 'react'

import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

const ejualTheme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
  headings: {
    fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
    fontWeight: '700',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
})

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <MantineProvider theme={ejualTheme}>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
