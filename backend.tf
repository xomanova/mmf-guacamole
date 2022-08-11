# Temporary websocket backend
data "aws_vpc" "default_vpc" {
  default = true
}

data "dns_a_record_set" "tmp_socket" {
  host = "netgames.io"
}

data "aws_ami" "al2" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-kernel-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["137112412989"] # Amazon
}

resource "aws_security_group" "allow_socket_connections" {
  name        = "allow_socket_connections"
  description = "Allow all inbound/outbound websockets traffic"

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "TLS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_tls"
  }
}

resource "aws_instance" "socket_router" {
  ami                    = data.aws_ami.al2.id
  instance_type          = "t3.micro"
  iam_instance_profile   = "AmazonSSMRoleForInstancesQuickSetup" # Enables terminal access from console
  vpc_security_group_ids = [aws_security_group.allow_socket_connections.id]
  tags = {
    Name = "${var.project}-websocket-forwarder"
  }
  user_data = <<EOF
#!/bin/bash
echo 1 >/proc/sys/net/ipv4/ip_forward
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination ${data.dns_a_record_set.tmp_socket.addrs[0]}:80
iptables -t nat -A POSTROUTING -p tcp -d ${data.dns_a_record_set.tmp_socket.addrs[0]} --dport 80 -j MASQUERADE
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination ${data.dns_a_record_set.tmp_socket.addrs[0]}:443
iptables -t nat -A POSTROUTING -p tcp -d ${data.dns_a_record_set.tmp_socket.addrs[0]} --dport 443 -j MASQUERADE
iptables-save
echo "80 and 443 port forwarding configured to ${data.dns_a_record_set.tmp_socket.addrs[0]}" > /home/ec2-user/forwarder.log
EOF
}

resource "aws_lb_target_group" "socket_80" {
  name        = "socket-80"
  target_type = "instance"
  port        = 80
  protocol    = "TCP"
  vpc_id      = data.aws_vpc.default_vpc.id
}

resource "aws_lb_target_group" "socket_443" {
  name        = "socket-443"
  target_type = "instance"
  port        = 443
  protocol    = "TCP"
  vpc_id      = data.aws_vpc.default_vpc.id
}

resource "aws_lb_target_group_attachment" "socket_tg_80_attach" {
  target_group_arn = aws_lb_target_group.socket_80.arn
  target_id        = aws_instance.socket_router.id
  port             = 80
}

resource "aws_lb_target_group_attachment" "socket_tg_443_attach" {
  target_group_arn = aws_lb_target_group.socket_443.arn
  target_id        = aws_instance.socket_router.id
  port             = 443
}

resource "aws_lb" "socket_nlb" {
  name               = "socket-nlb"
  internal           = true
  load_balancer_type = "network"
}

resource "aws_lb_listener" "socket_listener_80" {
  load_balancer_arn = aws_lb.socket_nlb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.socket_80.arn
  }
}

resource "aws_lb_listener" "socket_listener_443" {
  load_balancer_arn = aws_lb.socket_nlb.arn
  port              = "443"
  protocol          = "TLS"
  certificate_arn   = data.aws_acm_certificate.acm_cert.arn
  alpn_policy       = "HTTP2Preferred"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.socket_443.arn
  }
}