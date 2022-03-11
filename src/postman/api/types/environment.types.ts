export interface PostmanEnvironment {
    id: string;
    name: string;
    owner: string;
    /** UTC format */
    createdAt: string;
    /** UTC format */
    updatedAt: string;
    values: PostmanEnvironmentValue[];
    isPublic: boolean;
  }

export interface PostmanEnvironmentMetadata {
    id: string;
    name: string;
    uid: string;
    owner: string;
  }

export type PostmanEnvironmentMinMetadata = Omit<
    PostmanEnvironmentMetadata,
    'owner'
  >;

export type PMEnvironmentId = PostmanEnvironmentMetadata

export interface PostmanEnvironmentValue {
  key: string;
  value: string | number;
  type: PostmanEnvironmentValueType;
  enabled: boolean;
}

export enum PostmanEnvironmentValueType {
  Text = 'text',
  Secret = 'secret'
}

