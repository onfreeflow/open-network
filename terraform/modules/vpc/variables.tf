variable "vpc_cidr" {
  description = "FreeFlow Production VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_name" {
  description = "FreeFlow Production"
  type        = string
  default     = "freeflow-production-vpc"
}

variable "vpc_resource_name" {
  description = "Resource name for the VPC."
  type        = string
}

variable "subnets" {
  description = "Map of subnet names to CIDR blocks"
  type        = map(string)
  default = {
    data             = "10.0.0.0/19"
    orchestration    = "10.0.32.0/19"
    service_ocpp     = "10.0.64.0/19"
    service_gateway  = "10.0.96.0/19"
    service_service  = "10.0.128.0/19"
    networking       = "10.0.160.0/19"
    security         = "10.0.192.0/19"
    tools            = "10.0.224.0/19"
  }
}