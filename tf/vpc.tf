##############
# Amazon VPC #
##############

# Get the current availability zones for this region.
data "aws_availability_zones" "available" {
  state = "available"

  # Ignore local zones.
  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

# Amazon VPC with DNS hostnames enabled.
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# Subnet in each availability zone.
resource "aws_subnet" "public_subnet" {
  availability_zone       = data.aws_availability_zones.available.names[0]
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  vpc_id                  = aws_vpc.vpc.id
}

# Internet Gateway (IGW) for public subnets.
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
}

# Route table for public subnets.
resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

# Associate the route table with the public subnets.
resource "aws_route_table_association" "public_subnet_routes" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.route_table.id
}
