resource "aws_ecr_repository" "pilot_charger" {
  name = "pilot-charger"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}