declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.less' {
  const content: any;
  export default content;
}

interface JSONObject {
  [key: string]: any;
}