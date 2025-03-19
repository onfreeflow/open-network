resource "aws_autoscaling_group" "this" {
  desired_capacity    = 2
  max_size            = 4
  min_size            = 2
  vpc_zone_identifier = [var.target_subnet_id]

  launch_template {
    id      = aws_launch_template.this.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "neo4j-ecs-instance"
    propagate_at_launch = true
  }
}