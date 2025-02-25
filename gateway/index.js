// -- ESNext --
import Gateway from "@hodonsky/node-gateway"
import action from "./action"

Gateway.configure({
  mq:{
    username: process.env.MQ_USERNAME,
    password: process.env.MQ_PASSWORD,
    hostname: process.env.MQ_HOSTNAME,
    port    : process.env.MQ_PORT
  },
  port: process.env.PORT
})

new Gateway(action)