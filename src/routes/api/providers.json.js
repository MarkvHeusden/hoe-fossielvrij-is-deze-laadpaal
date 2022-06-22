import { InfluxDB } from "@influxdata/influxdb-client";
export const get = async () => {
	const data = await getData();
  // console.log(data)

	return {
		status: 200,
		body: data
	};
};

const INFLUXDB_URL = "https://gc-acc.antst.net";
const INFLUXDB_ORG = "grca";
const INFLUXDB_KEY =
  "QvDOolmSU478M5YkeD17nVeFb4FA_ngo-P0LNokCe6dS2Y10hxIa1zoQ1ZZ9RipKIds-TO7at1-Wgh7Qi44gAQ==";

const client = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_KEY });
const queryApi = client.getQueryApi(INFLUXDB_ORG);

const groupBy = (items, prop) => {
  return items.reduce((out, item) => {
    const value = item[prop];
    out[value] = out[value] || [];
    out[value].push(item);
    return out;
  }, {});
};

export async function getData() {
  const query = `
  from(bucket: "providers")
    |> range(start: -26h, stop: -25h)
    |> filter(fn: (r) => r["_measurement"] == "past_providers")
  `;
  try {
    const rows = await queryApi.collectRows(query);
    const data = Object.entries(groupBy(rows, "_field"));
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
