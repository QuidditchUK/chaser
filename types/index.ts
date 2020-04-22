interface Data {
  body: Record<string, any>;
  meta_description: any;
  meta_title: any;
  meta_image: any;
}

export type Posts = Record<string, any>[];

export interface Page {
  page: {
    [key: string]: Data;
  };
  posts: Posts;
}
