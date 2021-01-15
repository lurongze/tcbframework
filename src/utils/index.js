/* global window */
import request from './request';
import helper from './helper';
import worker from './task';
import WebWorker from './WebWorker';

const webWork = new WebWorker(worker);
export {
  request,
  helper,
  webWork
}
