/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
// @ts-check

import '@testing-library/jest-dom';

import React from 'react';
import {
  render, screen, waitFor, within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TodoApp from '@hexlet/react-todo-app-with-backend';
// eslint-disable-next-line jest/no-mocks-import
import { server } from '../__mocks__/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const addList = async (listName) => {
  const newListInput = screen.getByLabelText('New list');

  userEvent.type(newListInput, listName);
  userEvent.click(screen.getByRole('button', { name: /add list/i }));

  await screen.findByRole('button', { name: listName });
};

const addTask = async (taskText) => {
  const newTaskInput = screen.getByLabelText('New task');

  userEvent.type(newTaskInput, taskText);
  userEvent.click(screen.getByRole('button', { name: 'Add' }));

  await screen.findByRole('checkbox', { name: taskText });
};

beforeEach(async () => {
  render(<TodoApp />);

  await addList('primary list');
});

it('should add tasks to the different lists', async () => {
  const taskName = 'task uno';
  const listName = 'dos list';

  await addTask(taskName);

  await addList(listName);
  userEvent.click(screen.getByRole('button', { name: listName }));
  await waitFor(() => {
    expect(screen.queryByText(taskName)).not.toBeInTheDocument();
  });

  await addTask('task two');
});

it('should not add the same task twice', async () => {
  const taskName = 'repeat task';

  await addTask(taskName);
  await addTask(taskName);

  expect(screen.queryByText(`${taskName} already exists`)).toBeInTheDocument();

  const taskItems = [...within(screen.getByTestId('tasks')).getAllByRole('listitem')];
  expect(taskItems).toHaveLength(1);
});

it('should not add the same list twice', async () => {
  const listName = 'primary list';
  await addList(listName);

  expect(screen.queryByText(`${listName} already exists`)).toBeInTheDocument();

  const listItems = [...within(screen.getByTestId('lists')).getAllByRole('listitem')];
  expect(listItems).toHaveLength(1);
});

it('should not add empty task', async () => {
  userEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(await screen.findByText('Required!')).toBeInTheDocument();
});

it('should not add empty list', async () => {
  userEvent.click(screen.getByRole('button', { name: /add list/i }));

  expect(await screen.findByText('Required!')).toBeInTheDocument();
});

it('should create tasks, finish them and remove', async () => {
  // Add tasks
  const taskNames = ['first', 'second, third'];
  for (const task of taskNames) {
    await addTask(task);
  }

  // Change task state
  const taskToClick = taskNames[1];
  const checkBox = await screen.findByRole('checkbox', { name: taskToClick });
  userEvent.click(checkBox);
  await waitFor(() => {
    expect(screen.queryByRole('checkbox', { name: taskToClick })).toBeChecked();
  });

  // Remove task
  const taskItems = [...within(screen.getByTestId('tasks')).getAllByRole('listitem')];
  const taskItemToRemove = taskItems.find((item) => within(item).queryByText(taskToClick));
  userEvent.click(within(taskItemToRemove).getByRole('button', { name: 'Remove' }));
  await waitFor(() => {
    expect(screen.queryByText(taskToClick)).not.toBeInTheDocument();
  });
});

it('should delete list', async () => {
  const taskOne = 'task one';
  const taskTwo = 'task two';
  const listName = 'secondary list';

  await addTask(taskOne);
  await addList(listName);
  userEvent.click(screen.getByRole('button', { name: listName }));
  await waitFor(() => {
    expect(screen.queryByText(taskOne)).not.toBeInTheDocument();
  });

  await addTask(taskTwo);

  // Remove list
  const listItems = [...within(screen.getByTestId('lists')).getAllByRole('listitem')];
  const listItemToRemove = listItems.find((item) => within(item).queryByText(listName));
  userEvent.click(within(listItemToRemove).getByRole('button', { name: 'remove list' }));
  await waitFor(() => {
    expect(screen.queryByText(listName)).not.toBeInTheDocument();
    expect(screen.queryByText(taskTwo)).not.toBeInTheDocument();
  });
});
