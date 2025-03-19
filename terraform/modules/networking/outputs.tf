output "mq_broker_endpoints" {
  description = "Endpoints for the RabbitMQ broker"
  value       = aws_mq_broker.rabbitmq.endpoints
}