/*
* 使用方法
* import { webWork } from '@/utils/index';
*  webWork.postMessage({method: 'echo', args: ['Work']});
*  task.js 里面根据传入的method做不同的处理
* */

export default class WebWorker {
  constructor(worker) {
    const code = worker.toString();
    const blob = new Blob(['('+code+')()']);
    return new Worker(URL.createObjectURL(blob));
  }
}
