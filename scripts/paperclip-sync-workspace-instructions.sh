#!/usr/bin/env bash
set -euo pipefail

instance_root="${PAPERCLIP_HOME:-/var/lib/paperclip/.paperclip}/instances/default"
companies_dir="$instance_root/companies"
workspaces_dir="$instance_root/workspaces"

if [[ ! -d "$companies_dir" || ! -d "$workspaces_dir" ]]; then
  exit 0
fi

for instructions_dir in "$companies_dir"/*/agents/*/instructions; do
  [[ -d "$instructions_dir" ]] || continue

  agent_id="$(basename "$(dirname "$instructions_dir")")"
  workspace_dir="$workspaces_dir/$agent_id"
  mkdir -p "$workspace_dir"

  for source_file in "$instructions_dir"/*.md; do
    [[ -f "$source_file" ]] || continue
    target_file="$workspace_dir/$(basename "$source_file")"

    if [[ -L "$target_file" || -e "$target_file" ]]; then
      continue
    fi

    ln -s "$source_file" "$target_file"
  done
done
