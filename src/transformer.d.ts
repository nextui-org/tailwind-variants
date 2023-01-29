export type TVTransformer = {
  tsx(content: string): string;
  ts(content: string): string;
  jsx(content: string): string;
  js(content: string): string;
};

export declare const transformer: TVTransformer;
