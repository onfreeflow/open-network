variable "vpc_id" {
  description = "The VPC ID where Neo4j will be deployed."
  type        = string
}

variable "ecs_cluster_name" {
  description = "Name for the ECS cluster."
  type        = string
  default     = "neo4j-cluster"
}

variable "target_subnet_id" {
  description = "Subnet ID in which to deploy the Neo4j service (should be the data subnet)."
  type        = string
}

variable "neo4j_docker_image" {
  description = "Docker image for Neo4j."
  type        = string
  default     = "neo4j:enterprise"
}

variable "neo4j_auth" {
  description = "Neo4j authentication (username/password)."
  type        = string
  default     = "neo4j/password"
}

variable "instance_type" {
  description = "EC2 instance type for ECS container hosts."
  type        = string
  default     = "t3.medium"
}

variable "backup_cron_schedule" {
  description = "Cron schedule for backups."
  type        = string
  default     = "cron(0 5 * * ? *)"
}

variable "backup_vault_name" {
  description = "Name of the backup vault."
  type        = string
  default     = "neo4j-backup-vault"
}

variable "sg_neo4j_allowed_ids" {
  description = "List of allowed security group IDs for RabbitMQ access"
  type        = list(string)
  default     = [
    aws.security_groups.sg_ocpp_broker.id,
    aws.security_groups.sg_remote_management.id,
    aws.security_groups.sg_soa_service.id
  ]
}

variable "neo4j_http_port" {
  description = "Neo4J HTTP Access port"
  type        = string
  default     = 7474
}
variable "neo4j_https_port" {
  description = "Neo4J HTTPS Access port"
  type        = string
  default     = 7473
}

variable "neo4j_bolt_port" {
  description = "Rabbit MQ Comms portal access port"
  type        = string
  default     = 7687
}