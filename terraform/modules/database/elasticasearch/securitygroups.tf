resource "aws_security_group" "sg_elasticsearch" {
  name        = "sg-elasticsearch"
  description = "Allow access to Elasticsearch"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Allow HTTP access to ES"
    from_port   = 9200
    to_port     = 9200
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    description = "Allow HTTP access to ES"
    from_port   = 9300
    to_port     = 9300
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}