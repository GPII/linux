#!/bin/bash
#
# This wrapper script bootstraps an environment to the point where Ansible roles can be used to set
# up the GPII Linux Framework.

set -e

dnf -y install ansible coreutils python-dnf

# Configure Ansible for local, non-SSH use only.
sed -i 's/^#transport.*/transport = local/g' /etc/ansible/ansible.cfg
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

ansible-galaxy install -fr requirements.yml

# Set up the GPII Framework and get the user's account/group name, shell, and home directory in the
# process. This information is required to run provisioning commands as the user and ensure the
# account exists before attempting to do this. The GPII_FRAMEWORK_DIR environment variable is used
# to figure out which directory commands should be run in.

current_user_name=$(logname)
current_group_name=$(id -ng $(logname))
current_user_shell=$(getent passwd $(logname) | cut -d: -f7)
current_home_dir=$(getent passwd $(logname) | cut -d: -f6)

ansible-playbook playbook.yml --extra-vars \
"nodejs_app_username=$current_user_name \
nodejs_app_groupname=$current_group_name \
nodejs_app_user_shell=$current_user_shell \
nodejs_app_home_dir=$current_home_dir \
nodejs_app_install_dir=$GPII_FRAMEWORK_DIR \
gpii_framework_username=$current_user_name \
gpii_framework_groupname=$current_group_name \
gpii_framework_user_home_dir=$current_home_dir" \
--tags="install,configure"
