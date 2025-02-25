"use strict"

/** 
 * Required Attributes
 */
const required = {
  topic       : "auth",
  method      : "post",
  route       : "/login/email",
  name        : "loginEmailPassword",
  requestAVRO : [
    { name: "email", type: "string" }
  ],
  responseAVRO: [
    { name: "password", type: "string" }
  ],
  errorAVRO:[
    { name: "error", type: "string" }
  ]
}

const optional = {
  /**
   * Defaults to (ctx)=>ctx
   * One transformer is fine this is
   * just an example of chaining.
   */
  requestTransformers : [
    ( ctx ) => ctx.request.body.firstName,
    ( firstName )=> requestAVRO
  ],
  /**
   * Defaults to (responseAVRO)=>responseAVRO
   * One transformer is fine this is
   * just an example of chaining.
   */
  responseTransformers: [ // Optional
    ( responseAVRO ) => ( responseAVRO.response ),
    ( response ) => ( { lastName: response } )
  ]
}

module.exports = Object.assign( {}, required, optional )
// -- ESNext --
export default { ...required, ...optional }