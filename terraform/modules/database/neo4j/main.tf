module "neo4j" {
  source              = "./"
  vpc_id              = module.vpc.vpc_id
  ecs_cluster_name    = "neo4j-cluster"
  target_subnet_id    = module.vpc.subnets["data"]
  neo4j_docker_image  = "neo4j:enterprise"
  neo4j_auth          = "neo4j/password"
  instance_type       = "t3.small"
}