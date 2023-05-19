import {
  RecordsClient,
  withEndpoint,
  withKeyCredentials,
} from "@sajari/sdk-node";

import program, { withDefaultOptions } from "./program";
import { handleError } from "./api-util";
import GetSearchService from "./getSearch.service";

withDefaultOptions(program);

program.parse(process.argv);

const DeleteRecordService = async (
  endpoint = program.opts().endpoint,
  collectionId = program.opts().collectionId,
  keyId = program.opts().keyId,
  keySecret = program.opts().keySecret
) => {
  try {
    const client = new RecordsClient(
      collectionId,
      withEndpoint(endpoint),
      withKeyCredentials(keyId, keySecret)
    );
    let temp = 0;
    let count = 0;
    let arr = [];
    let x = true;
    while (x) {
      // call get seaech service
      let query = {};
      const result: any = await GetSearchService(query);
      if(result.length == 0) {
        break;
      } else {
        result.map((item) => {
          arr.push(
            client.deleteRecord({
              field: "id",
              value: item.record.id,
            })
          );
        });
  
        await Promise.all(arr)
      }
    }
    return [null, ` Records created.`];
  } catch (e) {
    console.log("adas", e);
    handleError(e);
  }
};

export default DeleteRecordService;
