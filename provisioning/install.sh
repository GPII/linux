#!/bin/bash
#
# This wrapper script bootstraps an environment to the point from where Ansible roles can be used
# to set up the GPII Linux Framework. 

set -e

dnf -y install ansible python-dnf

# Configure Ansible for local, non-SSH use only.
sed -i 's/^transport.*/transport = local/g' /etc/ansible/ansible.cfg
sed -i 's/^#host_key_checking.*$/host_key_checking\ \=\ False/g' /etc/ansible/ansible.cfg
cat <<-EOF > /etc/ansible/hosts
[local]
localhost
EOF

# Enable the official Google Chrome YUM repository.
rpm --import https://dl-ssl.google.com/linux/linux_signing_key.pub

cat <<-EOF > /etc/yum.repos.d/google-chrome.repo
[google-chrome]
name=google-chrome - \$basearch
baseurl=http://dl.google.com/linux/chrome/rpm/stable/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://dl-ssl.google.com/linux/linux_signing_key.pub
EOF

# Deploy the GPII Framework.
ansible-galaxy install -fr requirements.yml
ansible-playbook playbook.yml --tags="install,configure"