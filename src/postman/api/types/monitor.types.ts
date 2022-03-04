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

