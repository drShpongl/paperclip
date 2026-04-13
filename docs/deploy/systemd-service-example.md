# Systemd Service Example

This is a direct-checkout deployment pattern for running Paperclip from a git clone instead of a global npm install.

```ini
[Unit]
Description=PaperclipAI Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/work/paperclip
Environment=HOME=/root
Environment=PATH=/root/.opencode/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
Environment=GH_CONFIG_DIR=/root/.config/gh
Environment=PAPERCLIP_HOME=/var/lib/paperclip/.paperclip
Environment=DATABASE_URL=postgresql://paperclip:<password>@127.0.0.1:5432/paperclip
Environment=PAPERCLIP_DEPLOYMENT_MODE=authenticated
Environment=PAPERCLIP_DEPLOYMENT_EXPOSURE=public
Environment=PAPERCLIP_PUBLIC_URL=https://example.com
Environment=PAPERCLIP_AUTH_BASE_URL_MODE=explicit
Environment=BETTER_AUTH_SECRET=<secret>
ExecStartPre=/root/work/paperclip/scripts/paperclip-sync-workspace-instructions.sh
ExecStart=/usr/bin/env node /root/work/paperclip/cli/dist/index.js run
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Notes:

- `GH_CONFIG_DIR` keeps GitHub CLI auth available even when adapters use a temporary `XDG_CONFIG_HOME`.
- `ExecStartPre` materializes the managed instruction bundle files into each agent workspace.
- Build the checkout first so `cli/dist/index.js` exists.
