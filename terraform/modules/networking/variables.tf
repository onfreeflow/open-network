variable "sg_rabbitmq_allowed_ids" {
  description = "List of allowed security group IDs for RabbitMQ access"
  type        = list(string)
  default     = [
    aws_security_group.sg_rabbitmq.id,
    aws_security_group.sg_soa_service.id,
    aws_security_group.sg_soa_gateway.id,
    aws_security_group.sg_remote_management.id
  ]
}

variable "rabbitmq_comm_port" {
  description = "Rabbit MQ Comms portal access port"
  type        = string
  default     = 5672
}

variable "rabbitmq_mgmt_port" {
  description = "Rabbit MQ Managment portal access port"
  type        = string
  default     = 15672
}