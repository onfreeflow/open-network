resource "aws_subnet" "networking" {
  vpc_id            = var.vpc.id
  cidr_block        = var.subnets["networking"]
  availability_zone = "us-east-1a"
}

resource "aws_mq_configuration" "rabbitmq_config" {
  name           = "rabbitmq-config"
  engine_type    = "RABBITMQ"
  engine_version = "3.8.6"  # Change as needed

  # Minimal configuration data; update this block as your requirements change.
  data = <<-EOF
  {
    "rabbitmq": {
      "plugins": ["rabbitmq_management"]
    }
  }
  EOF
}

# Amazon MQ Broker for RabbitMQ.
resource "aws_mq_broker" "rabbitmq" {
  broker_name         = "rabbitmq-broker"
  engine_type         = "RABBITMQ"
  engine_version      = "3.8.6"
  host_instance_type  = "mq.t3.small"
  deployment_mode     = "CASUAL_CLUSTER"
  publicly_accessible = false
  

  # Deploy the broker into the networking subnet.
  subnet_ids = [aws_subnet.networking.id]

  # Attach the security group that allows inbound connections from the defined subnets.
  security_groups = [aws_security_group.mq_broker_sg.id]

  # Associate the configuration
  configuration {
    id       = aws_mq_configuration.rabbitmq_config.id
    revision = aws_mq_configuration.rabbitmq_config.latest_revision
  }

  user {
    username = "rabbitmq"
    password = "rabbitmq"
  }

  # (Optional) Add any additional logging or maintenance parameters here.
}