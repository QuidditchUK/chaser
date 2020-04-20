interface Data {
  body: Record<string, any>;
  meta_description: any;
  meta_title: any;
  meta_image: any;
}

export interface Page {
  page: {
    [key: string]: Data;
  };
}
