import { useNavigate, useParams } from "react-router-dom";
import type { Style } from "@/types";
import { StyleTemplate } from "@/components/templates";

export function StylePage() {
  const navigate = useNavigate();
  const { owner, repo } = useParams<{ owner: string; repo: string }>();

  if (!owner || !repo) {
    navigate("/");
    return null;
  }

  const handleSelect = (style: Style) => {
    navigate(`/${owner}/${repo}/${style}`);
  };

  return (
    <StyleTemplate owner={owner} repo={repo} onBack={() => navigate("/")} onSelect={handleSelect} />
  );
}
