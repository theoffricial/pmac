declare module 'openapi-to-postmanv2' {

    function convert(input: OpenApiToPostmanv2Input, options?: any, cb: (...args: any[]) => any): any;

    // eslint-disable-next-line no-warning-comments
    // TODO: Set openapi-to-postmanv2 types lib
    export type OpenApiToPostmanv2Input = {
            type: 'file';
            data: string;
          }
        | {
            type: 'json';
            data: any;
          };
  }
