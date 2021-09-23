import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a Service Worker with the given request handlers.
// eslint-disable-next-line import/prefer-default-export
export const server = setupServer(...handlers);
