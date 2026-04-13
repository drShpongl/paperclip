import { describe, expect, it } from "vitest";
import { parseIssuePathIdFromPath, parseIssueReferenceFromHref, remarkLinkIssueReferences } from "./issue-reference";

describe("issue-reference", () => {
  it("extracts issue ids from company-scoped issue paths", () => {
    expect(parseIssuePathIdFromPath("/PAP/issues/PAP-1271")).toBe("PAP-1271");
    expect(parseIssuePathIdFromPath("/issues/PAP-1179")).toBe("PAP-1179");
  });

  it("extracts issue ids from full issue URLs", () => {
    expect(parseIssuePathIdFromPath("http://localhost:3100/PAP/issues/PAP-1179")).toBe("PAP-1179");
  });

  it("normalizes bare identifiers and issue URLs into internal links", () => {
    expect(parseIssueReferenceFromHref("pap-1271")).toEqual({
      issuePathId: "PAP-1271",
      href: "/issues/PAP-1271",
    });
    expect(parseIssueReferenceFromHref("http://localhost:3100/PAP/issues/PAP-1179")).toEqual({
      issuePathId: "PAP-1179",
      href: "/issues/PAP-1179",
    });
  });

  it("normalizes exact inline-code-like issue identifiers", () => {
    expect(parseIssueReferenceFromHref("PAP-1271")).toEqual({
      issuePathId: "PAP-1271",
      href: "/issues/PAP-1271",
    });
  });

  it("does not linkify issue-like substrings inside hyphenated dataset names", () => {
    const tree = {
      type: "root",
      children: [{ type: "paragraph", children: [{ type: "text", value: "dataset ethusdt-linear-1-file-cache" }] }],
    };

    remarkLinkIssueReferences()(tree as never);

    expect(tree.children[0]?.children).toEqual([{ type: "text", value: "dataset ethusdt-linear-1-file-cache" }]);
  });
});
