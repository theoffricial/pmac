/* eslint-disable camelcase */
export interface PostmanCollectionMetadata {
  id: string;
  owner: string;
  uid: string;
  name: string;
}

export interface PostmanCollectionInfo {
  name: string;
  _postman_id: string;
  description?: string;
  schema: string;
}

export interface PostmanCollection {
  info: PostmanCollectionInfo;
  item: PostmanCollectionItem[];
  variable?: PostmanCollectionVariable[];
  event?: PostmanCollectionItemEvent[];
}

export interface PostmanCollectionCreate {
  info: Omit<PostmanCollectionInfo, '_postman_id'>;
  item: PostmanCollectionItem[];
  variable?: PostmanCollectionVariable[];
  event?: PostmanCollectionItemEvent[];
}

interface PostmanCollectionVariable {
  id?: string;
  key: string;
  value: string | number;
}

interface PostmanCollectionItemEvent {
  listen: string;
  script: {
    id?: string;
    type: string;
    exec: string[];
  };
}

export interface PostmanCollectionItem {
  id?: string;
  name: string;
  item?: PostmanCollectionItem[];
  event?: PostmanCollectionItemEvent[];
  request?: {
    url: {
      path: string[];
      host: string[];
      query: string[];
      variable: string[];
    };
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
    header: { key: string; value: string; description: string }[];
    body?: {
      mode: string | 'formdata';
      formdata?: [];
    };
    description?: string;
  };
  response?: {
    id?: string;
    name: string;
    originalRequest?: {
      url: {
        path: string[];
        host: string[];
        query: string[];
        variable?: string[];
      };
      header: {
        description?: {
          content: string;
          type: string;
        };
        key: string;
        value: string;
      }[];
      method: string;
      body: any;
    };
    status: string;
    code: number;
    header: {
      key: string;
      value: string;
    }[];
    body: any;
    cookie: any[];
    _postman_previewlanguage: string;
  }[];
}
