module "vpc" {
  source             = "./modules/vpc"
  vpc_cidr_block     = var.vpc_cidr
  vpc_resource_name  = var.vpc_name
  subnet_cidr_map    = var.subnets
}

resource "aws_vpc" "this" {
  cidr_block                       = var.vpc_cidr
  assign_generated_ipv6_cidr_block = true
  enable_dns_support               = true
  enable_dns_hostnames             = true

  tags = {
    Name = var.vpc_resource_name
  }
}

data "aws_availability_zones" "available" {}

locals {
  subnet_keys = sort(keys(var.subnets))
}

resource "aws_subnet" "this" {
  for_each = var.subnets
  vpc_id   = aws_vpc.this.id
  cidr_block = each.value
  availability_zone = element(data.aws_availability_zones.available.names, 0)
  assign_ipv6_address_on_creation = true
  ipv6_cidr_block = cidrsubnet(aws_vpc.this.ipv6_cidr_block, 8, index(local.subnet_keys, each.key))
  tags = {
    Name = "${var.vpc_resource_name}-${each.key}-subnet"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.this.id
  tags = {
    Name = "${var.vpc_resource_name}-igw"
  }
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  route {
    ipv6_cidr_block = "::/0"
    gateway_id      = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.vpc_resource_name}-rt"
  }
}

resource "aws_route_table_association" "rta" {
  for_each       = aws_subnet.this
  subnet_id      = each.value.id
  route_table_id = aws_route_table.rt.id
}