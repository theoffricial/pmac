export interface PostmanEnvironment {
  id: string;
  name: string;
  owner: string;
  /** UTC format */
  createdAt: string;
  /** UTC format */
  updatedAt: string;
  values: {
    key: string;
    value: string | number;
    type: 'text' | 'secret'
    enabled: boolean;
  }[];
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

export interface PostmanMock {
  id: string;
  owner: string;
  uid: string;
  collection: string;
  environment: string;
  mockUrl: string;
  name: string;
  config: {
    headers: [];
    matchBody: boolean;
    matchQueryParams: boolean;
    matchWildcards: boolean;
    delay: null | number;
  };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}
export interface PostmanMonitor {
  id: string;
  uid: string;
  owner: string;
  name: string;
  schedule: {
    cron: string;
    timezone: string;
  };
  collection: string;
  environment: string;
}
export interface PostmanMonitorRunResponse {
  run: {
    info: {
      jobId: string;
      monitorId: string;
      name: string;
      collectionUid: string;
      status: 'success';
      startedAt: string;
      finishedAt: string;
    };
    stats: {
      assertions: {
        total: number;
        failed: number;
      };
      requests: {
        total: number;
        failed: number;
      };
    };
    executions: {
      id: number;
      item: {
        id: string;
        name: string;
      };
      request: {
        method: 'POST' | 'GET' | 'PATCH' | 'DELETE' | 'PUT';
        url: string;
        headers: {
          [headerName: string]: string;
        };
        body: any;
        timestamp: string;
      };
      response: {
        code: number;
        body: any;
        responseTime: number;
        responseSize: number;
        headers: {
          [headerName: string]: string;
        };
      };
    }[];
    failures: [];
  };
}

export type PostmanMonitorMetadata = Pick<
  PostmanMonitor,
  'id' | 'uid' | 'name' | 'owner'
>;
