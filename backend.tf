# Temporary websocket backend
data "dns_a_record_set" "tmp_socket" {
  host = "netgames.io"
}

output "tmp_socket_addrs" {
  value = join(",", data.dns_a_record_set.tmp_socket.addrs)
}

data "aws_ami" "al2" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amazon/amzn2-ami-kernel-5.10-hvm-2.0.20220719.0-x86_64-*"]
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
  iam_instance_profile   = "AmazonSSMRoleForInstancesQuickSetup" # Terminal access from console
  vpc_security_group_ids = [aws_security_group.allow_socket_connections.id]
  tags = {
    Name = "${var.project}-websocket-forwarder"
  }
  user_data = <<EOF
#!/bin/bash
echo "Installing requirements" > /home/ec2-user/requirments.log
echo "Update and save iptables" > /home/ec2-user/iptables.log
echo "Configuring listening and forward route" > /home/ec2-user/forwarder.log
EOF
}