resource "aws_security_group" "sg_service_ocpp" {
  name   = "sg-service-ocpp"
  vpc_id = aws_vpc.main.id
  ingress {
    from_port = 6907
    to_port   = 6907
    protocol  = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}