import {AbstractSubjectResolver} from "./subjects/abstract.subject.resolver";

export const SUBJECT_RESOLVER = 'SUBJECT_RESOLVER';

export interface ISubjectResolver {
  getSubjectResolvers(): AbstractSubjectResolver[];
}
