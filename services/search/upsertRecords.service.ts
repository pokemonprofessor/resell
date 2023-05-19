// Import the Search.io SDK.
import path from "path";
import {
  RecordsClient,
  withEndpoint,
  withKeyCredentials,
} from "@sajari/sdk-node";
import { recordsFromCSV } from "./csv-util";
import program, { withDefaultOptions } from "./program";
import { handleError } from "./api-util";
import { getAll } from "../helper/crud";
const { BuyableProduct } = require("../../models/product.model");

withDefaultOptions(program);

program.parse(process.argv);

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  skills: string[];
  latitude: number;
  longitude: number;
  positions_available: number;
  updated: Date;
}

const UpsertRecordService = async (
  array,
  endpoint = program.opts().endpoint,
  collectionId = program.opts().collectionId,
  keyId = program.opts().keyId,
  keySecret = program.opts().keySecret,

  pipeline = {
    name: program.opts().pipeline,
    version: program.opts().version,
  }
) => {
  try {
    const client = new RecordsClient(
      collectionId,
      withEndpoint(endpoint),
      withKeyCredentials(keyId, keySecret)
    );
    if (array.length !== 0) {
      try {
        let records = recordCreation(JSON.parse(JSON.stringify(array)));
        const resp = await client.batchUpsertRecords({
          pipeline,
          records,
        });
        console.log('rese12'+JSON.stringify(resp))

        return [null, records.length];
      } catch (e) {
        console.log('eeerere',e)

        console.log(e);
      }
    } else {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      let arr = await BuyableProduct.find(
        {} // createdAt: { $gte: startOfToday }, SellerId: { $ne: "" } },
      );

      const records = recordCreation(JSON.parse(JSON.stringify(arr)));
      arr = null;

      const response = await splitArrayIntoChunksOfLen(
        client,
        pipeline,
        records,
        200
      ); //split into chunks of 200
      return [null, ` Records created.`];
    }
  } catch (e) {
    console.error(e);
  }
};

async function splitArrayIntoChunksOfLen(client, pipeline, arr, len) {
  let chunks = [],
    i = 0,
    n = arr.length;
  let resp = [];
  while (i < n) {
    let records = arr.slice(i, (i += len));
    try {
      resp.push(
        client.batchUpsertRecords({
          pipeline,
          records,
        })
      );
    } catch (e) {
      console.log(e);
    }
  }
  await Promise.all(resp).catch((e) => console.error(e));
  return true;
}

function recordCreation(records) {
  for (let p of records) {
    p.id = p._id.toString();
    p.published_time = new Date();;
    delete p._id;
    delete  p.taxCode;
    delete  p.productId;
    delete  p.lengthUnit;
    delete  p.__v;
    delete p.createdAt;
    delete p.updatedAt;
  }
  return records;
}

export default UpsertRecordService;
