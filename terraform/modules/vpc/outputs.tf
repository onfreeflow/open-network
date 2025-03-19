output "vpc_id" {
  value = aws_vpc.this.id
}

output "subnets" {
  value = { for key, subnet in aws_subnet.this : key => subnet.id }
}

output "ipv6_cidr_block" {
  value = aws_vpc.this.ipv6_cidr_block
}