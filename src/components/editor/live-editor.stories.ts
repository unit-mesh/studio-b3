import type { Meta, StoryObj } from '@storybook/react';

import LivingEditor from '@/components/editor/live-editor';

const meta = {
  title: 'Editor/Live Editor',
  component: LivingEditor,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LivingEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

