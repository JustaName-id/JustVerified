export const TIME_GENERATOR = 'TIME_GENERATOR';

export interface TimeGenerator {
  generate(): Date;
  generateWithOffset(offset: number, unit: 'days' | 'months' | 'years'): Date;
  generateNow(): string;
  generateWithOffsetString(offset: number): string;
}
