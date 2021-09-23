/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
// @ts-check

import '@testing-library/jest-dom';

import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoApp from '@hexlet/react-todo-app-with-backend';
// eslint-disable-next-line jest/no-mocks-import
import { server } from '../__mocks__/server';

const tasks = [
  { text: 'first' },
  { text: 'second' },
  { text: 'third' },
];

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(async () => {
  render(<TodoApp />);

  const listName = 'first list';
  const newListInput = screen.getByLabelText('New list');

  userEvent.type(newListInput, listName);
  userEvent.click(screen.getByRole('button', { name: 'add list' }));

  await screen.findByRole('button', { name: listName });
});

it('should create tasks, finish them and remove', async () => {
  const newTaskInput = screen.getByLabelText('New task');

  // Add tasks
  for (const task of tasks) {
    userEvent.type(newTaskInput, task.text);
    userEvent.click(screen.getByRole('button', { name: 'Add' }));

    await screen.findByRole('checkbox', { name: task.text });
  }

  // Change task state
  const taskToClick = 'second';
  const checkBox = await screen.findByRole('checkbox', { name: taskToClick });
  userEvent.click(checkBox);
  await waitFor(() => {
    expect(screen.queryByRole('checkbox', { name: taskToClick })).toBeChecked();
  });

  // Remove task
  const taskItems = [...within(screen.getByTestId('tasks')).getAllByRole('listitem')];
  let removeButton;
  for (const taskItem of taskItems) {
    if (within(taskItem).queryByText(taskToClick)) {
      removeButton = within(taskItem).getByRole('button', { name: 'Remove' });
      break;
    }
  }
  userEvent.click(removeButton);
  await waitFor(() => {
    expect(screen.queryByText(taskToClick)).not.toBeInTheDocument();
  });
});
