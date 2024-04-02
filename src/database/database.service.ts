import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  async onModuleInit() {
    const start = performance.now();
    await connect(process.env.DB_URI);
    const time = ~~(performance.now() - start);
    console.log(`Connected to db in ${time} ms`);
  }
}
