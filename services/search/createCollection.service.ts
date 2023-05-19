// Import the Search.io SDK.
import { CollectionsClient, withKeyCredentials } from "@sajari/sdk-node";
import config from "../../config";

const { keyId, keySecret } = config.get("searchIO");

// Create a client for working with collections from account key credentials.
const client = new CollectionsClient(
  // withKeyCredentials("account-key-id", "account-key-secret")
  withKeyCredentials(keyId, keySecret)
);

const CreateCollectionService = async (id: string, displayName: string) => {
  // Create a new collection.
  try {
    const collection = await client.createCollection({ id, displayName });
    console.log(`Collection ${collection.displayName} created.`);
    return [null, `Collection ${collection.displayName} created.`];
  } catch (e) {
    console.error(e);
    return [e, null];
  }
};

export default CreateCollectionService;
