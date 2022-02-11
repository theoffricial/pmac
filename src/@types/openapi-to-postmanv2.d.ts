declare module 'openapi-to-postmanv2' {

    function convert(input: OpenApiToPostmanv2Input, options?: any, cb: (...args: any[]) => any): any;

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
