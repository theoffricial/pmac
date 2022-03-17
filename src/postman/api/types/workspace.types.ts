import {
  PostmanEnvironmentMetadata,
  PostmanMock,
  PostmanMonitor,
} from './index'
import { PostmanCollectionMetadata } from '../wrappers/collections.api'

export interface PostmanWorkspace {
  collections: PostmanCollectionMetadata[];
  environments: PostmanEnvironmentMetadata[];
  mocks: PostmanMock[];
  monitors: PostmanMonitor[];
  description: string;
  id: string;
  name: string;
  type: WorkspaceType;
}

export type PostmanWorkspaceMetadata = Pick<
  PostmanWorkspace,
  'name' | 'id' | 'type'
>;

export type PMWorkspaceId = PostmanWorkspaceMetadata;

export enum WorkspaceType {
  Personal = 'personal',
  Team = 'team',
}

export enum WorkspaceResource {
  Collection = 'collection',
  Environment = 'environment',
  Monitor = 'monitor',
  Mock = 'mock',
}

export const WorkspaceTypeValues = Object.values(WorkspaceType)
