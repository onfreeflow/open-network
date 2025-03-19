resource "aws_security_group" "sg_rabbitmq" {
  name        = "sg-rabbitmq"
  description = "Security group for Amazon MQ RabbitMQ broker"
  vpc_id      = var.vpc.id

  # Allow RabbitMQ access from the other security groups
  dynamic "ingress" {
    for_each = var.sg_rabbitmq_allowed_ids
    content {
      from_port       = var.rabbitmq_comm_port
      to_port         = var.rabbitmq_comm_port
      protocol        = "tcp"
      security_groups = ingress.value
      description     = "Allow RabbitMQ access from security group ${ingress.value}"
    }
  }
  ingress {
    from_port = var.rabbitmq_mgmt_port
    to_port   = var.rabbitmq_mgmt_port
    protocol  = "tcp"
    cidr_blocks = [ "47.39.74.27/32" ]
    description = "Allow for management by IP"
  }

  # Egress rule to allow all outbound traffic.
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}