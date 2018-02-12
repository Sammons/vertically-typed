import * as uuid from 'uuid';
import { Make } from './logging';

// designed to capture filename
// of file of caller's caller
function captureMakerFile() {
  return new Error().stack.split('\n').slice(2,3)
}

// carries state through a request's lifetime
export class Context {
  constructor(private customId?: string) {}
  makeLogger() {
    return Make([`contextId=${this.id}`, `file=${captureMakerFile()}`])
  }
  id = this.customId || uuid.v4();
}