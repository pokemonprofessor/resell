// Import the Search.io SDK.

import {
  SchemaClient,
  withEndpoint,
  withKeyCredentials,
  SchemaFieldType,
  SchemaFieldMode,
  SchemaField
} from "@sajari/sdk-node";

import program, { withDefaultOptions, withPaginationOptions } from "./program";
import { handleError } from "./api-util";
const process = require("process");

withDefaultOptions(program);
withPaginationOptions(program);
program.parse(process.argv);

// Create a client for working with collections from account key credentials.
// console.log("====================<", program);
const CreateFieldsService = async (
  endpoint = program.opts().endpoint,
  collectionId = program.opts().collectionId,
  keyId = program.opts().keyId,
  keySecret = program.opts().keySecret
) => {
  // Create fields for test collection.
  try {

    console.log("====================<", SchemaField);

    const client = new SchemaClient(
      collectionId,
      withEndpoint(endpoint),
      withKeyCredentials(keyId, keySecret)
    );

    
    const resp = await client.batchCreateFields({
      fields: [
        {
          name: "agegroup",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
          name: "brand",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
          name: "category",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
          name: "color",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
          name: "createdAt",
          description: "",
          type: SchemaFieldType.Timestamp,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
          name: "description",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
          name: "id",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Unique,
          array: false,
          arrayLength: 0,
        },
        {
          name: "image",
          description: "",
          type: SchemaFieldType.String,
          mode: SchemaFieldMode.Nullable,
          array: false,
          arrayLength: 0,
        },
        {
            name: "length",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "listingStatus",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "mpn",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "price",
            description: "",
            type: SchemaFieldType.Float,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "quantity",
            description: "",
            type: SchemaFieldType.Integer,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "rating",
            description: "",
            type: SchemaFieldType.Float,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "ratingCount",
            description: "",
            type: SchemaFieldType.Integer,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "saleprice",
            description: "",
            type: SchemaFieldType.Float,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "sellerId",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "sellerSku",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "size",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "title",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "updatedAt",
            description: "",
            type: SchemaFieldType.Timestamp,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          {
            name: "width",
            description: "",
            type: SchemaFieldType.String,
            mode: SchemaFieldMode.Nullable,
            array: false,
            arrayLength: 0,
          },
          
      ],
    });

    console.log(`fields=${JSON.stringify(resp.fields)}`);
    console.log("errors:");
    for (const { index, ...error } of resp.errors ?? []) {
      console.log(` ${index}=${JSON.stringify(error)}`);
    }
    return [null, `fields for test collection created.`];
  } catch (e) {
    handleError(e);
  }
};

export default CreateFieldsService;
