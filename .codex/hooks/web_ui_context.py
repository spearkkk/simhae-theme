#!/usr/bin/env python3
"""Supply repo-local web design guidance to Codex at relevant lifecycle points."""

from __future__ import annotations

import json
import sys


def main() -> None:
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, OSError):
        return

    event_name = event.get("hook_event_name")
    if event_name == "SessionStart":
        context = (
            "For any web UI work in this repository, follow AGENTS.md and read "
            "web/DESIGN.md before editing. Reuse the existing shadcn components, "
            "semantic palette tokens, spacing rhythm, and surface recipes. "
            "Before finishing, inspect desktop/mobile rendering and reduced motion."
        )
    elif event_name == "PostToolUse":
        tool_input = json.dumps(event.get("tool_input", {}), ensure_ascii=False)
        if "web/src/" not in tool_input:
            return
        context = (
            "A web UI source file changed. Recheck web/DESIGN.md and verify the "
            "change uses existing semantic tokens and component recipes, with "
            "consistent section spacing, mobile layout, and reduced-motion behavior."
        )
    else:
        return

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": event_name,
                    "additionalContext": context,
                }
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
