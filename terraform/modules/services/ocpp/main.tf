resource "aws_ecr_repository" "ocpp_service" {
  name = "ocpp-service"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}