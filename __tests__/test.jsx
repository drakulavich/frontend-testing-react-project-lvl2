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
beforeEach(() => {
  render(<TodoApp />);
});

const addList = async (listName) => {
  const newListInput = screen.getByLabelText('New list');

  userEvent.type(newListInput, listName);
  userEvent.click(screen.getByRole('button', { name: /add list/i }));

  expect(newListInput).toHaveAttribute('readonly');
  expect(await screen.findByRole('button', { name: listName })).toBeInTheDocument();
  expect(newListInput).not.toHaveAttribute('readonly');
};

const addTask = async (taskText) => {
  const newTaskInput = screen.getByLabelText('New task');

  userEvent.type(newTaskInput, taskText);
  userEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(newTaskInput).toHaveAttribute('readonly');
  expect(await screen.findByRole('checkbox', { name: taskText })).toBeInTheDocument();
  expect(newTaskInput).not.toHaveAttribute('readonly');
};

describe('tasks', () => {
  it('can be added to the different lists', async () => {
    const taskName = 'task uno';
    const listName = 'dos list';

    await addList('primary list');
    await addTask(taskName);
    await addList(listName);
    userEvent.click(screen.getByRole('button', { name: listName }));

    await waitFor(() => {
      expect(screen.queryByText(taskName)).not.toBeInTheDocument();
    });
  });

  it('can not be duplicated', async () => {
    const taskName = 'repeat task';
    await addList('primary list');
    await addTask(taskName);
    await addTask(taskName);

    expect(screen.queryByText(`${taskName} already exists`)).toBeInTheDocument();
    const tasksContainer = screen.getByTestId('tasks');
    const taskItems = [...within(tasksContainer).getAllByRole('listitem')];
    expect(taskItems).toHaveLength(1);
  });

  it('can not be empty', async () => {
    userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('Required!')).toBeInTheDocument();
  });

  it('can be created, finished and removed', async () => {
    const taskNames = ['first', 'second, third'];
    await addList('primary list');

    // Add tasks
    for (const task of taskNames) {
      await addTask(task);
    }

    // Change task state
    const taskToClick = taskNames[1];
    const checkBox = screen.getByRole('checkbox', { name: taskToClick });
    userEvent.click(checkBox);
    await waitFor(() => {
      expect(checkBox).toBeChecked();
    });

    // Remove task
    const tasksContainer = screen.getByTestId('tasks');
    const taskItems = [...within(tasksContainer).getAllByRole('listitem')];
    const taskItemToRemove = taskItems.find((item) => within(item).queryByText(taskToClick));
    userEvent.click(within(taskItemToRemove).getByRole('button', { name: 'Remove' }));
    await waitFor(() => {
      expect(taskItemToRemove).not.toBeInTheDocument();
    });
  });
});

describe('lists', () => {
  it('can not be duplicated', async () => {
    const listName = 'primary list';
    await addList(listName);
    await addList(listName);

    expect(screen.queryByText(`${listName} already exists`)).toBeInTheDocument();

    const listsContainer = screen.getByTestId('lists');
    const listItems = [...within(listsContainer).getAllByRole('listitem')];
    expect(listItems).toHaveLength(1);
  });

  it('can not be empty', async () => {
    userEvent.click(screen.getByRole('button', { name: /add list/i }));

    expect(await screen.findByText('Required!')).toBeInTheDocument();
  });

  it('can be deleted', async () => {
    const taskOne = 'task one';
    const taskTwo = 'task two';
    const listName = 'secondary list';

    // Add one task for each list
    await addList('primary list');
    await addTask(taskOne);
    await addList(listName);
    userEvent.click(screen.getByRole('button', { name: listName }));
    await waitFor(() => {
      expect(screen.queryByText(taskOne)).not.toBeInTheDocument();
    });

    await addTask(taskTwo);

    // Remove list
    const listsContainer = screen.getByTestId('lists');
    const listItems = [...within(listsContainer).getAllByRole('listitem')];
    const listItemToRemove = listItems.find((item) => within(item).queryByText(listName));
    userEvent.click(within(listItemToRemove).getByRole('button', { name: 'remove list' }));
    await waitFor(() => {
      expect(screen.queryByText(listName)).not.toBeInTheDocument();
      expect(screen.queryByText(taskTwo)).not.toBeInTheDocument();
    });

    // Create the list again and check tasks
    await addList(listName);
    expect((screen.queryByText('Tasks list is empty'))).toBeInTheDocument();
  });
});
