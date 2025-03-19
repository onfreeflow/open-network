resource "aws_ecs_task_definition" "pilot_charger" {
  family                   = "pilot-charger-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name         = "pilot-charger"
      image        = "017820680958.dkr.ecr.us-east-1.amazonaws.com/life.ho2.ezcharge/test-pilot-charger:dev"
      portMappings = [{
        containerPort = 8080,
        hostPort      = 8080,
        protocol      = "tcp"
      }]
      environment = [
        { name = "NODE_ENV", value = "dev" }
        // add additional environment variables as needed
      ]
    }
  ])
}

resource "aws_ecs_service" "pilot_charger" {
  name            = "pilot-charger-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.pilot_charger.arn
  desired_count   = 0
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.public.id]
    security_groups = [aws_security_group.ecs.id]
    assign_public_ip = true
  }
}