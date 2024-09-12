import moment from 'moment';
import {Injectable} from "@nestjs/common";
import { TimeGenerator } from '../../core/applications/time.generator';

@Injectable()
export class DateGenerator implements TimeGenerator {
  generate(): Date {
    return new Date(moment().utc().format());
  }

  generateWithOffset(offset: number, unit: 'days' | 'months' | 'years'): Date {
    return new Date(moment().utc().add(offset, unit).format());
  }

  generateNow(): string {
    return Date.now().toString();
  }

  generateWithOffsetString(offset: number): string {
    return (Date.now() + offset).toString();
  }
}
