export interface ITempProducts extends Document {
    batchId: string;
    data: Array<any>;
    isSucceffullyUploaded: boolean;
    progress: String;
  }
  