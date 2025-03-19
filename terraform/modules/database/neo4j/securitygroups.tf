resource "aws_security_group" "sg_neo4j" {
  name        = "sg-neo4j"
  description = "Allow Neo4j ports"
  vpc_id      = var.vpc_id
  
  dynamic "ingress" {
    for_each = var.sg_neo4j_allowed_ids
    content {
      description     = "Allow Neo4J access from other subnets"
      from_port       = var.neo4j_http_port
      to_port         = var.neo4j_https_port
      protocol        = "tcp"
      security_groups = ingress.value
    }
  }
  ingress {
    description = "Allow Neo4J access from other subnets"
    from_port       = var.neo4j_bolt_port
    to_port         = var.neo4j_bolt_port
    protocol        = "tcp"
    security_groups = [
      aws.security_groups.sg_soa_service,
      aws.security_groups.sg_ocpp_broker,
      aws.security_groups.sg_remote_management
    ]
  }
  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}