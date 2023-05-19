import * as commander from "commander";
import config from "../../config";

const program = new commander.Command();
const {keyId, keySecret, collectionId, pipeline, version} = config.get("searchIO")

program.version("0.0.1");

const defaultEndpoint = "https://api.search.io";

export const withAccountOptions = (p: commander.Command) =>
  p
    .option(
      "-e, --endpoint <endpoint>",
      "API endpoint",
      process.env.ENDPOINT || defaultEndpoint
    )
    .requiredOption(
      "-k, --key-id <key_id>",
      "account key ID",
      keyId
    )
    .requiredOption(
      "-s, --key-secret <key_secret>",
      "account key secret",
      keySecret
    );

export const withDefaultOptions = (p: commander.Command) =>
  p
    .option(
      "-e, --endpoint <endpoint>",
      "API endpoint",
      process.env.ENDPOINT || defaultEndpoint
    )
    .option(
      "--pipeline-name <pipeline_name>",
      "pipeline name",
      pipeline
    )
    .option(
      "--pipeline-version <pipeline_version>",
      "pipeline version",
      version
    )
    .requiredOption(
      "-c, --collection-id <collection_id>",
      "collection ID",
      collectionId
    )
    .requiredOption(
      "-k, --key-id <key_id>",
      "account or collection key ID",
      keyId
    )
    .requiredOption(
      "-s, --key-secret <key_secret>",
      "account or collection key secret",
      keySecret
    );

export const withPaginationOptions = (p: commander.Command) =>
  p
    .requiredOption<number>(
      "--page-size <page_size>",
      "page size",
      (value: string, previous: number) => {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed)) {
          throw new Error(
            `error: option '--page-size ${value}' argument is invalid`
          );
        }
        return parsed;
      },
      20
    )
    .requiredOption("--page-token <page_token>", "page token", "");

export const withPipelineView = (p: commander.Command) =>
  p.requiredOption<"basic" | "full">(
    "--pipeline-view <view>",
    "view of the pipelines to retrieve, one of: basic, full",
    (value: string) => {
      if (!(value === "basic" || value === "full")) {
        throw new Error(
          `error: option '--pipeline-view ${value}' argument is invalid`
        );
      }
      return value;
    },
    "basic"
  );

export default program;
