/* eslint-disable no-undef */
import { rest } from 'msw';
import getNextId from '../lib/getNextId';

// eslint-disable-next-line import/prefer-default-export
export const handlers = [
  // TASKS
  rest.post('/api/v1/lists/:listId/tasks', (req, res, ctx) => {
    const { listId } = req.params;

    const taskId = getNextId();
    const task = {
      id: taskId,
      listId: parseInt(listId, 10),
      text: req.body.text,
      completed: false,
      touched: Date.now(),
    };
    sessionStorage.setItem(taskId.toString(), JSON.stringify(task));

    return res(
      ctx.status(201),
      ctx.json(task),
    );
  }),

  rest.patch('/api/v1/tasks/:taskId', (req, res, ctx) => {
    const { taskId } = req.params;

    const task = JSON.parse(sessionStorage.getItem(taskId));
    const updatedTask = {
      ...task,
      completed: req.body.completed,
      touched: Date.now(),
    };

    sessionStorage.setItem(taskId, JSON.stringify(updatedTask));
    return res(
      ctx.status(201),
      ctx.json(updatedTask),
    );
  }),

  rest.delete('/api/v1/tasks/:taskId', (req, res, ctx) => {
    const { taskId } = req.params;

    sessionStorage.removeItem(taskId);
    return res(
      ctx.status(204),
    );
  }),

  // LISTS
  rest.post('/api/v1/lists/', (req, res, ctx) => {
    const listId = getNextId();
    const list = {
      id: listId,
      name: req.body.name,
      removable: true,
    };
    sessionStorage.setItem(listId.toString(), JSON.stringify(list));

    return res(
      ctx.status(201),
      ctx.json(list),
    );
  }),
];
