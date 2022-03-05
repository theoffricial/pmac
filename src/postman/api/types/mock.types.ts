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
