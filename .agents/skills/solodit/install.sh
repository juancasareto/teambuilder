#!/bin/bash
set -e

SKILL_NAME="solodit"
REPO_URL="https://raw.githubusercontent.com/BowTiedSwan/solodit-api-skill/main/SKILL.md"

CLAUDE_DIR="$HOME/.claude/skills/$SKILL_NAME"
OPENCODE_DIR="$HOME/.config/opencode/skill/$SKILL_NAME"

install_skill() {
    local dir="$1"
    local name="$2"
    
    mkdir -p "$dir"
    
    echo "Downloading SKILL.md to $dir..."
    if curl -fsSL "$REPO_URL" -o "$dir/SKILL.md"; then
        echo "Installed $SKILL_NAME skill to $name"
        return 0
    else
        echo "Failed to download SKILL.md"
        return 1
    fi
}

echo "Installing Solodit API skill..."
echo ""

installed=0

if [ -d "$HOME/.claude" ] || command -v claude &> /dev/null; then
    if install_skill "$CLAUDE_DIR" "Claude Code"; then
        installed=1
    fi
fi

if [ -d "$HOME/.config/opencode" ] || command -v opencode &> /dev/null; then
    if install_skill "$OPENCODE_DIR" "OpenCode"; then
        installed=1
    fi
fi

if [ $installed -eq 0 ]; then
    echo "No supported AI coding assistant detected."
    echo "Installing to Claude Code location by default..."
    install_skill "$CLAUDE_DIR" "Claude Code"
fi

echo ""
echo "Installation complete!"
echo ""
echo "Next steps:"
echo "1. Get your API key from https://solodit.cyfrin.io (Profile > API Keys)"
echo "2. Set the environment variable: export CYFRIN_API_KEY=\"your_key_here\""
echo "3. Use the skill with: /solodit or search_vulnerabilities tool"
echo ""
