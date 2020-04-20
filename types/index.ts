interface Data {
  body: Record<string, any>;
}

export interface PageProps {
  data: {
    [key: string]: Data;
  };
}
