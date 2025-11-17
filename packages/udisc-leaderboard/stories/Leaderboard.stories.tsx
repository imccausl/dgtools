import { Meta, StoryObj } from '@storybook/react'
import { Leaderboard } from '../src/index.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient()

const meta: Meta<typeof Leaderboard> = {
  title: 'Leaderboard',
  component: Leaderboard,
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Leaderboard>

export const Default: Story = {}
