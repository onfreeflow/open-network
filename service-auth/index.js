// -- ESNext --
import Service from "@hodonsky/node-service"

import * as actions from "../actions"
import * as responders from "./consumer"

Service.configure({
  mq:{
    username: process.env.MQ_USERNAME,
    password: process.env.MQ_PASSWORD,
    hostname: process.env.MQ_HOSTNAME,
    port    : process.env.MQ_PORT,
    queue   : "auth"
  }
})

new Service( responders, actions )