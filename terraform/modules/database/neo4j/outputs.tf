output "neo4j_service" {
  value = aws_ecs_service.neo4j_service.name
}
output "neo4j_backup_plan" {
  value = aws_backup_plan.this.id
}