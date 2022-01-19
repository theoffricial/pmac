declare module 'openapi-to-postmanv2' {
    export type convert = (...args: any[]) => any;
    export type OA3ToPMInputOptions =
      | {
          type: 'file';
          data: string;
        }
      | {
          type: 'json';
          data: any;
        };
  }

  export = 'openapi-to-postmanv2';

