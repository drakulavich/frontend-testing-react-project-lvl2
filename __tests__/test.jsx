// @ts-check

import '@testing-library/jest-dom';

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoApp from '@hexlet/react-todo-app-with-backend';

it('should render list on the page', async () => {
  render(<TodoApp />);

  await waitFor(() => screen.getByRole('list'));
  // screen.debug();
});