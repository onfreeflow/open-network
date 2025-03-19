module "elasticsearch" {
  source                = "./"
  vpc_id                = module.vpc.vpc_id
  subnet_ids            = [ module.vpc.subnets["data"] ]
  es_security_group_ids = [ aws_security_group.sg_elasticsearch.id ]
  domain_name           = "com.onfreeflow.data.elasticsearch"
  elasticsearch_version = "7.10"
  instance_type         = "t3.small.elasticsearch"
  instance_count        = 0
  ebs_enabled           = true
  ebs_volume_size       = 100
  snapshot_start_hour   = 0
}

resource "aws_elasticsearch_domain" "this" {
  domain_name           = var.domain_name
  elasticsearch_version = var.elasticsearch_version

  cluster_config {
    instance_type          = var.instance_type
    instance_count         = var.instance_count
    zone_awareness_enabled = true
  }

  ebs_options {
    ebs_enabled = var.ebs_enabled
    volume_size = var.ebs_volume_size
    volume_type = "gp2"
  }

  snapshot_options {
    automated_snapshot_start_hour = var.snapshot_start_hour
  }

  vpc_options {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.es_security_group_ids
  }

  advanced_options = {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  tags = {
    Domain = var.domain_name
  }
}