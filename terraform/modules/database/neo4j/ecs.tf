
resource "aws_ecs_cluster" "this" {
  name = var.ecs_cluster_name
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-ecs-hvm-*-x86_64-ebs"]
  }
}

resource "aws_launch_template" "this" {
  name_prefix   = "neo4j-ecs-"
  image_id      = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance_profile.name
  }

  user_data = base64encode(<<EOF
#!/bin/bash
echo ECS_CLUSTER=${aws_ecs_cluster.this.name} >> /etc/ecs/ecs.config
EOF
  )

  block_device_mappings {
    device_name = "/dev/xvdb"
    ebs {
      volume_size           = 100
      volume_type           = "gp2"
      delete_on_termination = true
    }
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "neo4j-ecs-instance"
    }
  }
}


resource "aws_ecs_task_definition" "neo4j_task" {
  family                   = "neo4j-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]
  cpu                      = "1024"
  memory                   = "2048"
  execution_role_arn       = aws_iam_role.ecs_instance_role.arn

  container_definitions = jsonencode([
    {
      name      = "neo4j",
      image     = var.neo4j_docker_image,
      essential = true,
      portMappings = [
        { containerPort = 7474, hostPort = 7474, protocol = "tcp" },
        { containerPort = 7687, hostPort = 7687, protocol = "tcp" }
      ],
      environment = [
        { name = "NEO4J_AUTH", value = var.neo4j_auth }
      ],
      mountPoints = [
        { containerPath = "/data", sourceVolume = "neo4j_data" }
      ]
    }
  ])

  volume {
    name = "neo4j_data"
    host_path { path = "/ecs/neo4j_data" }
  }
}

resource "aws_ecs_service" "neo4j_service" {
  name            = "neo4j-service"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.neo4j_task.arn
  desired_count   = 2
  launch_type     = "EC2"

  network_configuration {
    subnets         = [var.target_subnet_id]
    security_groups = [aws_security_group.neo4j_sg.id]
  }
}