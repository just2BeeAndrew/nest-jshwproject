import {pipesSetup } from './pipes.setup';
import {INestApplication} from '@nestjs/common';
import {globalPrefixSetup} from './global-prefix.setup';
import {swaggerSetup} from './swagger.setup';
import { globalFiltersSetup } from './global-filters.setup';

export function appSetup(app: INestApplication) {
  pipesSetup(app);
  globalPrefixSetup(app)
  globalFiltersSetup(app)
  swaggerSetup(app)
}