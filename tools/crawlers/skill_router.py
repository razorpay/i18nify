#!/usr/bin/env python3
"""
TSF Skill Router — lightweight entry-point guard for the i18nify pipeline.

Intercepts vague user input before it ever hits crawl4ai_runner.py or PdfScraper.
If the input is broad (no action keywords or granularity hints), presents a
clarification menu and maps the reply to pipeline parameters.
"""
from __future__ import annotations

import re
import sys
from typing import Callable

# ── Router constants ───────────────────────────────────────────────────────────

# Keywords that signal the user already knows what they want.
_ACTION_KEYWORDS: set[str] = {
    "scrape", "fetch", "get", "extract", "generate", "build",
    "schema", "pydantic", "typescript", "utility", "script",
    "json", "csv", "report", "summary", "compare",
    "high-level", "broad", "summary", "chapter",
    "granular", "item-level", "line-item", "exact", "specific",
}

# Granularity hints embedded in the prompt itself.
_GRANULARITY_HINTS: dict[str, str] = {
    r"\b2-digit\b|\bchapter\b|\bhigh.level\b|\bbroad\b|\bsummary\b": "summary",
    r"\b6-digit\b|\b8-digit\b|\bitem.level\b|\bline.item\b|\bexact\b|\bspecific\b|\bhsn\b": "item",
}

# Output-mode hints.
_OUTPUT_HINTS: dict[str, str] = {
    r"\bschema\b|\bpydantic\b|\btypescript\b|\btypes?\b": "schema",
    r"\butility\b|\bscript\b|\bcode\b|\bmodule\b|\bfunction\b": "utility",
    r"\breport\b|\bmarkdown\b|\bsummary\b(?!.*data)": "report",
    r"\bjson\b|\bcsv\b|\braw\b|\bdata\b(?!.*schema)": "data",
}


# ── Clarification menu template ──────────────────────────────────────────────

_CLARIFICATION_MENU: str = """
I see you want to work with **{topic}**. To make sure I get you exactly what
you need, how would you like me to process this?

**1. Choose your depth:**
  • [A] High-level summaries (Broad categories, e.g. 2-digit chapter codes)
  • [B] Granular, specific line items (Exact data, e.g. 6-8 digit HSN codes)

**2. Choose your output:**
  • [1] Fetch the raw data (JSON/CSV)
  • [2] Generate a data schema (Pydantic / TypeScript)
  • [3] Build a Python utility script to process this data
  • [4] Produce a Markdown summary report

Please reply with your choices (e.g., "B and 2" or "A, 1, and 3").
"""


# ── Router core ──────────────────────────────────────────────────────────────

class SkillRouter:
    """Evaluates user input specificity and gates the pipeline behind a menu."""

    def __init__(self) -> None:
        self._menu_shown: bool = False

    def is_specific(self, user_input: str) -> bool:
        """Return True if the input already contains enough intent signals."""
        text = user_input.lower()

        # 1. Action keywords present?
        if any(kw in text for kw in _ACTION_KEYWORDS):
            return True

        # 2. Granularity explicitly stated?
        if any(re.search(pat, text) for pat in _GRANULARITY_HINTS):
            return True

        # 3. Output mode explicitly stated?
        if any(re.search(pat, text) for pat in _OUTPUT_HINTS):
            return True

        # 4. Topic is unambiguously precise (e.g. "ISO 4217 currency codes")
        #    Heuristic: contains a standards-body acronym + a domain keyword
        if re.search(r"\b(?:ISO|ITU|IANA|W3C|IEEE|RFC)\s*\d{3,5}\b", text):
            return True

        return False

    def present_menu(self, topic: str) -> str:
        """Return the clarification menu for the given topic."""
        self._menu_shown = True
        return _CLARIFICATION_MENU.format(topic=topic)

    def parse_reply(self, reply: str) -> dict[str, str]:
        """Parse a user's menu reply into pipeline parameters.

        Expected format: "B and 2", "A, 1, and 3", "B2", etc.
        """
        text = reply.lower()

        # Granularity
        if "b" in text or "granular" in text or "item" in text or "exact" in text:
            granularity = "item"
        elif "a" in text or "high" in text or "broad" in text or "summary" in text:
            granularity = "summary"
        else:
            granularity = "item"  # safer default for data accuracy

        # Output mode
        if re.search(r"\b2\b|\bschema\b|\bpydantic\b|\btypescript\b", text):
            output_mode = "schema"
        elif re.search(r"\b3\b|\bscript\b|\butility\b|\bcode\b", text):
            output_mode = "utility"
        elif re.search(r"\b4\b|\breport\b|\bmarkdown\b", text):
            output_mode = "report"
        elif re.search(r"\b1\b|\bjson\b|\bcsv\b|\braw\b|\bdata\b", text):
            output_mode = "data"
        else:
            output_mode = "data"  # default

        return {
            "granularity": granularity,
            "output_mode": output_mode,
        }

    def route(
        self,
        user_input: str,
        executor: Callable[[dict], str],
    ) -> str:
        """Main entry-point: either present the menu or execute the pipeline.

        Args:
            user_input: Raw user prompt.
            executor:   Callable that receives pipeline parameters and runs the
                        appropriate Recipes / scrapers. Must return a string.

        Returns:
            Menu text (if vague) or executor result (if specific).
        """
        if self.is_specific(user_input):
            # Derive parameters from the prompt itself
            params = self._derive_params(user_input)
            return executor(params)

        # Vague — present clarification menu
        return self.present_menu(user_input)

    # ── Internals ────────────────────────────────────────────────────────────

    @staticmethod
    def _derive_params(user_input: str) -> dict[str, str]:
        """Infer pipeline parameters from an already-specific prompt."""
        text = user_input.lower()
        granularity = "summary"
        for pat, val in _GRANULARITY_HINTS.items():
            if re.search(pat, text):
                granularity = val
                break

        output_mode = "data"
        for pat, val in _OUTPUT_HINTS.items():
            if re.search(pat, text):
                output_mode = val
                break

        return {"granularity": granularity, "output_mode": output_mode}


# ── Example executor (stub — wire to actual pipeline) ──────────────────────────

def _example_executor(params: dict[str, str]) -> str:
    """Placeholder executor — replace with real crawl4ai_runner.py call."""
    return (
        f"Pipeline executed with granularity='{params['granularity']}' "
        f"and output_mode='{params['output_mode']}'."
    )


# ── CLI entry-point for testing ────────────────────────────────────────────────

def main() -> None:
    router = SkillRouter()

    if len(sys.argv) < 2:
        print("Usage: python skill_router.py '<user prompt>'")
        print()
        print("Example (vague):  python skill_router.py 'India GST'")
        print("Example (specific): python skill_router.py 'Generate a Pydantic schema for 8-digit GST rates'")
        sys.exit(1)

    user_input = sys.argv[1]
    result = router.route(user_input, _example_executor)
    print(result)


if __name__ == "__main__":
    main()
