
import * as uuid from 'uuid';
import * as express from 'express';
import * as _ from 'lodash';
import { Context } from '../context';

export class Request<B extends {[key: string]: any}, P extends {[key: string]: any}> {
  
  contextId = this.req.header('x-request-id') || uuid.v4();
  userId = this.req.header('x-user-id') || uuid.v4()

  ctx = new Context();

  get body(): B {
    return this.req.body;
  }

  get params(): P {
    return Object.assign({}, this.req.params, this.req.query || {});
  }

  get meta() {
    return {
      ip: this.req.ip,
      status: this.req.statusCode,
      path: this.req.path,
      proto: this.req.protocol as 'http' | 'https',
      method: this.req.method
    }
  }

  constructor(private req: express.Request) {}
}