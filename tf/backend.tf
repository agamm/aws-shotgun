# A backend defines where Terraform stores its state data files.
# https://developer.hashicorp.com/terraform/language/settings/backends/configuration

#####################################
# DO NOT COMMIT YOUR TFSTATE TO GIT #
#####################################
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}
#####################################
# DO NOT COMMIT YOUR TFSTATE TO GIT #
#####################################
