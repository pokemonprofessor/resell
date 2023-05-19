import {
  CollectionsClient,
  withEndpoint,
  withKeyCredentials,
} from "@sajari/sdk-node";

import program, { withDefaultOptions } from "./program";
import { handleError } from "./api-util";

withDefaultOptions(program);

program.parse(process.argv);

async function GetSearchService(
  query,
  endpoint = program.opts().endpoint,
  collectionId = program.opts().collectionId,
  keyId = program.opts().keyId,
  keySecret = program.opts().keySecret,
  pipeline = {
    name: program.opts().pipeline,
    version: program.opts().version,
  }
) {
  try {
    const client = new CollectionsClient(
      withEndpoint(endpoint),
      withKeyCredentials(keyId, keySecret)
    );

    const resp = await client.queryCollection(collectionId, {
      variables: {
        q: query,
        filter: "_id != ''" as any,
        resultsPerPage: "30" as any
      },
      pipeline,
    });
    // return resp.results;
    return [null, { category: query, result: resp.results }];
  } catch (e) {
    handleError(e);
  }
}

export default GetSearchService;
