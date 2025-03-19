variable "vpc_id" {
  description = "VPC ID where Elasticsearch will be deployed."
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for Elasticsearch VPC configuration."
  type        = list(string)
}

variable "es_security_group_ids" {
  description = "List of security group IDs for the Elasticsearch domain."
  type        = list(string)
  default     = []
}

variable "domain_name" {
  description = "Elasticsearch domain name."
  type        = string
  default     = "my-es-domain"
}

variable "elasticsearch_version" {
  description = "Elasticsearch version."
  type        = string
  default     = "7.10"
}

variable "instance_type" {
  description = "Instance type for Elasticsearch nodes."
  type        = string
  default     = "t3.small.elasticsearch"
}

variable "instance_count" {
  description = "Number of Elasticsearch instances."
  type        = number
  default     = 2
}

variable "ebs_enabled" {
  description = "Enable EBS storage for Elasticsearch."
  type        = bool
  default     = true
}

variable "ebs_volume_size" {
  description = "EBS volume size (in GB) for Elasticsearch nodes."
  type        = number
  default     = 10
}

variable "snapshot_start_hour" {
  description = "Hour of day (0-23) to start automated snapshots."
  type        = number
  default     = 0
}