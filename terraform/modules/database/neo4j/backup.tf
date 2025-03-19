module "neo4j_backup" {
  vpc_id               = var.vpc_id
  source               = "./"
  backup_cron_schedule = "cron(0 5 * * ? *)"
  backup_vault_name    = "neo4j-backup-vault"
  target_subnet_id     = "data"
}

resource "aws_backup_vault" "this" {
  name = var.backup_vault_name
}

resource "aws_backup_plan" "this" {
  name = "neo4j-backup-plan"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.this.name
    schedule          = var.backup_cron_schedule
    lifecycle {
      cold_storage_after = 90
      delete_after       = 120
    }
  }
}

resource "aws_backup_selection" "this" {
  name         = "neo4j-backup-selection"
  plan_id      = aws_backup_plan.this.id
  # Use an appropriate IAM role ARN for backups in production.
  iam_role_arn = aws_iam_role.ecs_instance_role.arn

  resources = [
    # Add resource ARNs (e.g., EBS volumes) to be backed up.
  ]
}