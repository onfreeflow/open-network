import { EventEmitter, once } from "events"
import {
  createDiffieHellman,
  createHash,
  createCipheriv,
  createDecipheriv
} from "crypto"
import { Socket } from "net"
import { readFileSync } from "fs"

import {
  IFTPTransport,
  IFTPTransportOptions
} from "./interfaces"

const emitter = new EventEmitter()

export class SFTPTransport implements IFTPTransport {
  #connectionConfiguration:IFTPTransportOptions = {
    host    : "localhost",
    port    : 22,
    user    : "",
    pass    : ""
  }
  #connection
  #dh
  #sharedSecret
  #encryptionKey
  #cipher
  #decipher
  uri:string = "sftp://"
  /** 
  * @param {object} config - Configuration for SFTP connection.
  * @param {string} config.host - The SFTP server host (default: localhost)
  * @param {string} config.port - The SFTP server port (default: 22).
  * @param {string} config.username - The SFTP username.
  * @param {string} config.password - The SFTP password.
  */
  constructor({
    host   = "localhost",
    port   = 22,
    user   = "",
    pass   = ""
  }:IFTPTransportOptions){
    this.#connectionConfiguration = {
      host, port, user, pass
    }
    if ( user !== "" && pass === "" ) throw new SyntaxError(`SFTPTransport::constructor:IFTPTransportOptions - Has [user] Missing[pass]`)
    if ( pass !== "" && user === "" ) throw new SyntaxError(`SFTPTransport::constructor:IFTPTransportOptions - Has [pass] Missing[user]`)
    const credentialStr = user !== "" ? `${user}:${pass}@` : ""
    const hostStr = port ? `${host}:${port}` : host 
    this.uri = `sftp://${credentialStr}${hostStr}/`
  }
  async connect(){
    this.#connection = new Socket()
    console.debug("Creating DiffieHellman Algo...")
    const dh = createDiffieHellman(2048)
    console.debug("...completed!")    
    const clientPublicKey = dh.generateKeys()

    await new Promise( ( resolve, reject ) => {
      this.#connection.connect( this.#connectionConfiguration.port, this.#connectionConfiguration.host, resolve )
      this.#connection.on( "error", reject)
    })
    
    this.#connection.write( "SSH-2.0-MySFTPClient\r\n" )
    const serverProtocol:Buffer = await new Promise( resolve => this.#connection.once( "data", resolve ) )
    this.#connection.write( clientPublicKey )
    const serverPublicKey:Buffer = await new Promise( resolve => this.#connection.once( "data", resolve ) )

    // const serverPublicKey:Buffer = await new Promise( ( resolve, reject ) =>{
    //   this.#connection.once( "data", ( key ) => {
    //     try {
    //       resolve( key )
    //     } catch ( e ) {
    //       reject( e )
    //     }
    //   })
    // })
    console.log("SERVER PUBLIC KEY:", serverPublicKey.toString())
    this.#sharedSecret  = dh.computeSecret( serverPublicKey )
    this.#encryptionKey = createHash( "sha256" ).update( this.#sharedSecret ).digest()
    this.#cipher        = createCipheriv("aes-256-ctr", this.#encryptionKey, Buffer.alloc(16, 0));
    this.#decipher      = createDecipheriv( "aes-256-ctr", this.#encryptionKey, Buffer.alloc(16, 0));

    this.#connection.on("data", encryptedData => {
      const decryptedBuffer = this.#decipher.update(encryptedData, "hex", "utf8") + this.#decipher.final("utf8")

      //const packetLength = decryptedBuffer.readUInt32BE(0)
      const type = decryptedBuffer.readUInt8(4)

      switch (type) {
        case 102:{
          const requestId = decryptedBuffer.readUInt32BE(5);      // Request ID (matches your OPEN request)
          const handleLength = decryptedBuffer.readUInt32BE(9);   // Length of the handle string
          const handle = decryptedBuffer.slice(13, 13 + handleLength).toString('utf8');  // File handle
          console.log(`Request[${requestId}]BUFFER TO STRING: `, decryptedBuffer.toString())
          return emitter.emit( "fileHandle", handle )
        }
        case 101:{ // SSH_FXP_STATUS
          return this.#handleStatusResponse( decryptedBuffer )
        }
        default:
          console.error('Unknown packet type:', type);
      }
    })

    this.#authenticate()
    this.#openSubsystem()
  }
  /**
   * Uploads a file via SFTP using the system's sftp command.
   * @param {string} localPath - The path to the local file.
   * @param {string} remotePath - The destination path on the SFTP server.
   * @returns {Promise<{path:string}|void>}
   */
  async uploadFile(localPath:string, remotePath:string):Promise<{path:string}|void>{
    this.#init()
    this.#openForWrite( remotePath )
    const [ fileHandle ] = await once( emitter, "fileHandle")
    this.#writeToFile( fileHandle, 0, readFileSync( localPath ) )
    this.#closeWrite( fileHandle )
  }

  #writeEncrypted( data ):void {
    if ( !this.#sharedSecret ) throw new Error( "SFTPTransport#writeEncrypted: missing [sharedSecret]")
    if ( !this.#encryptionKey ) throw new Error( "SFTPTransport#writeEncrypted: missing [encryptionKey]")
    if ( !this.#cipher ) throw new Error( "SFTPTransport#writeEncrypted: missing [cipher]")
    if ( !this.#decipher ) throw new Error( "SFTPTransport#writeEncrypted: missing [decipher]")
    this.#connection.write( this.#cipher.update(data, 'utf8', 'hex') + this.#cipher.final('hex'), 'hex' )
  }

  #authenticate(){
    this.#writeEncrypted(
      JSON.stringify({ type: "USERAUTH_REQUEST", username: this.#connectionConfiguration.user, password: this.#connectionConfiguration.pass, method: "password", service: "ssh-connection" })
    )
  }
  #openSubsystem(){
    //this.#writeEncrypted( JSON.stringify({ type: "CHANNEL_REQUEST", service: "sftp" }) )
    const channelRequestBuffer = Buffer.alloc( 25 )
    channelRequestBuffer.writeUInt32BE( 21, 0 )
    channelRequestBuffer.writeUInt8( 98, 4 )
    channelRequestBuffer.write( "sftp", 5, "utf8" )

    this.#writeEncrypted( channelRequestBuffer )
  }
  //-------------
  #init(){
    const buff = Buffer.alloc(9)
    buff.writeUInt32BE(5, 0)
    buff.writeUInt8(1,4)
    buff.writeUInt32BE(3, 5)
    this.#writeEncrypted( buff )
  }
  #openForWrite( filename ){
    const filenameBuffer = Buffer.from(filename, 'utf8')
    const packetLength = 9 + filenameBuffer.length + 4
    const buffer = Buffer.alloc(packetLength)

    buffer.writeUInt32BE(packetLength - 4, 0)
    buffer.writeUInt8(3, 4)
    buffer.writeUInt32BE(1, 5)
    buffer.writeUInt32BE(0x00000002, 9)
    filenameBuffer.copy(buffer, 13)

    this.#writeEncrypted(buffer)
  }
  #writeToFile(fileHandle, offset, data) {
    const fileHandleBuffer = Buffer.from(fileHandle, 'utf8');
    const dataBuffer = Buffer.from(data, 'utf8');
    const packetLength = 17 + fileHandleBuffer.length + dataBuffer.length;
    const buffer = Buffer.alloc(packetLength);
  
    buffer.writeUInt32BE(packetLength - 4, 0);
    buffer.writeUInt8(6, 4);
    buffer.writeUInt32BE(2, 5);
    fileHandleBuffer.copy(buffer, 9);
    buffer.writeBigUInt64BE(BigInt(offset), 9 + fileHandleBuffer.length);
    dataBuffer.copy(buffer, 17 + fileHandleBuffer.length);

    this.#writeEncrypted( buffer );
  }
  #closeWrite( fileHandle ){
    const fileHandleBuffer = Buffer.from(fileHandle, 'utf8');
    const packetLength = 9 + fileHandleBuffer.length;
    const buffer = Buffer.alloc(packetLength);
  
    buffer.writeUInt32BE(packetLength - 4, 0);
    buffer.writeUInt8(4, 4);
    buffer.writeUInt32BE(3, 5);
    fileHandleBuffer.copy(buffer, 9);
  
    this.#writeEncrypted(buffer);
  }
  #handleStatusResponse( buffer ){
    const requestId = buffer.readUInt32BE(5);    // Request ID (matches your previous request)
    const statusCode = buffer.readUInt32BE(9);   // Status code (e.g., 0 for success)
  
    if (statusCode === 0) {
      console.log(`Request ${requestId} completed successfully.`);
    } else {
      const errorMessageLength = buffer.readUInt32BE(13);  // Length of the error message
      const errorMessage = buffer.slice(17, 17 + errorMessageLength).toString('utf8');
      console.error(`Error on request ${requestId}: ${errorMessage} (Code: ${statusCode})`);
    }
  }
  #closeSubSytem(){
    this.#writeEncrypted( JSON.stringify({ type: "CHANNEL_CLOSE", service: "sftp" }) )
  }
  #disconnect( reasonCode = 11, description = "Client Disconnect"){
    const descriptionBuffer = Buffer.from(description, 'utf8');
    const descriptionLength = descriptionBuffer.length;
    const languageTagBuffer = Buffer.from('', 'utf8');
    const languageTagLength = languageTagBuffer.length;
  
    const packetLength = 1 + 4 + 4 + descriptionLength + 4 + languageTagLength;
    const buffer = Buffer.alloc(4 + packetLength);
  
    buffer.writeUInt32BE(packetLength, 0);
    buffer.writeUInt8(1, 4);
    buffer.writeUInt32BE(reasonCode, 5);
    buffer.writeUInt32BE(descriptionLength, 9)
    descriptionBuffer.copy(buffer, 13);  
    buffer.writeUInt32BE(languageTagLength, 13 + descriptionLength);
    languageTagBuffer.copy(buffer, 17 + descriptionLength);
  
    this.#writeEncrypted(buffer);
  }
  end(){
    this.#closeSubSytem()
    this.#disconnect()
    this.#connection.end()
  }
}

export default SFTPTransport