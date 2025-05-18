import { count } from "console";
import React from "react";
import { fusionClient } from "~/server/fusionClient";


async function getData() {
  const data = await fusionClient.retrieveUserByEmail("ck423.200@gmail.com");

  console.log("Data: ", data);
  return data;
}

export default async function Test() {
//   const posts = await fusionGetUserByEmail("ck423.200@gmail.com");
//   console.log("Posts: ", posts);
//   console.log("Posts: ", typeof posts);

const data = await getData();
  console.log("Data1: ", data);

  return <div>Hi</div>;
}
